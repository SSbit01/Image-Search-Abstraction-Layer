require("dotenv/config")

if (!process.env.PIXABAY_KEY) {
  console.warn("PIXABAY_KEY environment variable is not defined! Searches won't work.")
}

const express = require("express"),
      helmet = require("helmet"),
      //
      { search, getRecentSearches, LIMIT_RECENT_SEARCHES } = require("./lib"),
      apiRoutes = require("./api")



const port = process.env.PORT || 3000,
      repository = "https://github.com/SSbit01/Image-Search-Abstraction-Layer",
      //
      app = express()



app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}))

app.use("/favicon.ico", express.static("favicon.ico"))



app.set("view engine", "pug")



// Routes
apiRoutes(app)


app.route("/").get((req, res) => {
  res.render("index", { repository })
})


app.route("/api").get((req, res) => {
  res.render("api", { limitRecentSearches: LIMIT_RECENT_SEARCHES })
})


app.route("/search").get(async({ query }, res) => {
  if (!+query.page) {
    query.page = "1"
  }

  query.per_page ||= "200"

  const results = await search(query)

  res.render("search", {
    repository,
    query,
    total: results?.totalHits,
    images: results?.hits
  })
})


app.route("/recent").get(async(req, res) => {
  res.render("recent", { data: await getRecentSearches() })
})


app.use((req, res, next) => {  // 404 Not Found Middleware
  res.status(404).render("404")
})
//



app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})