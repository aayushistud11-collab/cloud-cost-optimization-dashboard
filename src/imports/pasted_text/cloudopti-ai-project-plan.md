Build a complete, polished full-stack web application called “CloudOpti AI” for AI-powered cloud optimization.

PROJECT PURPOSE

CloudOpti AI is a cloud cost, performance, resource-utilization, and sustainability optimization platform. It helps organizations monitor cloud infrastructure, identify unnecessary spending, detect idle or overprovisioned resources, estimate carbon emissions, simulate optimization strategies, and receive AI-generated recommendations.

The application is intended for cloud administrators, DevOps engineers, FinOps teams, startup founders, IT managers, and academic project demonstrations.

IMPORTANT SAFETY AND DEMO REQUIREMENTS

- Make the application fully functional with realistic mock data when no cloud account is connected.
- Clearly label simulated values and recommendations as “Demo Mode” or “Estimated”.
- Do not require real AWS, Azure, or Google Cloud credentials for the initial working version.
- Do not expose, hard-code, or store API keys, access keys, passwords, or cloud credentials in the frontend.
- Use environment variables and secure server-side service modules for future integrations.
- Do not stop, delete, resize, modify, or deploy real cloud infrastructure.
- The “Apply Recommendation” functionality must be a safe simulation only and must never perform a real cloud action.
- Organize the code so real cloud-provider integrations and a real AI service can be added later without rewriting the UI.

TECHNOLOGY STACK

- React with TypeScript.
- Vite-based project structure.
- Tailwind CSS.
- shadcn/ui components.
- Lucide React icons.
- Recharts or another suitable charting library.
- Client-side routing with React Router.
- Use reusable components and a clean, maintainable folder structure.
- Use a central mock-data layer and service abstractions.
- Use server-side APIs and a database if the selected Bolt environment supports them.
- Use secure environment variables for future integrations.

VISUAL DESIGN

Create a professional enterprise SaaS dashboard with a modern cloud-technology aesthetic.

Use:
- Dark navy and white as the main colors.
- Blue and cyan for primary actions and cloud-related information.
- Green for savings, optimization, and healthy states.
- Amber for warnings.
- Red for critical risks and errors.
- Rounded cards with subtle borders and light shadows.
- Clear typography, consistent spacing, and strong visual hierarchy.
- A responsive left sidebar on desktop.
- A collapsible sidebar or navigation drawer on mobile.
- A top navigation bar with page title, global search, notifications, help, and user profile.
- Accessible color contrast, keyboard focus states, semantic labels, and readable charts.
- Loading skeletons, empty states, error states, confirmation states, and success notifications.

The interface should feel similar to a high-quality cloud management or financial operations product. Make it visually impressive for a project demonstration but simple enough for first-time users to understand.

APPLICATION ROUTES AND PAGES

Create the following routes:

1. /login — Login page.
2. /register — Registration page.
3. /dashboard — Main overview dashboard.
4. /resources — Cloud resources inventory.
5. /cost-analytics — Cost analytics and forecasting.
6. /recommendations — AI optimization recommendations.
7. /performance — Performance monitoring.
8. /carbon — Carbon footprint and sustainability.
9. /simulator — Optimization simulator.
10. /reports — Reports and exports.
11. /settings — Organization, cloud accounts, and preferences.
12. /about — Project explanation and methodology.

AUTHENTICATION AND ORGANIZATION STRUCTURE

Create a polished login and registration experience.

Support:
- Email and password fields.
- Remember-me option.
- Password visibility toggle.
- Form validation.
- Login and registration error states.
- Demo login option that opens the application using sample data.
- Logout functionality.
- Protected application routes.
- User profile menu.

If a backend and database are available, create secure authentication and organization-based data access. Users should only access their organization’s data.

Create database entities or equivalent data models for:
- Users.
- Organizations.
- Cloud provider connections.
- Cloud resources.
- Cost records.
- Performance metrics.
- AI recommendations.
- Optimization simulations.
- Alerts.
- Reports.
- User settings.

Validate user inputs on the server. Never store cloud credentials in plain text.

MAIN DASHBOARD

Create an overview dashboard with the following KPI cards:

