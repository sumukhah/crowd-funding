const routes = require("next-routes");

module.exports = routes()
  .add("/campaigns/new", "/campaigns/new")
  .add("/campaigns/:slug", "campaigns/show");
