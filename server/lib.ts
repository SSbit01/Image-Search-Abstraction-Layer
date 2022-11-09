import {connection, connect, model, Schema} from "mongoose"


interface ISearch {
  value: string
  date: Date
}


const MODEL_NAME = "searches",
      LOCAL_RECENT_SEARCHES: ISearch[] = []


if (process.env.MONGO_URI && connection.readyState === 0) {
  connect(process.env.MONGO_URI, err => {
    if (err) {
      console.error(err)
    }
  })
  connection.on("connected", function() {
    model<ISearch>(MODEL_NAME, new Schema<ISearch>({
      value: {
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
  })
} else {
  console.warn("Server didn't find the MONGO_URI environment variable. Recent searches will be stored in a local object instead of a MongoDB database.")
}


export function search(query: {
  [key: string]: any
}): Promise<{
  totalHits: number
  hits: {
    pageURL: string
    tags: string
    previewURL: string
    previewWidth: number
    previewHeight: number
  }[]
}> | undefined {
  return fetch(`https://pixabay.com/api/?key=${process.env.KEY}&${new URLSearchParams(query)}`)
          .then(res => res.json())
          .then(result => {
            const value = query.q
            if (typeof value === "string" && value) {
              if (connection.readyState === 1) new (model<ISearch>(MODEL_NAME))({value}).save()
              else LOCAL_RECENT_SEARCHES.push({value, date: new Date()})
            }
            return result
          })
          .catch(() => void 0)
}


export const LIMIT_RECENT_SEARCHES = 100


export const getRecentSearches =  function({select = "-_id value date", limit = LIMIT_RECENT_SEARCHES} = {}) {
  return connection.readyState === 1 ? model<ISearch>(MODEL_NAME)?.find({}).select(select).sort("-date").limit(limit).lean() : LOCAL_RECENT_SEARCHES.slice(-limit).reverse()
}