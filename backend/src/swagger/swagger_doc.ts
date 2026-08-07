import { default as swaggerJSDoc } from "swagger-jsdoc";
import * as fs from "node:fs";

const swaggerSpec = swaggerJSDoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "SMKiosk API",
            version: "1.0.0"
        }
    },
    apis: [
        "./src/controller/**/*.ts",
        "./src/middleware/**/*.ts",
        "./src/routes/**/*.ts"
    ]
});

fs.writeFileSync("./spec.json", JSON.stringify(swaggerSpec));