- Total monthly cloud spend.
- Month-over-month spending change.
- Projected end-of-month spend.
- Potential monthly savings.
- Potential annual savings.
- Average resource utilization.
- Resource optimization score.
- Estimated monthly carbon emissions.
- Number of idle resources.
- Number of critical alerts.

Display the following dashboard sections:

1. Spending trend chart for the last twelve months.
2. Cost distribution by cloud provider.
3. Cost distribution by service type.
4. Cost distribution by region.
5. Cost distribution by environment such as Production, Staging, and Development.
6. Resource utilization chart.
7. Budget versus actual spending chart.
8. Forecast for the next three months.
9. Savings opportunity summary.
10. Recent AI recommendations.
11. Recent alerts for unusual spending, idle resources, overprovisioning, and performance risks.
12. Connected cloud providers with connection status.

Add controls for:
- Date range.
- Cloud provider.
- Environment.
- Region.
- Refresh data.
- Export summary.

All KPI values and percentages must be calculated from the data rather than hard-coded.

CLOUD RESOURCES PAGE

Create a searchable, sortable, filterable resource inventory table.

Each resource should include:
- Resource ID.
- Resource name.
- Cloud provider.
- Service type.
- Region.
- Environment.
- Status.
- Monthly cost.
- CPU utilization.
- Memory utilization.
- Network utilization.
- Last activity date.
- Optimization status.
- Risk level.

Add:
- Global search.
- Filters for provider, service type, region, environment, status, optimization status, and utilization range.
- Sorting by cost, utilization, risk, and last activity.
- Pagination or virtual scrolling.
- Resource details modal or side drawer.
- Review button.
- Mark as optimized button.
- View recommendation button.
- Empty state when no resources match the filters.

Use at least twenty realistic mock cloud resources across AWS, Microsoft Azure, and Google Cloud.

COST ANALYTICS PAGE

Create a complete cloud cost analytics page.

Include:
- Daily, weekly, monthly, and quarterly spending views.
- Date-range selection.
- Spending trend line chart.
- Stacked cost chart by provider or service.
- Cost by region.
- Cost by environment.
- Budget-versus-actual chart.
- Projected end-of-month cost.
- Three-month cost forecast.
- Month-over-month and year-over-year comparison controls.
- Most expensive resources table.
- Unusual-spending alerts.
- Configurable monthly budget.
- Configurable alert threshold.

Calculate and display:
- Total cost.
- Average daily cost.
- Month-over-month percentage change.
- Projected monthly cost.
- Budget variance.
- Potential savings.
- Cost concentration by provider and service.

AI RECOMMENDATIONS PAGE

Create an AI-powered recommendation center.

Implement a deterministic demo recommendation engine in a separate service module. The service must analyze resource, cost, and utilization data and generate recommendations using rules such as:

- CPU utilization below 15 percent: possible oversized compute resource.
- Memory utilization below 20 percent: possible overprovisioning.
- No activity for more than 14 days: possible idle resource.
- Storage utilization below 30 percent: possible storage-tier optimization.
- Stable long-term usage: possible reserved-capacity recommendation.
- Repeated traffic spikes: possible autoscaling recommendation.
- High network transfer cost: possible network optimization.
- Unattached storage volumes or unused IP addresses: possible cleanup recommendation.
- Non-production resources active outside business hours: possible scheduling recommendation.
- High database cost with low utilization: possible database optimization.

Each recommendation must contain:
- Unique ID.
- Title.
- Category.
- Description.
- Affected resource.
- Cloud provider.
- Region.
- Priority.
- Estimated monthly savings.
- Estimated annual savings.
- Risk level.
- Implementation effort.
- Explanation of why the recommendation was generated.
- Suggested action.
- Current status.
- Created date.

Recommendation categories should include:
- Idle resources.
- Oversized instances.
- Storage optimization.
- Scheduling.
- Reserved capacity.
- Database optimization.
- Autoscaling.
- Network cost reduction.
- Security and reliability improvements.
- Sustainability improvements.

Add:
- Search.
- Filters for priority, category, provider, region, risk, effort, and status.
- Review action.
- Dismiss action.
- Mark as accepted action.
- Simulate action.
- AI explanation panel.
- Total possible savings summary.
- Recommendation priority summary.
- Refresh AI analysis button.

The current recommendation engine should be mock or rule-based, but the code must include a clear interface for connecting a real LLM API later. Add a visible label explaining that recommendations are generated in demo mode.

