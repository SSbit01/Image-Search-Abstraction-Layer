const fetch = require("node-fetch");


let SearchString = null;


if (process.env.MONGO_URI) {
  const {connect, models, model, Schema} = require("mongoose"),
        model_name = "ISAL History";

  SearchString = models[model_name];

  if (!SearchString) {
    connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});
    SearchString = model("ISAL History", new Schema({
      search: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        default: Date.now
      }
    }));
  }
} else console.warn("Server didn't find a MONGO_URI variable in the .env file, recent searches route has been disabled.");


module.exports = {
  Search: async(query) => {
    try {
      const {hits} = await fetch(`https://pixabay.com/api/?key=${process.env.KEY}&per_page=200&${new URLSearchParams(query).toString()}`).then(d => d.json());
      if (query.hasOwnProperty("q") && SearchString) new SearchString({search: query.q}).save();
      return hits;
    } catch(err) {
      console.error(err);
      return err;
    }
    // Video search in a next future
  },
  GetRecentSearches: SearchString ? async() => {
    try {
      return (await SearchString.find({}).select("search date -_id").sort({"date": -1}).limit(100));
    } catch(err) {
      console.error(err);
      return err;
    }
  } : null
}