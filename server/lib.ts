import {connect, models, model, Schema} from "mongoose"


let SearchString: any;

if (process.env.MONGO_URI) {
  const model_name = "Searches"

  SearchString = models[model_name]

  if (!SearchString) {
    connect(process.env.MONGO_URI)
    SearchString = model(model_name, new Schema({
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


export function Search(query: {
  [key: string]: any
}) {
  return fetch(`https://pixabay.com/api/?key=${process.env.KEY}&${new URLSearchParams(query)}`)
           .then(res => res.json())
           .then(result => {
             if (query.hasOwnProperty("q") && SearchString) new SearchString({search: query.q}).save()
             return result
           })
           .catch(() => ({}))
  // Video search in a next future
}


export const GetRecentSearches = SearchString ? function(select = "search date -_id") {
  return SearchString.find({}).select(select).sort({"date": -1}).limit(100)
} : null