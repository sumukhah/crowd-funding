const next = require("next");
// const routes = require("./routes");
const app = next({ dev: process.env.NODE_ENV !== "production" });
// const handler = routes.getRequestHandler(app);
const handle = app.getRequestHandler();

// Without express
const { createServer } = require("http");
app.prepare().then(() => {
  createServer(handle).listen(3000);
});
