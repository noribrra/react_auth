import express from "express";
import { Idbconiction } from "./db.js";
import { routes } from "./routes/index.js";

// express
const PORT = process.env.PORT;
const app = express();
app.use(express.json());

// all routs
routes.forEach((route) => {
  app[route.method](route.path, route.handler);
});

Idbconiction().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});
