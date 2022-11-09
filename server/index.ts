import "dotenv/config"

import express from "express"
import helmet from "helmet"

import {search, getRecentSearches, LIMIT_RECENT_SEARCHES} from "./lib"
import apiRoutes from "./api"



const port = process.env.PORT || 3000,
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
  res.render("index")
})


app.route("/api").get((req, res) => {
  res.render("api", {limitRecentSearches: LIMIT_RECENT_SEARCHES})
})


app.route("/search").get(async({query}, res) => {
  query.per_page ??= "200"

  const results = await search(query)

  res.render("search", {
    query,
    total: results?.totalHits,
    images: results?.hits.map(({
      pageURL: url,
      tags,
      previewURL: preview,
      previewWidth: width,
      previewHeight: height
    }) => ({url, tags, preview, width, height}))
  })
})


app.route("/recent").get(async(req, res) => {
  res.render("recent", {data: await getRecentSearches?.()})
})


app.use((req, res, next) => {  // 404 Not Found Middleware
  res.status(404).render("404")
})
//



app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})