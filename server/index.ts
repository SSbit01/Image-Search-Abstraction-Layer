import "dotenv/config"
import express from "express"
import helmet from "helmet"
import {Search, GetRecentSearches} from "./lib"
import ApiRoutes from "./api"



const show_recent = GetRecentSearches instanceof Function,
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
ApiRoutes(app)


app.route("/").get((req, res) => {
  res.render("index", {show_recent})
})


app.route("/api").get((req, res) => {
  res.render("api", {show_recent})
})


app.route("/search").get(async({query}, res) => {
  const custom_query = {...query}
  custom_query.per_page ??= "200"

  const {totalHits: total, hits} = await Search(custom_query)

  res.render("search", {
    show_recent,
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


if (show_recent) {
  app.route("/recent").get(async(req, res) => {
    res.render("recent", {data: await GetRecentSearches?.()})
  })
}


app.use((req, res, next) => {  // 404 Not Found Middleware
  res.status(404).render("404")
})
//



app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})