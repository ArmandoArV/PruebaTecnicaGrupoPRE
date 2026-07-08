import express, { Application } from "express";
import { router } from "./routes";
import { notFoundHandler } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";

export const app: Application = express();

app.use(express.json());
app.use("/api", router);
app.use(notFoundHandler);
app.use(errorHandler);
