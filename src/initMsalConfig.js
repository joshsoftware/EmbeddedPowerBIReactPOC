import { clientId } from "./config";

export const msalConfig = {
  auth: {
    clientId: clientId,
  },
  cache: {
    cacheLocation: "localStorage",
  },
};
