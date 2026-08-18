export type Provider = "AWS" | "Azure" | "GCP";
export type Environment = "Production" | "Staging" | "Development";
export type ResourceStatus = "Running" | "Stopped" | "Idle" | "Warning" | "Critical";
export type OptimizationStatus = "Optimized" | "Needs Review" | "Overprovisioned" | "Idle" | "Unreviewed";
export type RiskLevel = "Low" | "Medium" | "High" | "Critical";
export type Priority = "Critical" | "High" | "Medium" | "Low";
export type HealthStatus = "Healthy" | "Warning" | "Critical" | "Unknown";

export interface CloudResource {
  id: string;
  name: string;
  provider: Provider;
  service: string;
  region: string;
  environment: Environment;
  status: ResourceStatus;
  monthlyCost: number;
  cpuUtilization: number;
  memoryUtilization: number;
  networkUtilization: number;
  lastActivity: string;
  optimizationStatus: OptimizationStatus;
  riskLevel: RiskLevel;
  instanceType?: string;
  tags: Record<string, string>;
}

export interface CostRecord {
  date: string;
  aws: number;
  azure: number;
  gcp: number;
  total: number;
}

export interface Recommendation {
  id: string;
  title: string;
  category: string;
  description: string;
  resourceId: string;
  resourceName: string;
  provider: Provider;
  region: string;
  priority: Priority;
  monthlySavings: number;
  annualSavings: number;
  riskLevel: RiskLevel;
  effort: "Low" | "Medium" | "High";
  reason: string;
  suggestedAction: string;
  status: "Pending" | "Accepted" | "Dismissed" | "Applied";
  createdAt: string;
}

export interface Alert {
  id: string;
  severity: "Critical" | "Warning" | "Info";
  title: string;
  description: string;
  resourceId: string;
  resourceName: string;
  timestamp: string;
  resolved: boolean;
}

export interface PerformanceMetric {
  timestamp: string;
  cpu: number;
  memory: number;
  network: number;
  latency: number;
  errorRate: number;
  requests: number;
  availability: number;
}

// ─── Resources ────────────────────────────────────────────────────────────────

