import { ValidationError } from "@vinejs/vine";
import { Response } from "express";

interface VineFieldError {
    field?: string;
    message?: string;
    rule?: string;
}

/**
 * Renvoie une réponse 400 détaillée à partir d'une erreur de validation VineJS.
 *
 * `ValidationError.message` vaut toujours "Validation failure" : le détail utile
 * se trouve dans `messages`. Sans cela, le client ne peut pas savoir quel champ
 * a été refusé.
 */
export const sendValidationError = (res: Response, e: unknown): void => {
    const errors = (e as ValidationError)?.messages as
        | VineFieldError[]
        | undefined;

    if (!Array.isArray(errors) || errors.length === 0) {
        res.status(400).send((e as Error)?.message ?? "Validation failure");
        return;
    }

    res.status(400).send(
        errors
            .map((err) =>
                err.field ? `${err.field} : ${err.message}` : err.message
            )
            .join(" | ")
    );
};
