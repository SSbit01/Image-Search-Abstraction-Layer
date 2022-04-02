import {Search, GetRecentSearches} from "./lib"

import type {Express} from "express"


export default function(app: Express) {
  app.get("/api/search", async({query}, res) => {
    res.json(await Search(query))
  })
  
  if (GetRecentSearches instanceof Function) {
    app.get("/api/recent", async(req, res) => {
      res.json(await GetRecentSearches?.())
    })
  }
}