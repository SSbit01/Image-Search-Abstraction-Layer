const { search, getRecentSearches } = require("./lib")


module.exports = function(app) {
  app.get("/api/search", async({ query }, res) => {
    res.json(await search(query))
  })
  
  app.get("/api/recent", async(req, res) => {
    res.json(await getRecentSearches())
  })
}