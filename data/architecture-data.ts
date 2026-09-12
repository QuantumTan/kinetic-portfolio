// ============================================================
// DATA: architecture-data.ts (SYSTEM ARCHITECTURE SPECIFICATIONS)
// ============================================================

export interface ArchitectureLayer {
  id: string;
  name: string;
  tag: string;
  tierNumber: string;
  responsibility: string;
  keyPatterns: string[];
  dependencies: string;
  directory: string;
  codeSnippet?: {
    filename: string;
    language: string;
    code: string;
  };
  highlights: string[];
}

export interface SchemaColumn {
  name: string;
  type: string;
  constraints?: string[]; // "PK", "FK", "UNIQUE", "NOT NULL", "INDEX"
  foreignRef?: string;
  description?: string;
}

export interface SchemaTable {
  name: string;
  description: string;
  recordCountEst?: string;
  columns: SchemaColumn[];
}

export interface PipelineStep {
  step: number;
  label: string;
  layer: string;
  status: "OK" | "PROCESSING" | "VALIDATED" | "COMMITTED";
  description: string;
  telemetry: string;
  samplePayload?: string;
}

export interface ProjectArchitecture {
  id: string;
  code: string;
  name: string;
  pattern: string;
  stackSummary: string;
  description: string;
  tanPrompt: string;
  layers: ArchitectureLayer[];
  tables: SchemaTable[];
  pipeline: {
    title: string;
    triggerEndpoint: string;
    steps: PipelineStep[];
  };
}

