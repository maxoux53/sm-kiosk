import "express-serve-static-core";
import { JwtPayload } from "jsonwebtoken";

declare module "express-serve-static-core" {
    interface Request {
        session: JwtPayload | { id: number; email: string; isAdmin: boolean };
    }
}
