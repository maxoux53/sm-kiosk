import { PrismaClientKnownRequestError } from "../generated/prisma/internal/prismaNamespace";

export function appropriateHttpStatusCode(e: Error): {
    code: number;
    message: string;
} {
    let code;
    let message;

    if (e instanceof PrismaClientKnownRequestError && e.code === "P2025") {
        code = 404;
        message = "Introuvable";
    } else {
        code = 500;
        message = e.message;
    }

    return { code, message };
}
