const axios = require("axios").default,
      { connection, connect, model, models, Schema } = require("mongoose")


const MODEL_NAME = "searches",
      LOCAL_RECENT_SEARCHES = []


if (process.env.MONGO_URI && connection.readyState === 0) {
  connect(process.env.MONGO_URI, err => {
    if (err) {
      console.error(err)
    }
  })
  connection.on("connected", function() {
    model(MODEL_NAME, new Schema({
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


module.exports = {
  LIMIT_RECENT_SEARCHES: 100,
  
  search(query) {
    return axios.get(`https://pixabay.com/api/?key=${process.env.PIXABAY_KEY}&${new URLSearchParams(query)}`)
      .then(res => {
        const value = query.q
        if (typeof value === "string" && value) {
          if (connection.readyState === 1) new models[MODEL_NAME]({ value }).save()
          else LOCAL_RECENT_SEARCHES.push({ value, date: new Date() })
        }
        return res.data
      })
      .catch(() => void 0)
  },
  
  getRecentSearches({ select = "-_id value date", limit = this.LIMIT_RECENT_SEARCHES } = {}) {
    return connection.readyState === 1 ? models[MODEL_NAME]?.find({}).select(select).sort("-date").limit(limit).lean() : LOCAL_RECENT_SEARCHES.slice(-limit).reverse()
  }
}