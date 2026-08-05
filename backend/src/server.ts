import express, { type Express } from "express";
import { default as Router } from "./routes/index";
import cors from "cors";
import "dotenv/config";

const app : Express = express();
const port : number = parseInt(process.env.PORT || '3001');

app.use(express.json()); // Middleware pour parser le JSON des requêtes
app.use(
    cors({
        origin: "http://localhost:5173"
    }),
    Router
);

app.listen(port, () : void => {
    console.log(`http://localhost:${port}`);
});
