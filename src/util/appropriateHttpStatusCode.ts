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

export function appropriateHttpStatusCode(e: Error): {
    code: number;
    message: string;
} {
    if (e instanceof PrismaClientKnownRequestError) {
        return {
            code: prismaErrorCodes[e.code] ?? 500,
            message: e.message
        };
    }

    if (e instanceof PrismaClientValidationError) {
        return { code: 400, message: e.message };
    }

    if (e instanceof CloudflareAPIError) {
        return {
            code: e.status ?? 500,
            message: e.errors?.length ? e.errors.map((err) => err.message).join(", ") : e.message
        };
    }

    return { code: 500, message: e.message };
}
