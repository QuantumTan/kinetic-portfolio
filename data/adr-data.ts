// ============================================================
// DATA: adr-data.ts (ARCHITECTURE DECISION RECORDS // ADR)
// ============================================================

export interface ADR {
  id: string;
  projectId: string;
  number: string;
  title: string;
  status: "ACCEPTED" | "SUPERSEDED" | "PROPOSED";
  date: string;
  context: string;
  decision: string;
  consequences: {
    positive: string[];
    negative: string[];
  };
  complianceCodeSnippet?: {
    filename: string;
    language: string;
    code: string;
  };
}

export const adrRecords: Record<string, ADR[]> = {
  "crms-peguit": [
    {
      id: "adr-001",
      projectId: "crms-peguit",
      number: "ADR-001",
      title: "Domain Layer Isolation from EF Core & Persistence Dependencies",
      status: "ACCEPTED",
      date: "2024-11-12",
      context:
        "In enterprise CRM software, business logic often gets tightly coupled to ORM frameworks (like Entity Framework Core) via database attributes ([Key], [ForeignKey]) or DbContext references. This causes schema changes to break business rules and prevents pure unit testing without in-memory database mocks.",
      decision:
        "Isolate CRMS.Domain into a pure POCO library with zero external NuGet dependencies. Entity mappings are strictly configured in CRMS.Infrastructure via Fluent API (IEntityTypeConfiguration<T>). Domain Entities enforce invariants via private setters and factory methods.",
      consequences: {
        positive: [
          "Pure, lightning-fast domain unit tests without database or mocking overhead.",
          "Database engine can be swapped or migrated without altering core CRM business logic.",
          "Entities represent true Domain Aggregates rather than anemic database rows.",
        ],
        negative: [
          "Requires explicit Fluent API configuration classes in Infrastructure for every entity.",
          "Slightly higher initial boilerplate compared to simple attribute decorations.",
        ],
      },
      complianceCodeSnippet: {
        filename: "CustomerConfiguration.cs",
        language: "csharp",
        code: `// CRMS.Infrastructure/Data/Configurations/CustomerConfiguration.cs
public class CustomerConfiguration : IEntityTypeConfiguration<Customer>
{
    public void Configure(EntityTypeBuilder<Customer> builder)
    {
        builder.ToTable("Customers");
        builder.HasKey(c => c.Id);
        
        // Value object conversion
        builder.OwnsOne(c => c.Address, a =>
        {
            a.Property(p => p.Street).HasMaxLength(120).IsRequired();
            a.Property(p => p.City).HasMaxLength(60).IsRequired();
            a.Property(p => p.PostalCode).HasMaxLength(20);
        });

        builder.Property(c => c.CreditLimit)
               .HasPrecision(18, 2)
               .IsRequired();

        // Enforce soft delete filter
        builder.HasQueryFilter(c => !c.IsDeleted);
        builder.HasIndex(c => c.IsDeleted);
    }
}`,
      },
    },
    {
      id: "adr-002",
      projectId: "crms-peguit",
      number: "ADR-002",
      title: "MediatR CQRS Command/Query Dispatching vs Service Layer Antipattern",
      status: "ACCEPTED",
      date: "2024-12-04",
      context:
        "Traditional monolithic 'Manager' or 'Service' classes (e.g., CustomerService with 30 methods) frequently turn into bloated god-classes that violate the Single Responsibility Principle and create merge conflicts in team workflows.",
      decision:
        "Adopt the Command Query Responsibility Segregation (CQRS) pattern mediated by MediatR in CRMS.Application. Each user intent is an isolated request (IRequest<TResponse>) processed by an autonomous Handler with pre-execution FluentValidation pipeline behaviors.",
      consequences: {
        positive: [
          "High cohesion: Each use-case (CreateDeal, CloseTicket) has its own isolated handler and test file.",
          "Cross-cutting concerns (logging, transaction scopes, validation) execute cleanly in MediatR pipeline behaviors.",
          "API Controllers remain ultralight single-line dispatchers.",
        ],
        negative: [
          "More files and classes in the Application project.",
          "Runtime discovery requires proper assembly registration in Program.cs.",
        ],
      },
      complianceCodeSnippet: {
        filename: "ValidationBehavior.cs",
        language: "csharp",
        code: `// CRMS.Application/Common/Behaviors/ValidationBehavior.cs
public class ValidationBehavior<TRequest, TResponse>(IEnumerable<IValidator<TRequest>> validators)
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken ct)
    {
        if (!validators.Any()) return await next();

        var context = new ValidationContext<TRequest>(request);
        var validationResults = await Task.WhenAll(
            validators.Select(v => v.ValidateAsync(context, ct)));
            
        var failures = validationResults
            .SelectMany(r => r.Errors)
            .Where(f => f != null)
            .ToList();

        if (failures.Count != 0)
            throw new ValidationException(failures);

        return await next();
    }
}`,
      },
    },
  ],
  "crm-system": [
    {
      id: "adr-003",
      projectId: "crm-system",
      number: "ADR-003",
      title: "Pest PHP Unit & Feature Testing Suite with Database Transactions",
      status: "ACCEPTED",
      date: "2025-01-18",
      context:
        "Enterprise CRM lifecycle stages (Lead -> Deal -> Negotiation -> Won/Lost) involve complex state transitions, RBAC permissions, and notification triggers. Manual browser testing cannot reliably prevent regression across multi-role workflows.",
      decision:
        "Enforce automated testing with Pest PHP and Laravel's RefreshDatabase / DatabaseTransactions traits. Every FormRequest, Policy, and Pipeline transition must have unit/feature test coverage simulating Admin, Manager, and Sales representative roles.",
      consequences: {
        positive: [
          "Zero regression during Laravel 12 version upgrades and migration changes.",
          "Pest's clean expressive syntax makes test expectations self-documenting for team review.",
          "CI pipeline runs full test matrix in under 8 seconds.",
        ],
        negative: [
          "Requires maintaining seeders and factories for complex related models (Deals, Stages, Users).",
        ],
      },
      complianceCodeSnippet: {
        filename: "DealPipelineTest.php",
        language: "php",
        code: `// tests/Feature/DealPipelineTest.php
use App\Models\User;
use App\Models\Deal;
use App\Models\PipelineStage;

it('forbids sales reps from closing deals without manager approval', function () {
    $salesUser = User::factory()->create(['role' => 'SALES_REP']);
    $deal = Deal::factory()->create(['stage' => PipelineStage::NEGOTIATION]);

    $this->actingAs($salesUser)
         ->patchJson("/api/deals/{$deal->id}/close", ['status' => 'CLOSED_WON'])
         ->assertStatus(403)
         ->assertJsonPath('error', 'REQUIRES_MANAGER_OVERRIDE');

    expect($deal->fresh()->stage)->toBe(PipelineStage::NEGOTIATION);
});`,
      },
    },
    {
      id: "adr-004",
      projectId: "crm-system",
      number: "ADR-004",
      title: "Optimistic Concurrency & DB Transaction Locks for Kanban Drag-and-Drop",
      status: "ACCEPTED",
      date: "2025-02-02",
      context:
        "When multiple sales reps update customer pipeline status concurrently on Kanban boards, race conditions can cause out-of-order stage updates or incorrect historical pipeline logs.",
      decision:
        "Wrap stage transitions in atomic DB transactions with row-level pessimistic locking (lockForUpdate) on the target Deal, accompanied by an updatedAt timestamp verification token.",
      consequences: {
        positive: [
          "Prevents duplicate stage transitions and inconsistent activity logging.",
          "Guarantees that pipeline revenue aggregates remain 100% mathematically correct.",
        ],
        negative: [
          "Requires brief row lock acquisition, requiring minimal database connection timeouts.",
        ],
      },
      complianceCodeSnippet: {
        filename: "TransitionDealStageAction.php",
        language: "php",
        code: `// app/Actions/Deals/TransitionDealStageAction.php
public function execute(int $dealId, int $newStageId, int $userId): Deal
{
    return DB::transaction(function () use ($dealId, $newStageId, $userId) {
        $deal = Deal::where('id', $dealId)->lockForUpdate()->firstOrFail();
        $oldStageId = $deal->stage_id;

        $deal->update(['stage_id' => $newStageId]);

        DealActivityLog::create([
            'deal_id' => $deal->id,
            'user_id' => $userId,
            'from_stage_id' => $oldStageId,
            'to_stage_id' => $newStageId,
            'timestamp' => now(),
        ]);

        return $deal;
    });
}`,
      },
    },
  ],
  "swinetrack-pos": [
    {
      id: "adr-005",
      projectId: "swinetrack-pos",
      number: "ADR-005",
      title: "Server-Rendered Blade + Vite vs Heavy Client SPA for Rural Agricultural Terminals",
      status: "ACCEPTED",
      date: "2024-09-10",
      context:
        "Commercial agricultural weigh stations and livestock markets often operate on low-power hardware (refurbished POS PCs, budget tablets) with intermittent 3G/4G connectivity.",
      decision:
        "Avoid heavy JavaScript single-page application (SPA) bundles. Implement server-rendered Laravel 12 Blade with lightweight Alpine.js / Tailwind CSS, delivering instant server-evaluated tax, weight, and pricing computations with minimal client memory usage.",
      consequences: {
        positive: [
          "Near-zero client bundle download size (< 45KB JS).",
          "Sub-100ms cold render times on budget POS hardware.",
          "All weight-to-price settlement logic is kept secure on the server with zero client-tampering risks.",
        ],
        negative: [
          "Full page transitions for primary route changes (mitigated by Turbo / quick Vite assets).",
        ],
      },
    },
  ],
  portfolio: [
    {
      id: "adr-006",
      projectId: "portfolio",
      number: "ADR-006",
      title: "Hybrid Monospace HUD & High-Clarity Sans for Technical Portfolios",
      status: "ACCEPTED",
      date: "2025-03-01",
      context:
        "Portfolios using full pixel fonts for long-form text suffer from extreme cognitive fatigue during 10-second recruiter scans, reducing interview conversions.",
      decision:
        "Establish a clear typographical boundary: Silkscreen exclusively for micro-status badges, JetBrains Mono for system metrics and code paths, and clean high-legibility sans for project descriptions and engineering narratives.",
      consequences: {
        positive: [
          "Maintains distinct systems-operator personality while ensuring instant recruiter readability.",
          "High contrast compliance across dark and light monochrome themes.",
        ],
        negative: [
          "Requires strict design discipline when building new UI components.",
        ],
      },
    },
  ],
};