export const mockResources: CloudResource[] = [
  { id: "r-001", name: "prod-api-server-01", provider: "AWS", service: "EC2", region: "us-east-1", environment: "Production", status: "Running", monthlyCost: 342.50, cpuUtilization: 78, memoryUtilization: 65, networkUtilization: 45, lastActivity: "2026-08-18", optimizationStatus: "Optimized", riskLevel: "Low", instanceType: "m5.xlarge", tags: { team: "backend", app: "api" } },
  { id: "r-002", name: "dev-ml-training-node", provider: "AWS", service: "EC2", region: "us-west-2", environment: "Development", status: "Idle", monthlyCost: 891.20, cpuUtilization: 4, memoryUtilization: 8, networkUtilization: 2, lastActivity: "2026-08-01", optimizationStatus: "Idle", riskLevel: "High", instanceType: "p3.2xlarge", tags: { team: "ml", purpose: "training" } },
  { id: "r-003", name: "staging-web-cluster", provider: "Azure", service: "AKS", region: "eastus", environment: "Staging", status: "Running", monthlyCost: 456.80, cpuUtilization: 12, memoryUtilization: 22, networkUtilization: 18, lastActivity: "2026-08-17", optimizationStatus: "Overprovisioned", riskLevel: "Medium", tags: { team: "frontend", env: "staging" } },
  { id: "r-004", name: "prod-rds-postgres-main", provider: "AWS", service: "RDS", region: "us-east-1", environment: "Production", status: "Running", monthlyCost: 678.40, cpuUtilization: 35, memoryUtilization: 72, networkUtilization: 28, lastActivity: "2026-08-18", optimizationStatus: "Needs Review", riskLevel: "Medium", instanceType: "db.r5.2xlarge", tags: { team: "data", critical: "true" } },
  { id: "r-005", name: "gcp-bigquery-analytics", provider: "GCP", service: "BigQuery", region: "us-central1", environment: "Production", status: "Running", monthlyCost: 1240.00, cpuUtilization: 55, memoryUtilization: 48, networkUtilization: 60, lastActivity: "2026-08-18", optimizationStatus: "Unreviewed", riskLevel: "Low", tags: { team: "analytics" } },
  { id: "r-006", name: "dev-test-vm-fleet", provider: "Azure", service: "Virtual Machines", region: "westeurope", environment: "Development", status: "Running", monthlyCost: 312.60, cpuUtilization: 8, memoryUtilization: 15, networkUtilization: 5, lastActivity: "2026-08-10", optimizationStatus: "Overprovisioned", riskLevel: "Medium", instanceType: "Standard_D4s_v3", tags: { team: "qa" } },
  { id: "r-007", name: "prod-s3-data-lake", provider: "AWS", service: "S3", region: "us-east-1", environment: "Production", status: "Running", monthlyCost: 189.30, cpuUtilization: 0, memoryUtilization: 0, networkUtilization: 22, lastActivity: "2026-08-18", optimizationStatus: "Needs Review", riskLevel: "Low", tags: { team: "data" } },
  { id: "r-008", name: "stg-cache-elasticache", provider: "AWS", service: "ElastiCache", region: "us-east-1", environment: "Staging", status: "Stopped", monthlyCost: 124.50, cpuUtilization: 0, memoryUtilization: 0, networkUtilization: 0, lastActivity: "2026-07-25", optimizationStatus: "Idle", riskLevel: "High", instanceType: "cache.r6g.large", tags: { team: "backend" } },
  { id: "r-009", name: "gcp-gke-prod-cluster", provider: "GCP", service: "GKE", region: "us-central1", environment: "Production", status: "Running", monthlyCost: 2340.00, cpuUtilization: 62, memoryUtilization: 70, networkUtilization: 55, lastActivity: "2026-08-18", optimizationStatus: "Optimized", riskLevel: "Low", tags: { team: "platform" } },
  { id: "r-010", name: "azure-cosmos-db-prod", provider: "Azure", service: "Cosmos DB", region: "eastus", environment: "Production", status: "Running", monthlyCost: 876.20, cpuUtilization: 18, memoryUtilization: 25, networkUtilization: 30, lastActivity: "2026-08-18", optimizationStatus: "Overprovisioned", riskLevel: "Medium", tags: { team: "data" } },
  { id: "r-011", name: "dev-lambda-functions", provider: "AWS", service: "Lambda", region: "us-west-2", environment: "Development", status: "Running", monthlyCost: 45.20, cpuUtilization: 22, memoryUtilization: 35, networkUtilization: 10, lastActivity: "2026-08-16", optimizationStatus: "Optimized", riskLevel: "Low", tags: { team: "backend" } },
  { id: "r-012", name: "prod-cdn-cloudfront", provider: "AWS", service: "CloudFront", region: "global", environment: "Production", status: "Running", monthlyCost: 234.80, cpuUtilization: 0, memoryUtilization: 0, networkUtilization: 88, lastActivity: "2026-08-18", optimizationStatus: "Optimized", riskLevel: "Low", tags: { team: "frontend" } },
  { id: "r-013", name: "stg-app-service-plan", provider: "Azure", service: "App Service", region: "westus", environment: "Staging", status: "Warning", monthlyCost: 198.40, cpuUtilization: 88, memoryUtilization: 91, networkUtilization: 72, lastActivity: "2026-08-18", optimizationStatus: "Needs Review", riskLevel: "High", tags: { team: "frontend" } },
  { id: "r-014", name: "gcp-cloud-storage-backup", provider: "GCP", service: "Cloud Storage", region: "us-east1", environment: "Production", status: "Running", monthlyCost: 89.60, cpuUtilization: 0, memoryUtilization: 0, networkUtilization: 8, lastActivity: "2026-08-15", optimizationStatus: "Needs Review", riskLevel: "Low", tags: { team: "ops" } },
  { id: "r-015", name: "dev-unused-eip-001", provider: "AWS", service: "Elastic IP", region: "us-east-1", environment: "Development", status: "Stopped", monthlyCost: 7.30, cpuUtilization: 0, memoryUtilization: 0, networkUtilization: 0, lastActivity: "2026-06-30", optimizationStatus: "Idle", riskLevel: "Low", tags: { team: "dev" } },
  { id: "r-016", name: "prod-nat-gateway-01", provider: "AWS", service: "NAT Gateway", region: "us-east-1", environment: "Production", status: "Running", monthlyCost: 156.90, cpuUtilization: 0, memoryUtilization: 0, networkUtilization: 45, lastActivity: "2026-08-18", optimizationStatus: "Unreviewed", riskLevel: "Low", tags: { team: "network" } },
  { id: "r-017", name: "azure-sql-db-analytics", provider: "Azure", service: "SQL Database", region: "northeurope", environment: "Production", status: "Running", monthlyCost: 432.10, cpuUtilization: 11, memoryUtilization: 19, networkUtilization: 14, lastActivity: "2026-08-17", optimizationStatus: "Overprovisioned", riskLevel: "Medium", tags: { team: "analytics" } },
  { id: "r-018", name: "gcp-cloud-functions-api", provider: "GCP", service: "Cloud Functions", region: "us-central1", environment: "Production", status: "Running", monthlyCost: 67.40, cpuUtilization: 30, memoryUtilization: 28, networkUtilization: 20, lastActivity: "2026-08-18", optimizationStatus: "Optimized", riskLevel: "Low", tags: { team: "backend" } },
  { id: "r-019", name: "prod-load-balancer-ext", provider: "AWS", service: "ELB", region: "us-east-1", environment: "Production", status: "Running", monthlyCost: 98.20, cpuUtilization: 0, memoryUtilization: 0, networkUtilization: 68, lastActivity: "2026-08-18", optimizationStatus: "Optimized", riskLevel: "Low", tags: { team: "network" } },
  { id: "r-020", name: "dev-orphan-ebs-vol-07", provider: "AWS", service: "EBS", region: "us-west-2", environment: "Development", status: "Stopped", monthlyCost: 24.50, cpuUtilization: 0, memoryUtilization: 0, networkUtilization: 0, lastActivity: "2026-07-10", optimizationStatus: "Idle", riskLevel: "Low", tags: { team: "dev" } },
  { id: "r-021", name: "prod-redis-cache-cluster", provider: "GCP", service: "Memorystore", region: "us-central1", environment: "Production", status: "Running", monthlyCost: 345.60, cpuUtilization: 42, memoryUtilization: 68, networkUtilization: 35, lastActivity: "2026-08-18", optimizationStatus: "Optimized", riskLevel: "Low", tags: { team: "backend" } },
  { id: "r-022", name: "stg-container-registry", provider: "Azure", service: "Container Registry", region: "eastus", environment: "Staging", status: "Running", monthlyCost: 56.80, cpuUtilization: 5, memoryUtilization: 12, networkUtilization: 8, lastActivity: "2026-08-12", optimizationStatus: "Unreviewed", riskLevel: "Low", tags: { team: "platform" } },
];

