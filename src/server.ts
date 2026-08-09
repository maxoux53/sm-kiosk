import express, { type Express } from "express";
import { default as router } from "./routes/index";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../spec.json" with { type: "json" };
import "dotenv/config";

const app: Express = express();
const port: number = parseInt(process.env.PORT || "3001");

app.use(morgan("dev")); // Logging HTTP
app.use(express.json()); // Middleware pour parser le JSON des requêtes

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // Swagger UI

app.use(
    cors({
        origin: ["http://localhost:5173", "http://localhost:4173", "https://sm-kiosk-web.vercel.app"],
    }),
    router
);

app.listen(port, (): void => {
    console.log(`http://localhost:${port}`);
});
