import { PowerBIEmbed } from "powerbi-client-react";
import { useEffect, useState } from "react";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsalAuthentication,
  useMsal,
} from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";

import "./App.css";
import { powerBiApiUrl, reportId, workspaceId } from "./config";

function App() {
  const [isLoading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");

  const { instance, accounts, inProgress } = useMsal();
  // const accountIdentifiers = {
  //   username: "shailendra.kanherkar@joshsoftware.com",
  // };

  const loginRequest = {
    scopes: ["https://analysis.windows.net/powerbi/api/Report.Read.All"],
  };

  const { login, result, error } = useMsalAuthentication(
    InteractionType.Popup,
    loginRequest
  );

  const fetchReportDetails = async () => {
    setLoading(true);
    let accessToken;
    instance
      .acquireTokenSilent(loginRequest)
      .then((response) => {
        accessToken = response.accessToken;
        setAccessToken(accessToken);
        return fetch(
          powerBiApiUrl +
            "v1.0/myorg/groups/" +
            workspaceId +
            "/reports/" +
            reportId,
          {
            headers: {
              Authorization: "Bearer " + accessToken,
            },
            method: "GET",
          }
        );
      })
      .then((response) => response.json())
      .then((data) => {
        setEmbedUrl(data.embedUrl);
        setLoading(false);
      });
  };

  const onLogout = () => {
    instance.logoutPopup({});
    setEmbedUrl("");
    setAccessToken("");
  };

  useEffect(() => {
    if (result) {
      setAccessToken(result.accessToken);
    }
  }, [result]);

  if (isLoading) return <div className="App">Loading...</div>;

  return (
    <div className="App">
      <h2>Power BI demo</h2>
      {accounts.length > 0 && (
        <button onClick={fetchReportDetails}>Embed Report</button>
      )}
      {accounts.length === 0 && (
        <button onClick={() => login(InteractionType.Popup, loginRequest)}>
          Sign In
        </button>
      )}
      <button onClick={onLogout}>Log Out</button>
      {embedUrl.length > 0 && (
        <PowerBIEmbed
          embedConfig={{
            type: "report", // Supported types: report, dashboard, tile, visual and qna
            id: reportId,
            embedUrl: embedUrl,
            accessToken: accessToken,
            // tokenType: models.TokenType.Embed,
          }}
          eventHandlers={
            new Map([
              [
                "loaded",
                function () {
                  console.log("Report loaded");
                },
              ],
              [
                "rendered",
                function () {
                  console.log("Report rendered");
                },
              ],
              [
                "error",
                function (event) {
                  console.log(event.detail);
                },
              ],
            ])
          }
          cssClassName="report-style-class"
          getEmbeddedComponent={(embeddedReport) => {
            console.log("embeddedReport", embeddedReport);
          }}
        />
      )}

      <p>Anyone can see this paragraph.</p>
      <AuthenticatedTemplate>
        <p>Signed in as: {accounts[0]?.username}</p>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <p>No users are signed in!</p>
      </UnauthenticatedTemplate>
    </div>
  );
}

export default App;