// ─── Cost History (12 months) ─────────────────────────────────────────────────

export const mockCostHistory: CostRecord[] = [
  { date: "2025-09", aws: 4200, azure: 1800, gcp: 1400, total: 7400 },
  { date: "2025-10", aws: 4450, azure: 1950, gcp: 1500, total: 7900 },
  { date: "2025-11", aws: 4600, azure: 2100, gcp: 1620, total: 8320 },
  { date: "2025-12", aws: 5100, azure: 2400, gcp: 1800, total: 9300 },
  { date: "2026-01", aws: 4800, azure: 2200, gcp: 1750, total: 8750 },
  { date: "2026-02", aws: 4950, azure: 2350, gcp: 1820, total: 9120 },
  { date: "2026-03", aws: 5200, azure: 2500, gcp: 1900, total: 9600 },
  { date: "2026-04", aws: 5400, azure: 2450, gcp: 2050, total: 9900 },
  { date: "2026-05", aws: 5100, azure: 2600, gcp: 2100, total: 9800 },
  { date: "2026-06", aws: 5600, azure: 2700, gcp: 2200, total: 10500 },
  { date: "2026-07", aws: 5800, azure: 2850, gcp: 2350, total: 11000 },
  { date: "2026-08", aws: 4200, azure: 2100, gcp: 1700, total: 8000 }, // partial month
];

// ─── Recommendations ──────────────────────────────────────────────────────────

