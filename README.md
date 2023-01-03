# Image Search Abstraction Layer

An image search website that makes use of the [*Pixabay API*](https://pixabay.com/api/docs/).

Make sure to define the `PIXABAY_KEY` environment variable and install local packages.

- It's strongly recommended to assign the `NODE_ENV` environment variable to `production`.
  - [Read more](https://expressjs.com/en/advanced/best-practice-performance.html#set-node_env-to-production)
- Also, you can declare the `MONGO_URI` environment variable, which allows the server to store recent searches in a **MongoDB** database.
- If you want to change the server port, which is `3000` by default, you can declare the `PORT` environment variable.
