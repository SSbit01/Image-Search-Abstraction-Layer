# Image Search Abstraction Layer

A simple image search website. It makes use of the <a  href="https://pixabay.com/api/docs/"  target="_blank">Pixabay API</a>

Make sure to create an `.env` file with the `KEY` (Pixabay Key) variable and install local packages (`npm install`) before starting

Also you can specify a `MONGO_URI` in the `.env` file, which allows the server to store search history

If you want to change the server port, which is `3000` by default, you can specify it in the `.env` file with the `PORT` variable