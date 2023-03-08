// URL used for initiating authorization request
export const authorityUrl = "https://login.microsoftonline.com/common/";

// End point URL for Power BI API
export const powerBiApiUrl = "https://api.powerbi.com/";

// Scope for securing access token
export const scopeBase = [
  "https://analysis.windows.net/powerbi/api/Report.Read.All",
];

// Client Id (Application Id) of the AAD app.
export const clientId = "5beabb7f-b254-456c-ab8e-5d56cc1faac9";

// Id of the workspace where the report is hosted
export const workspaceId = "40e94aab-dc98-4008-96ea-642973453567";

// Id of the report to be embedded
export const reportId = "85bb992b-5b2e-4154-a0fd-2c716fab8fe8";
