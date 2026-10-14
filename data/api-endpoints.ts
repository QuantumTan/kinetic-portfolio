// ============================================================
// DATA: api-endpoints.ts (REST API CONTRACT & DTO SPECIFICATIONS)
// ============================================================

export interface ApiHeader {
  key: string;
  value: string;
  description: string;
}

export interface ValidationRule {
  field: string;
  rule: string;
  reason: string;
}

export interface EndpointSpec {
  id: string;
  projectId: string;
  name: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  auth: "JWT_BEARER" | "SANCTUM_SESSION" | "API_KEY";
  rateLimit: string;
  description: string;
  headers: ApiHeader[];
  validationRules: ValidationRule[];
  requestPayload?: string;
  responsePayload: string;
  statusCode: number;
  simulatedLatencyMs: number;
}

export const apiEndpoints: Record<string, EndpointSpec[]> = {
  "crms-peguit": [
    {
      id: "ep-01",
      projectId: "crms-peguit",
      name: "Create Deal Command (CQRS / MediatR)",
      method: "POST",
      path: "/api/v1/deals",
      auth: "JWT_BEARER",
      rateLimit: "100 req / min",
      description:
        "Dispatches a CreateDealCommand through MediatR pipeline. Enforces FluentValidation checks on company credit limit, customer active status, and aggregate deal invariants.",
      headers: [
        { key: "Authorization", value: "Bearer eyJhbGciOiJIUzI1NiIsInR5c...", description: "JWT access token with 'crm:write' claim" },
        { key: "Content-Type", value: "application/json", description: "Standard JSON payload" },
        { key: "X-Idempotency-Key", value: "uuid-v4-8932-fa12", description: "Guarantees safe network retries" },
      ],
      validationRules: [
        { field: "customerId", rule: "NotEmpty().MustExistInDb()", reason: "Target customer must be active in repository." },
        { field: "dealValue", rule: "GreaterThan(0).LessThan(1000000)", reason: "Deal amount must fit company SLA thresholds." },
        { field: "stage", rule: "IsInEnum<DealStage>()", reason: "Must start in LEAD or QUALIFICATION." },
      ],
      requestPayload: JSON.stringify(
        {
          customerId: "CUST-1042",
          title: "Enterprise Cloud Infrastructure Contract",
          dealValue: 125000.0,
          currency: "USD",
          expectedCloseDate: "2026-11-30",
          initialStage: "QUALIFICATION",
        },
        null,
        2
      ),
      responsePayload: JSON.stringify(
        {
          success: true,
          data: {
            dealId: "DEAL-9941",
            customerId: "CUST-1042",
            companyName: "Apex Global Tech",
            title: "Enterprise Cloud Infrastructure Contract",
            dealValue: 125000.0,
            currency: "USD",
            currentStage: "QUALIFICATION",
            winProbabilityPct: 40.0,
            createdAtUtc: "2026-10-14T20:30:00Z",
            createdByUserId: "USR-0012",
          },
          telemetry: {
            executionTimeMs: 1.18,
            validatorPassed: true,
            dbTransactionsCommitted: 1,
          },
        },
        null,
        2
      ),
      statusCode: 201,
      simulatedLatencyMs: 1.18,
    },
    {
      id: "ep-02",
      projectId: "crms-peguit",
      name: "SLA Invariant Telemetry Query",
      method: "GET",
      path: "/api/v1/tickets/{id}/sla-status",
      auth: "JWT_BEARER",
      rateLimit: "300 req / min",
      description:
        "Calculates real-time SLA degradation based on priority tier (Urgent = 60m, High = 240m), timezone offsets, and assigned engineer response intervals.",
      headers: [
        { key: "Authorization", value: "Bearer eyJhbGciOiJIUzI1Ni...", description: "JWT access token" },
        { key: "Accept", value: "application/json", description: "JSON format response" },
      ],
      validationRules: [
        { field: "id", rule: "Guid.TryParse()", reason: "Valid ticket GUID format required." },
      ],
      responsePayload: JSON.stringify(
        {
          ticketId: "8f2a1b9c-44e2-4911-9fa0-d581e28ba230",
          ticketCode: "TCK-8921",
          priority: "URGENT",
          status: "IN_PROGRESS",
          createdAtUtc: "2026-10-14T19:48:00Z",
          minutesElapsed: 42,
          slaThresholdMinutes: 60,
          minutesRemaining: 18,
          isSlaViolated: false,
          assignedEngineer: "Jonathan Peguit Jr.",
        },
        null,
        2
      ),
      statusCode: 200,
      simulatedLatencyMs: 0.85,
    },
  ],
  "crm-system": [
    {
      id: "ep-03",
      projectId: "crm-system",
      name: "Kanban Stage Transition (Pessimistic Lock)",
      method: "PATCH",
      path: "/api/v1/pipeline/deals/{id}/transition",
      auth: "SANCTUM_SESSION",
      rateLimit: "120 req / min",
      description:
        "Executes atomic stage progression under Laravel Fortify/Gate policy check with DB transaction locks, generating an immutable audit trail entry.",
      headers: [
        { key: "X-CSRF-TOKEN", value: "dGhpc0lTYVNlY3VyZUNzcmZUb2tlbjEyMzQ=", description: "Sanctum CSRF protection" },
        { key: "Content-Type", value: "application/json", description: "JSON body payload" },
      ],
      validationRules: [
        { field: "targetStageId", rule: "required|exists:pipeline_stages,id", reason: "Target stage must exist." },
        { field: "dealVersionToken", rule: "required|string", reason: "Optimistic concurrency token to prevent race conditions." },
      ],
      requestPayload: JSON.stringify(
        {
          targetStageId: 3,
          note: "Client approved scope and requested master service agreement draft.",
          dealVersionToken: "ver_1728931200",
        },
        null,
        2
      ),
      responsePayload: JSON.stringify(
        {
          status: "SUCCESS",
          message: "Deal successfully transitioned to CONTRACT_NEGOTIATION",
          deal: {
            id: 42,
            title: "Mindanao Logistics Fleet Automation",
            oldStage: "PROPOSAL_SENT",
            newStage: "CONTRACT_NEGOTIATION",
            value: 98400.0,
            probabilityPct: 85,
            updatedAt: "2026-10-14 20:30:15",
          },
          auditLogId: "LOG-55192",
        },
        null,
        2
      ),
      statusCode: 200,
      simulatedLatencyMs: 1.42,
    },
  ],
  "swinetrack-pos": [
    {
      id: "ep-04",
      projectId: "swinetrack-pos",
      name: "Batch Weight Settlement & Tax Calculation",
      method: "POST",
      path: "/api/v1/pos/settlement",
      auth: "API_KEY",
      rateLimit: "60 req / min",
      description:
        "Processes commercial livestock batch receipts, dynamically resolving price-per-kilogram brackets, veterinary fee deductions, and agricultural transaction receipts.",
      headers: [
        { key: "X-Terminal-Key", value: "POS-TERMINAL-DAVAO-01", description: "Hardware terminal authentication key" },
        { key: "Content-Type", value: "application/json", description: "JSON body payload" },
      ],
      validationRules: [
        { field: "batchItems", rule: "required|array|min:1", reason: "Must submit at least 1 livestock batch entry." },
        { field: "batchItems.*.weightKg", rule: "numeric|min:20|max:350", reason: "Weight must be within legal commercial range." },
      ],
      requestPayload: JSON.stringify(
        {
          buyerId: "BUYER-809",
          terminalId: "POS-01",
          batchItems: [
            { tagId: "PIG-9912", weightKg: 104.5, basePricePerKg: 195.0 },
            { tagId: "PIG-9913", weightKg: 112.0, basePricePerKg: 195.0 },
          ],
        },
        null,
        2
      ),
      responsePayload: JSON.stringify(
        {
          transactionId: "TX-20261014-9902",
          totalWeightKg: 216.5,
          subtotal: 42217.5,
          localGovFee: 150.0,
          netTotal: 42367.5,
          status: "SETTLED",
          timestamp: "2026-10-14 20:30:42",
        },
        null,
        2
      ),
      statusCode: 201,
      simulatedLatencyMs: 2.15,
    },
  ],
};