PERFORMANCE MONITORING PAGE

Create a performance and reliability monitoring page.

Display:
- CPU utilization.
- Memory utilization.
- Network utilization.
- Request latency.
- Availability.
- Error rate.
- Request count.
- Database connections.
- Health status.

Use line and area charts for performance over time. Add selectable time ranges such as 1 hour, 6 hours, 24 hours, 7 days, and 30 days.

Show resource health states:
- Healthy.
- Warning.
- Critical.
- Unknown.

Highlight:
- Underutilized resources.
- Overutilized resources.
- Performance anomalies.
- High-latency services.
- Availability problems.
- Error-rate spikes.

Create alerts with severity, affected resource, timestamp, description, and recommended response.

CARBON FOOTPRINT PAGE

Create a sustainability and carbon-footprint page.

Use clearly labeled estimated or simulated values when using demo data.

Display:
- Total estimated carbon emissions.
- Monthly emissions trend.
- Emissions by provider.
- Emissions by service.
- Emissions by region.
- Emissions by environment.
- Carbon emissions per unit of cloud spend.
- Sustainability score.
- Comparison with the previous month.

Show sustainability recommendations such as:
- Shutting down idle resources.
- Scheduling non-production workloads.
- Selecting more efficient regions.
- Using autoscaling.
- Moving data to suitable storage tiers.
- Reducing unnecessary data transfer.
- Improving workload utilization.

Include an explanation that carbon figures depend on provider methodology, region, workload type, and available data, and are estimates in demo mode.

OPTIMIZATION SIMULATOR PAGE

Create an interactive cost-optimization simulator.

Allow users to select one or more demo cloud resources and choose optimization strategies:

- Rightsize compute instances.
- Schedule non-production resources.
- Enable autoscaling.
- Move storage to a lower-cost tier.
- Purchase reserved capacity.
- Reduce cross-region network transfer.
- Remove unattached volumes.
- Remove unused IP addresses.
- Optimize database capacity.

For each strategy, display:
- Current monthly cost.
- Estimated optimized monthly cost.
- Estimated monthly savings.
- Estimated annual savings.
- Percentage savings.
- Expected performance impact.
- Risk level.
- Implementation effort.
- Sustainability impact.

Add:
- Run Simulation button.
- Before-and-after cost chart.
- Savings summary.
- Total projected annual savings.
- Resource-level comparison table.
- Reset Simulation button.
- Export Simulation button.

Clearly state that the simulator is a planning tool and does not make real changes to cloud infrastructure.

REPORTS PAGE

Create a report-generation page for cloud optimization summaries.

The report should include:
- Organization name.
- Report date.
- Reporting period.
- Total cloud spend.
- Projected spend.
- Potential monthly and annual savings.
- Optimization score.
- Top expensive resources.
- Top AI recommendations.
- Performance health summary.
- Critical alerts.
- Estimated carbon emissions.
- Sustainability recommendations.
- Optimization simulator results.

Add:
- Generate Report button.
- Printable report view.
- CSV export.
- JSON export if appropriate.
- Copy summary button.
- Report history using mock data or database storage.

SETTINGS PAGE

Create settings sections for:

1. Organization settings:
   - Organization name.
   - Default currency.
   - Time zone.
   - Monthly cloud budget.
   - Alert threshold.
   - Default reporting period.

2. Cloud provider connections:
   - AWS.
   - Microsoft Azure.
   - Google Cloud.

Show each provider as Not Connected, Connected, or Demo Mode. Use secure placeholders only. Include an explanation that credentials must be configured through secure server-side environment variables or a secrets manager.

3. Notification preferences:
   - Budget alerts.
   - Resource alerts.
   - Performance alerts.
   - AI recommendation alerts.
   - Weekly reports.

4. Appearance preferences:
   - Light mode.
   - Dark mode.
   - System mode.

5. Data settings:
   - Refresh demo data.
   - Reset demo data.
   - Export organization data.

CLOUD PROVIDER SERVICE ARCHITECTURE

Create separate secure service modules named:
- awsService.
- azureService.
- googleCloudService.

Each service should expose placeholder functions for:
- Fetching cloud resources.
- Fetching cost data.
- Fetching utilization metrics.
- Fetching performance metrics.
- Fetching region information.
- Estimating carbon emissions.

