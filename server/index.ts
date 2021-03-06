import "dotenv/config"
import express from "express"
import helmet from "helmet"
import {search, getRecentSearches} from "./lib"
import apiRoutes from "./api"



const showRecent = getRecentSearches instanceof Function,
      //
      port = process.env.PORT || 3000,
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
  res.render("index", {showRecent})
})


app.route("/api").get((req, res) => {
  res.render("api", {showRecent})
})


app.route("/search").get(async({query}, res) => {
  const CUSTOM_QUERY = {...query}
  CUSTOM_QUERY.per_page ??= "200"

  const {totalHits: total, hits} = await search(CUSTOM_QUERY)

  res.render("search", {
    showRecent,
    query,
    total,
    images: hits?.map(({
      pageURL: url,
      tags,
      previewURL: preview,
      previewWidth: width,
      previewHeight: height
    }: {
      [key: string]: string
    }) => ({url, tags, preview, width, height}))
  })
})


if (showRecent) {
  app.route("/recent").get(async(req, res) => {
    res.render("recent", {data: await getRecentSearches?.()})
  })
}


app.use((req, res, next) => {  // 404 Not Found Middleware
  res.status(404).render("404")
})
//



app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})