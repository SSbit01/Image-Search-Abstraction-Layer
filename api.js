const {Search, GetRecentSearches} = require("./lib");


module.exports = app => {
  app.get("/api/search", async({query}, res) => {
    const data = await Search(query);

    if (Array.isArray(data)) res.json(data);
    else res.status(500).send("An error occurred");
  });

  
  if (GetRecentSearches instanceof Function) {
    app.get("/api/recent", async(req, res) => {
      const data = await GetRecentSearches();

      if (Array.isArray(data)) res.json(data);
      else res.status(500).send("An error occurred");
    });
  }
}