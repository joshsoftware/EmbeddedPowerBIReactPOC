import { models } from "powerbi-client";
import { PowerBIEmbed } from "powerbi-client-react";
import { useState } from "react";

import "./App.css";

const sampleReportUrl =
  "https://playgroundbe-bck-1.azurewebsites.net/Reports/SampleReport";

function App() {
  const [isLoading, setLoading] = useState(false);
  const [reportStatus, setReportStatus] = useState("");
  const [embedConfig, setEmbedConfig] = useState({
    type: "report", // Supported types: report, dashboard, tile, visual and qna
    id: undefined,
    embedUrl: undefined,
    accessToken: undefined,
    tokenType: models.TokenType.Embed,
    // settings: {
    //   panes: {
    //     filters: {
    //       expanded: false,
    //       visible: false,
    //     },
    //   },
    //   background: models.BackgroundType.Transparent,
    // },
  });

  const fetchReportDetails = async () => {
    setLoading(true);
    const response = await fetch(sampleReportUrl);
    const responseJson = await response.json();
    console.log(responseJson);
    setEmbedConfig({
      ...embedConfig,
      embedUrl: responseJson.EmbedUrl,
      accessToken: responseJson.EmbedToken.Token,
    });
    setLoading(false);
  };

  if (isLoading) return <div className="App">Loading...</div>;

  return (
    <div className="App">
      <h2>Power BI demo</h2>
      <h3>{reportStatus}</h3>
      <button onClick={fetchReportDetails}>Embed Report</button>
      <PowerBIEmbed
        embedConfig={embedConfig}
        eventHandlers={
          new Map([
            [
              "loaded",
              function () {
                console.log("Report loaded");
                setReportStatus("Report loaded");
              },
            ],
            [
              "rendered",
              function () {
                console.log("Report rendered");
                setReportStatus("Report rendered");
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
        getEmbeddedComponent={(embeddedReport) => {}}
      />
    </div>
  );
}

export default App;
