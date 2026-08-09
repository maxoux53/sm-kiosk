import { Router, type Request, type Response } from "express";
import swaggerSpec from "../../spec.json" with { type: "json" };

import { default as v1Router } from "./v1/index";

const router = Router();

router.use("/v1", v1Router);

router.get("/swagger.json", (req: Request, res: Response): Response => {
    return res.status(200).json(swaggerSpec);
});

router.use((req: Request, res: Response): Response => {
    console.error(`Bad URL: ${req.path}`);
    return res
        .status(404)
        .send("Il ne s'agit pas d'une URL prise en charge par l'application.");
});

export default router;
