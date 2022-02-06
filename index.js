require("dotenv").config();

function GetViewPath(file) {
  return `./views/${file}.pug`;
}

const express = require("express"),
      helmet = require("helmet"),
      pug = require("pug"),
      {Search, GetRecentSearches} = require("./lib"),
      show_recent = GetRecentSearches instanceof Function,
      apiRoutes = require("./api.js"),
      port = process.env.PORT || 3000,
      app = express(),
      // Compile the Pages
      _404_page = pug.renderFile(GetViewPath("404")),
      index_page = pug.renderFile(GetViewPath("index"), {show_recent}),
      api_page = pug.renderFile(GetViewPath("api"), {show_recent}),
      render_search_page = pug.compileFile(GetViewPath("search"));
      //


apiRoutes(app);

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
  let {q, page} = query,
      images = await Search(query);

  if (!page) page = 1;
  if (!Array.isArray(images)) images = [];

  res.send(render_search_page({q, page, images, show_recent}));
});


if (show_recent) {
  const render_recent_page = pug.compileFile(GetViewPath("recent"));

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
