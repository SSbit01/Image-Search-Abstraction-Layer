import {search, getRecentSearches} from "./lib"

import type {Express} from "express"


export default function(app: Express) {
  app.get("/api/search", async({query}, res) => {
    res.json(await search(query))
  })
  
  if (getRecentSearches instanceof Function) {
    app.get("/api/recent", async(req, res) => {
      res.json(await getRecentSearches?.())
    })
  }
}