export const mockRecommendations: Recommendation[] = [
  {
    id: "rec-001",
    title: "Downsize idle ML training instance",
    category: "Idle Resources",
    description: "The p3.2xlarge GPU instance dev-ml-training-node has had CPU utilization below 5% for 17 days and shows no recent workload activity.",
    resourceId: "r-002",
    resourceName: "dev-ml-training-node",
    provider: "AWS",
    region: "us-west-2",
    priority: "Critical",
    monthlySavings: 712.96,
    annualSavings: 8555.52,
    riskLevel: "Low",
    effort: "Low",
    reason: "CPU utilization 4%, memory 8%, no activity since 2026-08-01 (17 days). Estimated idle GPU waste.",
    suggestedAction: "Stop the instance when not in use. Consider scheduling it only during active training jobs.",
    status: "Pending",
    createdAt: "2026-08-15",
  },
  {
    id: "rec-002",
    title: "Right-size Azure Cosmos DB to serverless",
    category: "Database Optimization",
    description: "azure-cosmos-db-prod is provisioned at a fixed throughput level but CPU usage averages 18% and query volume is irregular.",
    resourceId: "r-010",
    resourceName: "azure-cosmos-db-prod",
    provider: "Azure",
    region: "eastus",
    priority: "High",
    monthlySavings: 350.48,
    annualSavings: 4205.76,
    riskLevel: "Medium",
    effort: "Medium",
    reason: "CPU 18%, memory 25%. Switching from provisioned to serverless Cosmos DB is estimated to reduce costs 40%.",
    suggestedAction: "Migrate to Cosmos DB Serverless mode. Monitor RU consumption for 30 days before committing.",
    status: "Pending",
    createdAt: "2026-08-14",
  },
  {
    id: "rec-003",
    title: "Schedule staging VMs to shut down off-hours",
    category: "Scheduling",
    description: "dev-test-vm-fleet VMs run 24/7 but are used only during business hours Mon-Fri based on traffic patterns.",
    resourceId: "r-006",
    resourceName: "dev-test-vm-fleet",
    provider: "Azure",
    region: "westeurope",
    priority: "High",
    monthlySavings: 203.19,
    annualSavings: 2438.28,
    riskLevel: "Low",
    effort: "Low",
    reason: "Non-production VMs with business-hours usage pattern. 65% of uptime is wasteful.",
    suggestedAction: "Set up Azure Automation to start/stop VMs at 08:00 and 18:00 on weekdays.",
    status: "Pending",
    createdAt: "2026-08-13",
  },
  {
    id: "rec-004",
    title: "Remove stopped ElastiCache cluster",
    category: "Idle Resources",
    description: "stg-cache-elasticache has been stopped for 24 days and is accumulating storage costs with zero utilization.",
    resourceId: "r-008",
    resourceName: "stg-cache-elasticache",
    provider: "AWS",
    region: "us-east-1",
    priority: "High",
    monthlySavings: 124.50,
    annualSavings: 1494.00,
    riskLevel: "Low",
    effort: "Low",
    reason: "Resource stopped since 2026-07-25. No snapshots or dependencies detected.",
    suggestedAction: "Delete the ElastiCache cluster. Create a snapshot for safety before deletion.",
    status: "Accepted",
    createdAt: "2026-08-12",
  },
  {
    id: "rec-005",
    title: "Purchase Reserved Instances for GKE cluster",
    category: "Reserved Capacity",
    description: "gcp-gke-prod-cluster runs stable 24/7 workloads with consistent resource demand over 6 months.",
    resourceId: "r-009",
    resourceName: "gcp-gke-prod-cluster",
    provider: "GCP",
    region: "us-central1",
    priority: "Medium",
    monthlySavings: 702.00,
    annualSavings: 8424.00,
    riskLevel: "Low",
    effort: "Medium",
    reason: "Stable CPU/memory usage for 180+ days. Committed Use Discounts could reduce cost by 30%.",
    suggestedAction: "Purchase 1-year Committed Use Discounts for n1-standard-8 equivalent capacity.",
    status: "Pending",
    createdAt: "2026-08-11",
  },
  {
    id: "rec-006",
    title: "Enable autoscaling on staging web cluster",
    category: "Autoscaling",
    description: "staging-web-cluster shows repeated traffic spikes without autoscaling, causing over-provisioning during low-traffic periods.",
    resourceId: "r-003",
    resourceName: "staging-web-cluster",
    provider: "Azure",
    region: "eastus",
    priority: "Medium",
    monthlySavings: 182.72,
    annualSavings: 2192.64,
    riskLevel: "Low",
    effort: "Low",
    reason: "CPU 12% average but spikes to 70%+. Autoscaling allows right-sizing the cluster dynamically.",
    suggestedAction: "Configure AKS Cluster Autoscaler with min=2 max=8 nodes based on CPU target 60%.",
    status: "Pending",
    createdAt: "2026-08-10",
  },
  {
    id: "rec-007",
    title: "Delete unattached EBS volume",
    category: "Storage Optimization",
    description: "dev-orphan-ebs-vol-07 is an unattached EBS volume in us-west-2 with no associated instance for 39 days.",
    resourceId: "r-020",
    resourceName: "dev-orphan-ebs-vol-07",
    provider: "AWS",
    region: "us-west-2",
    priority: "Low",
    monthlySavings: 24.50,
    annualSavings: 294.00,
    riskLevel: "Low",
    effort: "Low",
    reason: "Unattached EBS volume detected. No instance using it since 2026-07-10.",
    suggestedAction: "Create a snapshot and delete the volume. Review if the data is still needed.",
    status: "Pending",
    createdAt: "2026-08-09",
  },
  {
    id: "rec-008",
    title: "Release unused Elastic IP address",
    category: "Network Cost Reduction",
    description: "dev-unused-eip-001 is an Elastic IP not attached to a running instance, incurring idle charges.",
    resourceId: "r-015",
    resourceName: "dev-unused-eip-001",
    provider: "AWS",
    region: "us-east-1",
    priority: "Low",
    monthlySavings: 7.30,
    annualSavings: 87.60,
    riskLevel: "Low",
    effort: "Low",
    reason: "Unassociated Elastic IP. AWS charges $0.005/hr for idle EIPs.",
    suggestedAction: "Release the Elastic IP address if no longer needed.",
    status: "Dismissed",
    createdAt: "2026-08-08",
  },
  {
    id: "rec-009",
    title: "Migrate Azure SQL to lower service tier",
    category: "Database Optimization",
    description: "azure-sql-db-analytics runs on Premium tier with 11% CPU and 19% memory utilization on average.",
    resourceId: "r-017",
    resourceName: "azure-sql-db-analytics",
    provider: "Azure",
    region: "northeurope",
    priority: "Medium",
    monthlySavings: 216.05,
    annualSavings: 2592.60,
    riskLevel: "Medium",
    effort: "Medium",
    reason: "Premium tier significantly under-utilized. General Purpose tier offers equivalent performance at lower cost.",
    suggestedAction: "Downgrade to General Purpose tier. Test performance under load before production migration.",
    status: "Pending",
    createdAt: "2026-08-07",
  },
  {
    id: "rec-010",
    title: "Move S3 bucket to Intelligent-Tiering",
    category: "Storage Optimization",
    description: "prod-s3-data-lake stores 12TB with mixed access patterns. Standard tier is likely over-priced for rarely accessed data.",
    resourceId: "r-007",
    resourceName: "prod-s3-data-lake",
    provider: "AWS",
    region: "us-east-1",
    priority: "Medium",
    monthlySavings: 56.79,
    annualSavings: 681.48,
    riskLevel: "Low",
    effort: "Low",
    reason: "S3 Intelligent-Tiering automatically moves objects between tiers based on access. Estimated 30% cost reduction.",
    suggestedAction: "Enable S3 Intelligent-Tiering on the bucket. No retrieval fees for Frequent Access tier.",
    status: "Pending",
    createdAt: "2026-08-06",
  },
];

