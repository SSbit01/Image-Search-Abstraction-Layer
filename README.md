# Image Search Abstraction Layer

It's simple image search website that makes use of the [*Pixabay API*](https://pixabay.com/api/docs/).

Make sure to define the `KEY` (*Pixabay Key*) environment variable and install local packages.

- It's strongly recommended to assign the `NODE_ENV` environment variable to `production`.
  - [Read more](https://expressjs.com/en/advanced/best-practice-performance.html#set-node_env-to-production)
- Also, you can declare the `MONGO_URI` environment variable, which allows the server to store recent searches in a **MongoDB** database.
- If you want to change the server port, which is `3000` by default, you can declare the `PORT` environment variable.

> If a **Node.js** version earlier than **18.0.0** is being used, the [`node-fetch`](https://github.com/node-fetch/node-fetch) module is required.