Create a shared provider adapter interface so the user interface receives a consistent data format regardless of provider.

For the initial version, all provider functions should return mock data and identify themselves as Demo Mode. Do not make destructive API calls or modify real accounts.

ANALYTICS AND CALCULATIONS

All analytics must be derived from the mock data or database records.

Calculate:
- Total monthly cloud cost.
- Month-over-month cost change.
- Year-over-year cost change.
- Projected end-of-month cost.
- Three-month cost forecast.
- Potential monthly savings.
- Potential annual savings.
- Average CPU utilization.
- Average memory utilization.
- Resource optimization score.
- Number of idle resources.
- Number of overprovisioned resources.
- Number of resources requiring review.
- Cost per provider.
- Cost per service.
- Cost per region.
- Cost per environment.
- Estimated carbon emissions.
- Optimization coverage percentage.

Use reusable utility functions for calculations. Do not duplicate calculation logic across pages.

MOCK DATA REQUIREMENTS

Create realistic mock data for:
- At least twenty cloud resources.
- At least twelve months of cost history.
- At least ten AI recommendations.
- Multiple performance metrics for several resources.
- Multiple alerts with different severities.
- Multiple cloud providers, regions, services, and environments.
- At least three optimization simulation scenarios.

Use services such as compute, storage, databases, networking, containers, serverless functions, and monitoring.

GLOBAL FUNCTIONAL REQUIREMENTS

- Add working client-side routing.
- Add functional navigation between every page.
- Add working search, filters, sorting, tabs, dropdowns, modals, drawers, date selectors, and forms.
- Add toast notifications for successful and failed actions.
- Add loading indicators for asynchronous operations.
- Add useful empty states.
- Add responsive layouts for desktop, tablet, and mobile.
- Add error boundaries or graceful error handling where appropriate.
- Keep state management organized and predictable.
- Keep components reusable.
- Keep mock data separate from presentation components.
- Add Demo Mode indicators.
- Ensure charts have legends, labels, tooltips, and accessible color choices.

SECURITY REQUIREMENTS

- Never expose secrets in client-side code.
- Never hard-code cloud credentials.
- Use environment variables for configuration.
- Validate forms and API inputs.
- Use server-side calls for future cloud-provider integrations.
- Avoid destructive cloud actions.
- Add clear permissions and confirmation steps for future production actions.
- Clearly separate simulation from execution.

README AND ACADEMIC PROJECT DOCUMENTATION

Create a professional README and an in-app About Project page containing:

- Project title.
- Problem statement.
- Motivation.
- Project objectives.
- Target users.
- Main features.
- Technology stack.
- System architecture overview.
- Data flow explanation.
- AI recommendation workflow.
- Cloud cost optimization workflow.
- Optimization simulator workflow.
- Database structure, if a database is included.
- Installation instructions.
- Environment-variable instructions.
- Demo-mode explanation.
- Security considerations.
- Current limitations.
- Future scope.
- Explanation of how the project can later integrate with AWS, Azure, Google Cloud, and a real LLM service.

Explain that the first version uses simulated cloud data and does not make real infrastructure changes.

TESTING AND QUALITY CHECK

After implementing the application, review and test the complete project.

Check that:
- The project starts successfully.
- Every route loads without errors.
- There are no TypeScript errors.
- There are no broken imports.
- There are no console errors.
- All navigation links work.
- All charts render correctly.
- Search and filters work.
- Sorting works.
- Modals and drawers open and close correctly.
- Forms validate input correctly.
- Simulator calculations work.
- Recommendation actions update state correctly.
- Export actions produce usable files or printable views.
- Loading, empty, success, and error states work.
- The application is responsive on mobile and desktop.
- No secret keys or credentials are exposed.
- Demo Mode is clearly visible.

Fix any issues you discover. Do not remove features to hide errors.

FINAL IMPLEMENTATION INSTRUCTIONS

Build the application in a modular way and prioritize a fully working demo over incomplete real cloud integrations. Start with the mock data layer, shared types, calculation utilities, service abstractions, routing, layout, and reusable UI components. Then implement each page and connect it to the data layer.

When finished, provide a concise summary of:
- Files and major components created.
- Features implemented.
- Demo credentials, if applicable.
- Environment variables required for future integrations.
- How to run the project.
- Known limitations.