export const architectureData: Record<string, ProjectArchitecture> = {
  "crms-peguit": {
    id: "crms-peguit",
    code: "ARCH-01",
    name: "CRMS_PEGUIT (.NET 8 CLEAN ARCHITECTURE)",
    pattern: "Clean Onion Architecture // Domain-Driven Design (DDD)",
    stackSummary: "C# 12 • .NET 8 • ASP.NET Core Web API • EF Core • SQL Server • MediatR • FluentValidation",
    description:
      "Enterprise multi-tier CRM engineered with strict Clean Architecture. The Core Domain is isolated with zero external dependencies, enforcing business rules and aggregate invariants. Persistence and infrastructure plug into the Application contracts via dependency injection.",
    tanPrompt:
      "Explain Jonathan's Clean Architecture implementation in CRMS_Peguit, specifically how the Domain layer is decoupled from Entity Framework Core.",
    layers: [
      {
        id: "api",
        name: "Web API / Presentation",
        tag: "CRMS.Api",
        tierNumber: "01",
        responsibility:
          "Exposes secure RESTful HTTP endpoints, handles JWT bearer tokens, enforces CORS/rate limiting, and acts as the composition root for Dependency Injection.",
        keyPatterns: ["RESTful Controllers", "Global Exception Filter", "JWT Authentication", "Swagger/OpenAPI", "DI Composition Root"],
        dependencies: "Depends on CRMS.Application and CRMS.Infrastructure (for DI container binding only).",
        directory: "src/CRMS.Api/Controllers, src/CRMS.Api/Middlewares",
        codeSnippet: {
          filename: "DealsController.cs",
          language: "csharp",
          code: `[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class DealsController(ISender mediator) : ControllerBase
{
    [HttpPost]
    [ProducesResponseType(typeof(DealDto), StatusCodes.Status201Created)]
    public async Task<IActionResult> Create([FromBody] CreateDealCommand command, CancellationToken ct)
    {
        var result = await mediator.Send(command, ct);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }
}`,
        },
        highlights: [
          "Zero direct database references in controllers",
          "Controller endpoints delegate directly to CQRS mediator handlers",
          "Standardized problem-details RFC 7807 error responses",
        ],
      },
      {
        id: "application",
        name: "Application Orchestration",
        tag: "CRMS.Application",
        tierNumber: "02",
        responsibility:
          "Coordinates business use cases, orchestrates command/query dispatching via MediatR, executes input validation with FluentValidation, and declares repository interfaces.",
        keyPatterns: ["CQRS (Commands & Queries)", "MediatR Pipeline Behaviors", "FluentValidation", "DTO Projections", "Repository Contracts"],
        dependencies: "Depends exclusively on CRMS.Domain. Zero references to ASP.NET Core Web or EF Core.",
        directory: "src/CRMS.Application/Commands, src/CRMS.Application/Queries, src/CRMS.Application/Interfaces",
        codeSnippet: {
          filename: "CreateDealCommandHandler.cs",
          language: "csharp",
          code: `public class CreateDealCommandHandler(
    IDealRepository dealRepo,
    ICustomerRepository customerRepo,
    IUnitOfWork unitOfWork) : IRequestHandler<CreateDealCommand, DealDto>
{
    public async Task<DealDto> Handle(CreateDealCommand req, CancellationToken ct)
    {
        var customer = await customerRepo.GetByIdAsync(req.CustomerId, ct)
            ?? throw new NotFoundException($"Customer {req.CustomerId} not found");

        var deal = Deal.Create(customer.Id, req.PipelineStageId, req.Value, req.Title);
        await dealRepo.AddAsync(deal, ct);
        await unitOfWork.SaveChangesAsync(ct);

        return deal.ToDto();
    }
}`,
        },
        highlights: [
          "Cross-cutting MediatR pipeline behaviors for validation and logging",
          "Repository interfaces decouple business commands from relational database engines",
          "Strict DTO projections prevent over-posting and entity leaking",
        ],
      },
      {
        id: "domain",
        name: "Core Domain & Business Invariants",
        tag: "CRMS.Domain",
        tierNumber: "03",
        responsibility:
          "The heart of the system containing core enterprise business rules, domain entities, value objects, aggregates, and domain-level exceptions. Completely independent of any external packages or frameworks.",
        keyPatterns: ["Domain-Driven Design (DDD)", "Rich Domain Entities", "Value Objects", "Invariant Protection", "Custom Domain Exceptions"],
        dependencies: "Zero dependencies. Pure C# standard library only.",
        directory: "src/CRMS.Domain/Entities, src/CRMS.Domain/Enums, src/CRMS.Domain/Exceptions",
        codeSnippet: {
          filename: "Deal.cs",
          language: "csharp",
          code: `public sealed class Deal : AggregateRoot<Guid>
{
    public Guid CustomerId { get; private set; }
    public int StageId { get; private set; }
    public Money Value { get; private set; }
    public DealStatus Status { get; private set; }

    public static Deal Create(Guid customerId, int stageId, decimal amount, string title)
    {
        if (amount <= 0)
            throw new InvalidDealValueException("Deal value must be strictly greater than zero.");

        return new Deal(Guid.NewGuid(), customerId, stageId, new Money(amount, "USD"), DealStatus.Active);
    }

    public void MoveToStage(int targetStageId, decimal probability)
    {
        if (Status != DealStatus.Active)
            throw new InvalidOperationException("Cannot advance a closed or archived deal.");
        StageId = targetStageId;
    }
}`,
        },
        highlights: [
          "Private property setters guarantee encapsulation and valid domain states",
          "Rich value objects (Money, Email) prevent primitive obsession",
          "Invariants are enforced before entities are saved to persistence",
        ],
      },
      {
        id: "infrastructure",
        name: "Infrastructure & Persistence",
        tag: "CRMS.Infrastructure",
        tierNumber: "04",
        responsibility:
          "Implements repository interfaces declared in Application, configures Entity Framework Core DbContext, manages relational SQL Server mappings via Fluent API, and executes database migrations.",
        keyPatterns: ["EF Core 8 DbContext", "Fluent API Configurations", "Unit of Work Pattern", "Automated SQL Migrations", "Repository Implementations"],
        dependencies: "Implements CRMS.Application and references CRMS.Domain.",
        directory: "src/CRMS.Infrastructure/Persistence, src/CRMS.Infrastructure/Configurations, src/CRMS.Infrastructure/Repositories",
        codeSnippet: {
          filename: "DealConfiguration.cs",
          language: "csharp",
          code: `public class DealConfiguration : IEntityTypeConfiguration<Deal>
{
    public void Configure(EntityTypeBuilder<Deal> builder)
    {
        builder.ToTable("Deals");
        builder.HasKey(d => d.Id);

        builder.OwnsOne(d => d.Value, money => {
            money.Property(m => m.Amount).HasColumnType("decimal(18,2)").IsRequired();
            money.Property(m => m.Currency).HasMaxLength(3).IsRequired();
        });

        builder.HasOne<Customer>()
            .WithMany()
            .HasForeignKey(d => d.CustomerId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}`,
        },
        highlights: [
          "Explicit Fluent API entity configurations isolate DB specifics from entity classes",
          "Scoped Unit of Work manages database transaction scopes atomically",
          "Automated schema migrations keep dev and production SQL schemas synchronized",
        ],
      },
    ],
    tables: [
      {
        name: "Customers",
        description: "Primary customer profiles, organization details, and account lifecycles.",
        columns: [
          { name: "Id", type: "uniqueidentifier", constraints: ["PK", "NOT NULL"], description: "Customer GUID identifier" },
          { name: "CompanyName", type: "nvarchar(200)", constraints: ["NOT NULL"], description: "Registered enterprise name" },
          { name: "ContactEmail", type: "nvarchar(256)", constraints: ["NOT NULL", "INDEX"], description: "Primary operational contact email" },
          { name: "Status", type: "int", constraints: ["NOT NULL"], description: "Enum (1=Lead, 2=Active, 3=Dormant)" },
          { name: "AssignedSalesRepId", type: "uniqueidentifier", constraints: ["FK", "NULL"], foreignRef: "Users.Id" },
          { name: "CreatedAtUtc", type: "datetime2", constraints: ["NOT NULL"], description: "UTC timestamp of registration" },
        ],
      },
      {
        name: "Pipelines",
        description: "Configurable deal stages and sales velocity progression metrics.",
        columns: [
          { name: "Id", type: "int", constraints: ["PK", "IDENTITY"], description: "Sequential stage identifier" },
          { name: "StageName", type: "nvarchar(100)", constraints: ["NOT NULL"], description: "Stage title (e.g. Qualification, Proposal, Won)" },
          { name: "OrderIndex", type: "int", constraints: ["NOT NULL"], description: "Sequence order in Kanban pipeline" },
          { name: "WinProbability", type: "decimal(5,2)", constraints: ["NOT NULL"], description: "Expected closure percentage" },
        ],
      },
      {
        name: "Deals",
        description: "Active business opportunities, monetary valuations, and pipeline state.",
        columns: [
          { name: "Id", type: "uniqueidentifier", constraints: ["PK", "NOT NULL"], description: "Unique Deal GUID" },
          { name: "CustomerId", type: "uniqueidentifier", constraints: ["FK", "NOT NULL"], foreignRef: "Customers.Id", description: "Target client reference" },
          { name: "PipelineId", type: "int", constraints: ["FK", "NOT NULL"], foreignRef: "Pipelines.Id", description: "Current stage in pipeline" },
          { name: "DealValueAmount", type: "decimal(18,2)", constraints: ["NOT NULL"], description: "Monetary amount" },
          { name: "Currency", type: "nvarchar(3)", constraints: ["NOT NULL"], description: "ISO 4217 Currency Code (USD/PHP)" },
          { name: "ClosedAtUtc", type: "datetime2", constraints: ["NULL"], description: "Timestamp when deal reached Won/Lost" },
        ],
      },
      {
        name: "Interactions",
        description: "Chronological log of customer touchpoints (calls, meetings, emails).",
        columns: [
          { name: "Id", type: "uniqueidentifier", constraints: ["PK", "NOT NULL"] },
          { name: "CustomerId", type: "uniqueidentifier", constraints: ["FK", "NOT NULL"], foreignRef: "Customers.Id" },
          { name: "LoggedByUserId", type: "uniqueidentifier", constraints: ["FK", "NOT NULL"], foreignRef: "Users.Id" },
          { name: "InteractionType", type: "int", constraints: ["NOT NULL"], description: "Enum (Call, Meeting, Email, Note)" },
          { name: "Notes", type: "nvarchar(max)", constraints: ["NULL"] },
          { name: "TimestampUtc", type: "datetime2", constraints: ["NOT NULL"] },
        ],
      },
    ],
    pipeline: {
      title: "Clean Architecture Request Lifecycle: Create Deal Use Case",
      triggerEndpoint: "POST /api/v1/deals",
      steps: [
        {
          step: 1,
          label: "HTTP Ingress & JWT Filter",
          layer: "CRMS.Api",
          status: "OK",
          description: "Incoming HTTP request enters ASP.NET Core middleware pipeline. Enforces TLS, CORS, and verifies JWT Bearer signature & claims.",
          telemetry: "LATENCY: ~1.2ms // AUTH_STATUS: 200 AUTHORIZED",
          samplePayload: 'POST /api/v1/deals\nAuthorization: Bearer eyJhbGciOiJIUzI1...\n{ "customerId": "c7a8...", "value": 45000.00, "stageId": 2 }',
        },
        {
          step: 2,
          label: "FluentValidation Behavior",
          layer: "CRMS.Application",
          status: "VALIDATED",
          description: "MediatR IPipelineBehavior intercepts the command. Executes CreateDealCommandValidator rules before passing control to the handler.",
          telemetry: "VALIDATION_RULES: 4 PASSED // ERRORS: 0",
          samplePayload: "RuleFor(x => x.Value).GreaterThan(0);\nRuleFor(x => x.CustomerId).NotEmpty();",
        },
        {
          step: 3,
          label: "Application Command Dispatch",
          layer: "CRMS.Application",
          status: "PROCESSING",
          description: "CreateDealCommandHandler receives the command, retrieves the associated customer record via ICustomerRepository, and prepares domain aggregate.",
          telemetry: "HANDLER: CreateDealCommandHandler // THREAD: ThreadPoolWorker-14",
        },
        {
          step: 4,
          label: "Domain Invariant Verification",
          layer: "CRMS.Domain",
          status: "VALIDATED",
          description: "Deal.Create() factory validates internal domain invariants (e.g. non-negative valuation, valid currency format, and customer eligibility).",
          telemetry: "INVARIANT_CHECK: Deal.Create() -> PASSED // EVENT: DealCreatedDomainEvent",
        },
        {
          step: 5,
          label: "EF Core Unit of Work Stage",
          layer: "CRMS.Infrastructure",
          status: "PROCESSING",
          description: "DbContext tracks new Deal entity in Added state. Foreign key constraints and value object column mappings are mapped.",
          telemetry: "CHANGE_TRACKER: 1 Added // EF Core 8.0 DbContext",
        },
        {
          step: 6,
          label: "SQL Server Transaction Commit",
          layer: "CRMS.Infrastructure",
          status: "COMMITTED",
          description: "SaveChangesAsync() commits an atomic transaction to SQL Server. Returns generated deal GUID identifier.",
          telemetry: "SQL_STATUS: 1 ROW AFFECTED // COMMIT_TIME: 4.8ms",
          samplePayload: "INSERT INTO [Deals] ([Id], [CustomerId], [PipelineId], [DealValueAmount], [Currency]) VALUES (@p0, @p1, @p2, @p3, @p4);",
        },
        {
          step: 7,
          label: "201 Created Response Dispatch",
          layer: "CRMS.Api",
          status: "OK",
          description: "Controller transforms domain result into DealDto and returns HTTP 201 Created with Location header pointing to GET /api/v1/deals/{id}.",
          telemetry: "HTTP 201 CREATED // TOTAL_CYCLE: ~9.8ms",
          samplePayload: '{ "id": "9d1b-...", "title": "Enterprise Tier Alpha", "value": 45000.00, "status": "Active" }',
        },
      ],
    },
  },

  "crm-system": {
    id: "crm-system",
    code: "ARCH-02",
    name: "ENTERPRISE_CRM_PLATFORM (LARAVEL 12)",
    pattern: "Enterprise MVC // Service Layer // Role-Based Access Control (RBAC)",
    stackSummary: "PHP 8.2 • Laravel 12 • MySQL • Blade • Vite • Tailwind CSS • Pest • Fortify",
    description:
      "Full-stack CRM platform engineered with Laravel 12. Implements granular RBAC permissions (Admin, Manager, Sales Agent), Kanban pipeline state machines, automated PDF/Excel export engines, and comprehensive Pest test suites.",
    tanPrompt:
      "Explain the RBAC middleware and lead conversion pipeline architecture in Jonathan's Laravel 12 CRMSystem.",
    layers: [
      {
        id: "ui",
        name: "Presentation & Blade Views",
        tag: "resources/views",
        tierNumber: "01",
        responsibility:
          "Renders responsive, accessible server-side Blade interfaces with Tailwind CSS and Vite asset compilation. Provides drag-and-drop Kanban boards and export controls.",
        keyPatterns: ["Blade Components", "Tailwind CSS v4", "Vite Compilation", "Alpine.js Modals"],
        dependencies: "Consumes server-provided ViewModels and Form Request error bags.",
        directory: "resources/views/crm, resources/views/components",
        highlights: [
          "Lightweight vanilla/Alpine interactions for zero client framework bloat",
          "Componentized Blade layouts for rapid dashboard UI consistency",
        ],
      },
      {
        id: "routing-middleware",
        name: "Routing, Fortify & RBAC Gates",
        tag: "app/Http/Middleware",
        tierNumber: "02",
        responsibility:
          "Handles session authentication, CSRF validation, rate limiting, and route protection with custom RBAC middleware (`role:admin,manager`).",
        keyPatterns: ["Laravel Fortify Auth", "Role-Based Access Control (RBAC)", "Route Model Binding", "CSRF Protection"],
        dependencies: "Injects authenticated user instances and role permissions.",
        directory: "app/Http/Middleware, routes/web.php",
        codeSnippet: {
          filename: "EnsureUserHasRole.php",
          language: "php",
          code: `public function handle(Request $request, Closure $next, ...$roles): Response
{
    if (!$request->user() || !in_array($request->user()->role->slug, $roles)) {
        abort(403, 'UNAUTHORIZED_ACCESS: Insufficient RBAC clearance.');
    }
    return $next($request);
}`,
        },
        highlights: [
          "Route Model Binding cleanly resolves model instances before reaching controller methods",
          "Granular Gates and Policies keep authorization logic out of views",
        ],
      },
      {
        id: "controllers-requests",
        name: "Controllers & FormRequests",
        tag: "app/Http/Controllers",
        tierNumber: "03",
        responsibility:
          "Validates incoming HTTP payload schemas via dedicated FormRequest classes and routes operations to domain services or Eloquent queries.",
        keyPatterns: ["Single-Responsibility FormRequests", "Resource Controllers", "Flash Messaging"],
        dependencies: "Consumes Services and Eloquent models.",
        directory: "app/Http/Controllers, app/Http/Requests",
        codeSnippet: {
          filename: "StoreLeadRequest.php",
          language: "php",
          code: `public function rules(): array
{
    return [
        'first_name' => ['required', 'string', 'max:80'],
        'last_name'  => ['required', 'string', 'max:80'],
        'email'      => ['required', 'email', 'unique:leads,email'],
        'company'    => ['required', 'string', 'max:120'],
        'stage_id'   => ['required', 'exists:pipeline_stages,id'],
    ];
}`,
        },
        highlights: [
          "Zero validation logic cluttering controller methods",
          "Automatic redirect with flash errors on validation failure",
        ],
      },
      {
        id: "services-persistence",
        name: "Services, Eloquent ORM & MySQL",
        tag: "app/Services & Models",
        tierNumber: "04",
        responsibility:
          "Encapsulates complex business actions (lead conversion, PDF export, activity logging) and models relational tables with Eloquent ORM.",
        keyPatterns: ["Service Pattern", "Database Transactions (DB::transaction)", "Eloquent Scopes", "Pest Unit Testing"],
        dependencies: "MySQL database engine and storage disk drivers.",
        directory: "app/Services, app/Models, database/migrations",
        highlights: [
          "Database operations wrapped in DB::transaction to prevent partial commits",
          "Query scopes provide clean, reusable filters for sales managers",
        ],
      },
    ],
    tables: [
      {
        name: "users",
        description: "System operators, managers, and assigned sales representatives.",
        columns: [
          { name: "id", type: "bigint unsigned", constraints: ["PK", "AUTO_INCREMENT"] },
          { name: "name", type: "varchar(255)", constraints: ["NOT NULL"] },
          { name: "email", type: "varchar(255)", constraints: ["NOT NULL", "UNIQUE"] },
          { name: "role_id", type: "bigint unsigned", constraints: ["FK", "NOT NULL"], foreignRef: "roles.id" },
          { name: "status", type: "varchar(20)", constraints: ["NOT NULL"] },
        ],
      },
      {
        name: "leads",
        description: "Prospects entering the top of the sales acquisition funnel.",
        columns: [
          { name: "id", type: "bigint unsigned", constraints: ["PK", "AUTO_INCREMENT"] },
          { name: "assigned_to_user_id", type: "bigint unsigned", constraints: ["FK", "NULL"], foreignRef: "users.id" },
          { name: "first_name", type: "varchar(80)", constraints: ["NOT NULL"] },
          { name: "last_name", type: "varchar(80)", constraints: ["NOT NULL"] },
          { name: "email", type: "varchar(255)", constraints: ["NOT NULL", "UNIQUE"] },
          { name: "pipeline_stage_id", type: "bigint unsigned", constraints: ["FK", "NOT NULL"], foreignRef: "pipeline_stages.id" },
          { name: "status", type: "enum", constraints: ["NOT NULL"], description: "'new','contacted','qualified','lost'" },
        ],
      },
      {
        name: "pipeline_stages",
        description: "Sequential stages displayed across the interactive Kanban board.",
        columns: [
          { name: "id", type: "bigint unsigned", constraints: ["PK", "AUTO_INCREMENT"] },
          { name: "name", type: "varchar(100)", constraints: ["NOT NULL"] },
          { name: "slug", type: "varchar(50)", constraints: ["NOT NULL", "UNIQUE"] },
          { name: "display_order", type: "int", constraints: ["NOT NULL"] },
          { name: "color_hex", type: "varchar(7)", constraints: ["NOT NULL"] },
        ],
      },
      {
        name: "opportunities",
        description: "Converted high-value deals with monetary forecasting.",
        columns: [
          { name: "id", type: "bigint unsigned", constraints: ["PK", "AUTO_INCREMENT"] },
          { name: "lead_id", type: "bigint unsigned", constraints: ["FK", "NOT NULL"], foreignRef: "leads.id" },
          { name: "amount", type: "decimal(12,2)", constraints: ["NOT NULL"] },
          { name: "expected_close_date", type: "date", constraints: ["NULL"] },
        ],
      },
    ],
    pipeline: {
      title: "Lead Conversion & Opportunity Creation Lifecycle",
      triggerEndpoint: "POST /crm/leads/{lead}/convert",
      steps: [
        {
          step: 1,
          label: "Route Dispatch & Session Auth",
          layer: "routes/web.php",
          status: "OK",
          description: "Incoming conversion request passes through Laravel web middleware group. Validates CSRF token and active authenticated session.",
          telemetry: "STATUS: 200 OK // AUTH_USER: Manager (ID: 4)",
        },
        {
          step: 2,
          label: "RBAC Authorization Check",
          layer: "app/Policies",
          status: "VALIDATED",
          description: "LeadPolicy::convert() verifies that current user has managerial role permissions before executing conversion.",
          telemetry: "GATE_CHECK: can('convert-lead') -> GRANTED",
        },
        {
          step: 3,
          label: "FormRequest Validation",
          layer: "app/Http/Requests",
          status: "VALIDATED",
          description: "ConvertLeadRequest validates target opportunity amount, closing timeline, and notes.",
          telemetry: "PAYLOAD_VALID: TRUE // VALIDATION_MS: 1.1ms",
        },
        {
          step: 4,
          label: "Service DB Transaction Scope",
          layer: "app/Services",
          status: "PROCESSING",
          description: "LeadConversionService opens DB::transaction(). Marks lead as 'qualified', creates opportunity record, and generates activity history log.",
          telemetry: "TRANSACTION_BEGUN: MySQL InnoDB // ISOLATION: READ COMMITTED",
        },
        {
          step: 5,
          label: "Database Commit & Index Update",
          layer: "database/MySQL",
          status: "COMMITTED",
          description: "MySQL commits row updates to `leads` and inserts to `opportunities`. Triggers Kanban board telemetry refresh.",
          telemetry: "QUERIES_EXECUTED: 3 // DURATION: 3.4ms",
        },
        {
          step: 6,
          label: "Flash Notice & Redirect",
          layer: "app/Http/Controllers",
          status: "OK",
          description: "Redirects user to updated opportunity detail view with success flash notification.",
          telemetry: "HTTP 302 FOUND -> /crm/opportunities/18",
        },
      ],
    },
  },

  "swinetrack-pos": {
    id: "swinetrack-pos",
    code: "ARCH-03",
    name: "SWINETRACK_POS_SYSTEM",
    pattern: "Commercial Point-of-Sale Engine // Weight-Based Livestock Inventory",
    stackSummary: "PHP • Laravel 12 • MySQL • Blade • Vite • Tailwind CSS",
    description:
      "Point-of-Sale (POS) and inventory telemetry platform engineered for commercial livestock commerce. Calculates weight-based transactions, dynamic grade deductions, pen lot tracking, and shift reconciliation ledgers.",
    tanPrompt:
      "Explain the weight-based pricing calculations and inventory locking engine in SwineTrack POS.",
    layers: [
      {
        id: "pos-terminal",
        name: "POS Terminal Register Interface",
        tag: "resources/views/pos",
        tierNumber: "01",
        responsibility:
          "High-speed keyboard/barcode interface designed for rapid sales recording, live weight calculation, and thermal receipt print queuing.",
        keyPatterns: ["Keyboard-Centric UI", "Live Calculation HUD", "Thermal Print Formatting"],
        dependencies: "Communicates with checkout API controllers.",
        directory: "resources/views/pos",
        highlights: [
          "Optimized for touch and hotkey barcode transactions",
          "Immediate visual feedback on pricing tier differentials",
        ],
      },
      {
        id: "pricing-engine",
        name: "Weight-Based Pricing Engine",
        tag: "app/Services/Pricing",
        tierNumber: "02",
        responsibility:
          "Calculates gross vs. tare weight deductions, applies dynamic price-per-kilogram rates based on carcass classification, and computes taxes.",
        keyPatterns: ["Strategy Pattern for Pricing Rules", "Tare Deduction Math", "Grade Classification"],
        dependencies: "Pure calculation services with configuration feeds.",
        directory: "app/Services/PricingService.php",
        highlights: [
          "Dynamic pricing adjustments based on real-time market rate tables",
          "Automatic tare deduction prevents overcharging on transport equipment",
        ],
      },
      {
        id: "inventory-lock",
        name: "Row-Level Inventory Lock & Ledger",
        tag: "app/Services/Inventory",
        tierNumber: "03",
        responsibility:
          "Ensures livestock units in pen batches cannot be double-sold during concurrent sales using pessimistic database locking (`lockForUpdate`).",
        keyPatterns: ["Pessimistic Locking (`lockForUpdate`)", "Batch Stock Ledgers", "Audit Reconciliation"],
        dependencies: "MySQL InnoDB row-level locking.",
        directory: "app/Services/InventoryService.php",
        codeSnippet: {
          filename: "CheckoutService.php",
          language: "php",
          code: `DB::transaction(function () use ($unitId, $weightKg, $pricePerKg, $cashierId) {
    // Lock record to prevent concurrent checkout of the same livestock unit
    $unit = LivestockUnit::where('id', $unitId)->lockForUpdate()->firstOrFail();

    if ($unit->status !== 'AVAILABLE') {
        throw new StockUnavailableException("Unit is already sold or reserved.");
    }

    $unit->status = 'SOLD';
    $unit->sold_weight_kg = $weightKg;
    $unit->save();

    // Decrement batch headcount
    $unit->batch()->decrement('head_count');
});`,
        },
        highlights: [
          "Row-level locking guarantees zero double-sales during peak auction transactions",
          "Automated headcount decrement keeps pen census accurate in real time",
        ],
      },
      {
        id: "ledger-reconciliation",
        name: "Shift Reconciliation & Audit Ledger",
        tag: "database/MySQL",
        tierNumber: "04",
        responsibility:
          "Records cashier register opening/closing balances, sales totals, cash drawer counts, and generates immutable audit trails.",
        keyPatterns: ["Cashier Shift Auditing", "Immutable Receipts", "Daily Reconciliation Reports"],
        dependencies: "Relational persistence.",
        directory: "app/Models/ShiftLog.php",
        highlights: [
          "End-of-day discrepancy reporting flags cash drawer variances instantly",
          "Complete receipt history for regulatory and accounting compliance",
        ],
      },
    ],
    tables: [
      {
        name: "batches",
        description: "Livestock batches grouped by pen location, arrival date, and breed.",
        columns: [
          { name: "id", type: "bigint unsigned", constraints: ["PK", "AUTO_INCREMENT"] },
          { name: "batch_code", type: "varchar(50)", constraints: ["NOT NULL", "UNIQUE"] },
          { name: "pen_location", type: "varchar(50)", constraints: ["NOT NULL"] },
          { name: "head_count", type: "int", constraints: ["NOT NULL"] },
          { name: "average_weight_kg", type: "decimal(8,2)", constraints: ["NOT NULL"] },
        ],
      },
      {
        name: "orders",
        description: "Customer sales orders, payment mode, cashier reference, and totals.",
        columns: [
          { name: "id", type: "bigint unsigned", constraints: ["PK", "AUTO_INCREMENT"] },
          { name: "receipt_no", type: "varchar(60)", constraints: ["NOT NULL", "UNIQUE"] },
          { name: "cashier_id", type: "bigint unsigned", constraints: ["FK", "NOT NULL"], foreignRef: "users.id" },
          { name: "total_weight_kg", type: "decimal(10,2)", constraints: ["NOT NULL"] },
          { name: "grand_total", type: "decimal(12,2)", constraints: ["NOT NULL"] },
          { name: "payment_type", type: "varchar(20)", constraints: ["NOT NULL"], description: "'CASH','GCASH','TRANSFER'" },
        ],
      },
      {
        name: "order_items",
        description: "Line items detailing weight-based price per kg and unit tags.",
        columns: [
          { name: "id", type: "bigint unsigned", constraints: ["PK", "AUTO_INCREMENT"] },
          { name: "order_id", type: "bigint unsigned", constraints: ["FK", "NOT NULL"], foreignRef: "orders.id" },
          { name: "batch_id", type: "bigint unsigned", constraints: ["FK", "NOT NULL"], foreignRef: "batches.id" },
          { name: "weight_kg", type: "decimal(8,2)", constraints: ["NOT NULL"] },
          { name: "price_per_kg", type: "decimal(8,2)", constraints: ["NOT NULL"] },
          { name: "subtotal", type: "decimal(10,2)", constraints: ["NOT NULL"] },
        ],
      },
    ],
    pipeline: {
      title: "Commercial Weight-Based POS Checkout Lifecycle",
      triggerEndpoint: "POST /pos/transactions/checkout",
      steps: [
        {
          step: 1,
          label: "Weight Telemetry Ingestion",
          layer: "POS Terminal",
          status: "OK",
          description: "Cashier scans unit ear tag and inputs scale reading. System computes gross weight and subtracts tare allowance.",
          telemetry: "TAG: #SW-4081 // GROSS: 94.5 KG // TARE: 1.5 KG // NET: 93.0 KG",
        },
        {
          step: 2,
          label: "Price-Per-Kg Calculation",
          layer: "Pricing Engine",
          status: "VALIDATED",
          description: "Pricing service calculates net amount = Net Weight (93.0 kg) * Rate (PHP 220.00/kg) = PHP 20,460.00.",
          telemetry: "RATE: PHP 220.00/kg // TOTAL: PHP 20,460.00",
        },
        {
          step: 3,
          label: "Pessimistic Row Lock",
          layer: "Inventory Service",
          status: "PROCESSING",
          description: "Executes `SELECT ... FOR UPDATE` on livestock record in MySQL to prevent simultaneous sale from another register.",
          telemetry: "LOCK_ACQUIRED: Unit #SW-4081 [EXCLUSIVE_LOCK]",
        },
        {
          step: 4,
          label: "Atomic Order Commit",
          layer: "MySQL InnoDB",
          status: "COMMITTED",
          description: "Writes order header, line item, marks unit SOLD, and decrements batch headcount within single transaction.",
          telemetry: "BATCH_HEADCOUNT: -1 // ORDER_RECEIPT: #RCP-2026-0891",
        },
        {
          step: 5,
          label: "Thermal Print Stream",
          layer: "POS Output",
          status: "OK",
          description: "Generates ESC/POS print stream for thermal receipt printer and prompts drawer open signal.",
          telemetry: "PRINT_DISPATCH: OK // DRAWER_KICK_PIN: HIGH",
        },
      ],
    },
  },
};
