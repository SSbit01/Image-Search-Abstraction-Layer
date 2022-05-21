import {connect, models, model, Schema} from "mongoose"


let searchString: any;

if (process.env.MONGO_URI) {
  const MODEL_NAME = "Searches"
  searchString = models[MODEL_NAME]
  if (!searchString) {
    connect(process.env.MONGO_URI)
    searchString = model(MODEL_NAME, new Schema({
      search: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        default: Date.now
      }
    }))
  }
} else console.warn("Server didn't find the MONGO_URI environment variable, recent searches route has been disabled.")


export function search(query: {
  [key: string]: any
}) {
  return fetch(`https://pixabay.com/api/?key=${process.env.KEY}&${new URLSearchParams(query)}`)
           .then(res => res.json())
           .then(result => {
             if (typeof query.q == "string" && query.q && searchString) new searchString({search: query.q}).save()
             return result
           })
           .catch(() => ({}))
  // Video search in a next future
}


export const getRecentSearches = searchString ? function(select = "search date -_id") {
  return searchString.find({}).select(select).sort({"date": -1}).limit(100)
} : null