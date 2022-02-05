require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const pug = require("pug");

const {Search, GetRecentSearches} = require("./lib");
const show_recent = GetRecentSearches instanceof Function;

const apiRoutes = require("./api.js");

const port = process.env.PORT || 3000;

const app = express();

apiRoutes(app);

// Compile the Pages
function GetViewPath(file) {
  return `./views/${file}.pug`;
}

const _404_page = pug.renderFile(GetViewPath("404"));
const index_page = pug.renderFile(GetViewPath("index"), {show_recent});
const api_page = pug.renderFile(GetViewPath("api"), {show_recent});
const render_search_page = pug.compileFile(GetViewPath("search"));
const render_recent_page = pug.compileFile(GetViewPath("recent"));
//

app.use(helmet({
  contentSecurityPolicy: false
}));

app.use("/favicon.ico", express.static("favicon.ico"));


//
app.route("/").get((req, res) => {
  res.send(index_page);
});


app.route("/api").get((req, res) => {
  res.send(api_page);
});


app.route("/search").get(async({query}, res) => {
  let {q, page} = query;
  if (!page) page = 1;

  let images = await Search(query);
  if (!Array.isArray(images)) images = [];

  res.send(render_search_page({q, page, images, show_recent}));
});

if (show_recent) {
  app.route("/recent").get(async(req, res) => {
    let data = await GetRecentSearches();
    if (!Array.isArray(data)) data = undefined;
    res.send(render_recent_page({data}));
  });
}

// 404 Not Found Middleware
app.use((req, res, next) => {
  res.send(_404_page);
});
//


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
