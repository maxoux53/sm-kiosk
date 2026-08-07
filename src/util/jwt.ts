import "dotenv/config";
import jsonwebtoken, { JwtPayload, SignOptions } from "jsonwebtoken";

export function sign(payload: JwtPayload, options: SignOptions): string {
    return jsonwebtoken.sign(payload, process.env.JWT_SECRET!, options);
}

export function verify(jwt: string): JwtPayload {
    return jsonwebtoken.verify(jwt, process.env.JWT_SECRET!) as JwtPayload;
}