// ─── Alerts ───────────────────────────────────────────────────────────────────

export const mockAlerts: Alert[] = [
  { id: "a-001", severity: "Critical", title: "Unusual spending spike detected", description: "AWS spend increased 34% in the last 24 hours compared to the 7-day average. Check for runaway resources.", resourceId: "r-002", resourceName: "dev-ml-training-node", timestamp: "2026-08-18T09:14:00Z", resolved: false },
  { id: "a-002", severity: "Warning", title: "High memory utilization", description: "stg-app-service-plan memory utilization has been above 88% for 2 hours. Performance degradation possible.", resourceId: "r-013", resourceName: "stg-app-service-plan", timestamp: "2026-08-18T07:42:00Z", resolved: false },
  { id: "a-003", severity: "Warning", title: "Idle GPU instance burning budget", description: "dev-ml-training-node has been idle for 17 days. Estimated waste: $712/month.", resourceId: "r-002", resourceName: "dev-ml-training-node", timestamp: "2026-08-17T00:00:00Z", resolved: false },
  { id: "a-004", severity: "Info", title: "Budget threshold reached", description: "Total cloud spend reached 80% of monthly budget ($11,000). Projected to exceed by $2,800.", resourceId: "", resourceName: "All Resources", timestamp: "2026-08-16T14:22:00Z", resolved: false },
  { id: "a-005", severity: "Critical", title: "RDS storage approaching limit", description: "prod-rds-postgres-main storage is at 89% capacity. Auto-scaling may trigger unexpected costs.", resourceId: "r-004", resourceName: "prod-rds-postgres-main", timestamp: "2026-08-15T18:05:00Z", resolved: true },
];

// ─── Performance Metrics (24h at 1h intervals) ────────────────────────────────

