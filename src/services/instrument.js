// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "https://4cd84c7696baca85f06987b6d6ab655d@o4510121274507264.ingest.us.sentry.io/4510121276080128",
  sendDefaultPii: true,
});