const url = require("url");
const { StringDecoder } = require("string_decoder");
const routes = require("../routes");
const {
  notFoundRouteController,
} = require("../controller/notFoundRouteController");
const { parseJson } = require("./utl");

const helper = {};

helper.handleReqRes = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname.replace(/^\/+|\/+$/g, "");
  const method = req.method.toLowerCase();
  const query = parsedUrl.query;
  const headers = req.headers;

  const requestedPropereties = {
    path,
    method,
    query,
    headers,
  };

  const requestRoute = routes[path] ? routes[path] : notFoundRouteController;

  const decoder = new StringDecoder("utf8");

  let realData = "";

  req.on("data", (buffer) => {
    realData += decoder.write(buffer);
  });

  req.on("end", () => {
    realData += decoder.end();
    requestedPropereties.body = parseJson(realData);

    requestRoute(requestedPropereties, (statusCode, payload) => {
      res.setHeader("Content-type", "application/json");
      res.writeHead(statusCode);
      res.end(JSON.stringify(payload));
    });
  });
};

module.exports = helper;