export function generatePerformanceMetrics(hours: number): PerformanceMetric[] {
  const data: PerformanceMetric[] = [];
  const now = new Date("2026-08-18T18:00:00Z");
  for (let i = hours; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 3600000);
    const hour = t.getUTCHours();
    const isBusinessHour = hour >= 8 && hour <= 18;
    const baseLoad = isBusinessHour ? 65 : 30;
    const noise = () => (Math.random() - 0.5) * 20;
    data.push({
      timestamp: t.toISOString(),
      cpu: Math.max(5, Math.min(98, baseLoad + noise())),
      memory: Math.max(20, Math.min(95, baseLoad * 1.1 + noise())),
      network: Math.max(5, Math.min(90, baseLoad * 0.8 + noise())),
      latency: Math.max(12, isBusinessHour ? 45 + noise() * 2 : 22 + noise()),
      errorRate: Math.max(0, Math.min(5, isBusinessHour ? 0.8 + Math.random() * 0.5 : 0.2)),
      requests: Math.max(10, Math.floor(isBusinessHour ? 2400 + noise() * 200 : 400 + noise() * 50)),
      availability: Math.max(99.0, 99.9 - Math.random() * 0.3),
    });
  }
  return data;
}

// ─── Carbon Data ──────────────────────────────────────────────────────────────

export const carbonFactors: Record<string, number> = {
  "us-east-1": 0.000379,
  "us-west-2": 0.000213,
  "eastus": 0.000368,
  "westeurope": 0.000196,
  "us-central1": 0.000221,
  "us-east1": 0.000221,
  "northeurope": 0.000175,
  "global": 0.000300,
  "westus": 0.000221,
};

export function estimateCarbonKg(resource: CloudResource): number {
  const factor = carbonFactors[resource.region] ?? 0.000300;
  return resource.monthlyCost * factor * 1000;
}

// ─── Simulator Scenarios ──────────────────────────────────────────────────────

export const simulationStrategies = [
  { id: "rightsize", label: "Rightsize Compute", savingsPct: 0.4, effort: "Low", risk: "Low", performanceImpact: "Minimal", sustainabilityImpact: "High" },
  { id: "schedule", label: "Schedule Non-Prod Resources", savingsPct: 0.65, effort: "Low", risk: "Low", performanceImpact: "None", sustainabilityImpact: "High" },
  { id: "autoscale", label: "Enable Autoscaling", savingsPct: 0.25, effort: "Medium", risk: "Low", performanceImpact: "Positive", sustainabilityImpact: "Medium" },
  { id: "storage-tier", label: "Move to Lower Storage Tier", savingsPct: 0.3, effort: "Low", risk: "Low", performanceImpact: "Minimal", sustainabilityImpact: "Medium" },
  { id: "reserved", label: "Purchase Reserved Capacity", savingsPct: 0.35, effort: "Medium", risk: "Low", performanceImpact: "None", sustainabilityImpact: "Low" },
  { id: "network", label: "Reduce Cross-Region Transfer", savingsPct: 0.2, effort: "High", risk: "Medium", performanceImpact: "Minimal", sustainabilityImpact: "Medium" },
  { id: "remove-volumes", label: "Remove Unattached Volumes", savingsPct: 1.0, effort: "Low", risk: "Low", performanceImpact: "None", sustainabilityImpact: "Low" },
  { id: "remove-ips", label: "Remove Unused IP Addresses", savingsPct: 1.0, effort: "Low", risk: "Low", performanceImpact: "None", sustainabilityImpact: "Low" },
  { id: "db-optimize", label: "Optimize Database Capacity", savingsPct: 0.4, effort: "Medium", risk: "Medium", performanceImpact: "Minimal", sustainabilityImpact: "Medium" },
];

// ─── Derived summary stats ────────────────────────────────────────────────────

export function getTotalMonthlyCost(): number {
  return mockResources.reduce((s, r) => s + r.monthlyCost, 0);
}

export function getPotentialSavings(): number {
  return mockRecommendations
    .filter((r) => r.status !== "Dismissed")
    .reduce((s, r) => s + r.monthlySavings, 0);
}

export function getIdleResourceCount(): number {
  return mockResources.filter((r) => r.optimizationStatus === "Idle").length;
}

export function getAvgCpuUtilization(): number {
  const utilizable = mockResources.filter((r) => r.cpuUtilization > 0);
  return utilizable.reduce((s, r) => s + r.cpuUtilization, 0) / utilizable.length;
}

export function getOptimizationScore(): number {
  const optimized = mockResources.filter((r) => r.optimizationStatus === "Optimized").length;
  return Math.round((optimized / mockResources.length) * 100);
}
