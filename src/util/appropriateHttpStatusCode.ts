import { APIError as CloudflareAPIError } from "cloudflare";
import {
    PrismaClientKnownRequestError,
    PrismaClientValidationError
} from "../generated/prisma/internal/prismaNamespace";


const prismaErrorCodes: Record<string, number> = { // https://www.prisma.io/docs/orm/reference/error-reference#prisma-client-query-engine
    P2000: 400,
    P2001: 404,
    P2002: 409,
    P2003: 409,
    P2004: 400,
    P2005: 400,
    P2006: 400,
    P2007: 400,
    P2011: 400,
    P2012: 400,
    P2013: 400,
    P2014: 409,
    P2015: 404,
    P2016: 400,
    P2017: 400,
    P2018: 404,
    P2019: 400,
    P2020: 400,
    P2025: 404
};

function buildPrismaErrorMessage(code: string, meta: Record<string, unknown> | undefined): string {
    if (!meta) {
        return `Erreur de base de données [${code}].`;
    }

    switch (code) {
        case "P2000":
            return `La valeur fournie est trop longue pour la colonne \`${meta.column_name}\`.`;

        case "P2001":
            return `Aucun enregistrement trouvé correspondant aux critères : \`${meta.model_name}.${meta.argument_name} = ${meta.argument_value}\`.`;

        case "P2002": {
            const target = meta.target;
            if (Array.isArray(target) && target.length) {
                return `Une contrainte d'unicité serait violée sur \`${target.join(", ")}\`.`;
            }
            if (typeof meta.constraint === "string") {
                return `Une contrainte d'unicité serait violée sur \`${meta.constraint}\`.`;
            }
            return `Une contrainte d'unicité serait violée.`;
        }

        case "P2003":
            return `La contrainte de clé étrangère a échoué sur le champ \`${meta.field_name}\`.`;

        case "P2004":
            return `Une contrainte de base de données a échoué : ${meta.database_error}.`;

        case "P2005":
            return `La valeur stockée pour le champ \`${meta.field_name}\` est invalide pour le type de la colonne.`;

        case "P2006":
            return `La valeur fournie pour \`${meta.model_name}.${meta.field_name}\` est invalide.`;

        case "P2007":
            return `Erreur de validation des données : ${meta.database_error}.`;

        case "P2011":
            return `Violation de contrainte NOT NULL sur \`${meta.constraint}\`. Un champ obligatoire n'a pas été fourni.`;

        case "P2012":
            return `Valeur obligatoire manquante à \`${meta.path}\`.`;

        case "P2013":
            return `Argument obligatoire manquant \`${meta.argument_name}\` pour le champ \`${meta.field_name}\` sur \`${meta.object_name}\`.`;

        case "P2014":
            return `Cette modification violerait la relation obligatoire \`${meta.relation_name}\` entre \`${meta.model_a_name}\` et \`${meta.model_b_name}\`.`;

        case "P2015":
            return `Un enregistrement lié est introuvable : ${meta.details}.`;

        case "P2016":
            return `Erreur d'interprétation de la requête : ${meta.details}.`;

        case "P2017":
            return `Les enregistrements de la relation \`${meta.relation_name}\` entre \`${meta.parent_name}\` et \`${meta.child_name}\` ne sont pas connectés.`;

        case "P2018":
            return `Les enregistrements liés requis sont introuvables : ${meta.details}.`;

        case "P2019":
            return `Erreur de saisie : ${meta.details}.`;

        case "P2020":
            return `Valeur hors limites pour le type de la colonne : ${meta.details}.`;

        case "P2025":
            return `L'opération demandée a échoué car un enregistrement requis est introuvable : ${meta.cause}.`;

        default:
            return `Erreur de base de données [${code}].`;
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
        return { code: 400, message: "Erreur de validation : les données de la requête sont mal formées." };
    }

    if (e instanceof CloudflareAPIError) {
        return {
            code: e.status ?? 500,
            message: e.errors?.length ? e.errors.map((err) => err.message).join(", ") : e.message
        };
    }

    return { code: 500, message: e.message };
}
