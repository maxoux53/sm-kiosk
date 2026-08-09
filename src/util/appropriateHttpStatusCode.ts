import { APIError as CloudflareAPIError } from "cloudflare";
import {
    PrismaClientKnownRequestError,
    PrismaClientValidationError
} from "../generated/prisma/internal/prismaNamespace";


const prismaErrorCodes: Record<string, number> = { // https://www.prisma.io/docs/orm/reference/error-reference#prisma-client-query-engine
    P2000: 400, // valeur trop longue pour la colonne
    P2001: 404, // l'enregistrement recherché dans le "where" n'existe pas
    P2002: 409, // violation de contrainte unique
    P2003: 409, // violation de contrainte de clé étrangère
    P2004: 400, // contrainte échouée sur la base de données
    P2005: 400, // valeur invalide stockée pour le type du champ
    P2006: 400, // valeur fournie invalide pour le champ
    P2007: 400, // erreur de validation des données
    P2011: 400, // violation de contrainte NOT NULL
    P2012: 400, // valeur requise manquante
    P2013: 400, // argument requis manquant
    P2014: 409, // la modification violerait une relation requise
    P2015: 404, // enregistrement lié introuvable
    P2016: 400, // erreur d'interprétation de la requête
    P2017: 400, // enregistrements de la relation non connectés
    P2018: 404, // enregistrements liés requis introuvables
    P2019: 400, // erreur de saisie
    P2020: 400, // valeur hors limites pour le type
    P2025: 404 // opération impossible car un enregistrement requis est introuvable
};

function buildPrismaErrorMessage(code: string, meta: Record<string, unknown> | undefined): string {
    if (!meta) {
        return `Database error [${code}].`;
    }

    switch (code) {
        case "P2000":
            return `The provided value is too long for the column \`${meta.column_name}\`.`;

        case "P2001":
            return `No record found matching the criteria: \`${meta.model_name}.${meta.argument_name} = ${meta.argument_value}\`.`;

        case "P2002":
            return `A unique constraint would be violated on \`${meta.target ?? meta.constraint}\`.`;

        case "P2003":
            return `Foreign key constraint failed on the field \`${meta.field_name}\`.`;

        case "P2004":
            return `A database constraint failed: ${meta.database_error}.`;

        case "P2005":
            return `The value stored for field \`${meta.field_name}\` is invalid for the column type.`;

        case "P2006":
            return `The provided value for \`${meta.model_name}.${meta.field_name}\` is invalid.`;

        case "P2007":
            return `Data validation error: ${meta.database_error}.`;

        case "P2011":
            return `Null constraint violation on \`${meta.constraint}\`. A required field was not provided.`;

        case "P2012":
            return `Missing a required value at \`${meta.path}\`.`;

        case "P2013":
            return `Missing required argument \`${meta.argument_name}\` for field \`${meta.field_name}\` on \`${meta.object_name}\`.`;

        case "P2014":
            return `This change would violate the required relation \`${meta.relation_name}\` between \`${meta.model_a_name}\` and \`${meta.model_b_name}\`.`;

        case "P2015":
            return `A related record could not be found: ${meta.details}.`;

        case "P2016":
            return `Query interpretation error: ${meta.details}.`;

        case "P2017":
            return `The records for relation \`${meta.relation_name}\` between \`${meta.parent_name}\` and \`${meta.child_name}\` are not connected.`;

        case "P2018":
            return `The required connected records were not found: ${meta.details}.`;

        case "P2019":
            return `Input error: ${meta.details}.`;

        case "P2020":
            return `Value out of range for the column type: ${meta.details}.`;

        case "P2025":
            return `The requested operation failed because a required record was not found: ${meta.cause}.`;

        default:
            return `Database error [${code}].`;
    }
}

export function appropriateHttpStatusCode(e: Error): {code: number; message: string;} {
    if (e instanceof PrismaClientKnownRequestError) {
        return {
            code: prismaErrorCodes[e.code] ?? 500,
            message: buildPrismaErrorMessage(e.code, e.meta)
        };
    }

    if (e instanceof PrismaClientValidationError) {
        return { code: 400, message: "Validation error: the request data is malformed." };
    }

    if (e instanceof CloudflareAPIError) {
        return {
            code: e.status ?? 500,
            message: e.errors?.length ? e.errors.map((err) => err.message).join(", ") : e.message
        };
    }

    return { code: 500, message: e.message };
}
