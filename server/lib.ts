import {connect, models, model, Schema} from "mongoose"


let SearchString: any;

if (process.env.MONGO_URI) {
  const MODEL_NAME = "searches"
  SearchString = models[MODEL_NAME]
  if (!SearchString) {
    connect(process.env.MONGO_URI)
    SearchString = model(MODEL_NAME, new Schema({
      search: {
        type: String,
        required: true
      }
    }, {
      versionKey: false,
      timestamps: {
        createdAt: "date",
        updatedAt: false
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
             if (typeof query.q == "string" && query.q && SearchString) new SearchString({search: query.q}).save()
             return result
           })
           .catch(() => ({}))
  // Video search in a next future
}


export const getRecentSearches = SearchString ? function(select = "search date -_id") {
  return SearchString.find({}).select(select).sort({"date": -1}).limit(100)
} : null