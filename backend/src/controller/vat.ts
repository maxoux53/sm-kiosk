import prisma from "../database/databaseORM";
import { Prisma } from "../generated/prisma/client";
import { Request, Response } from "express";
import { appropriateHttpStatusCode } from "../util/appropriateHttpStatusCode";

export const getVat = async (req : Request, res : Response) : Promise<void> => {
    try {
        const vat = await prisma.vat.findFirst({
            where: {
                type: req.body.type,
                deletion_date: null
            }
        });

        if (vat) {
            res.send(vat);
        } else {
            res.sendStatus(404);
        }
    } catch(e) {
        
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
};

export const getAllVats = async (req : Request, res : Response) : Promise<void> => {
    try {
        const { search, offset, limit } = req.body;

        const sanitizedOffset = offset ?? 0;
        const sanitizedLimit = limit ?? 20;
        const sanitizedSearch = (search !== undefined && search !== null) ? search.trim() : undefined;

        const orConditions = new Array<Prisma.vatWhereInput>();

        if (sanitizedSearch) {
            if (!isNaN(Number(sanitizedSearch))) {
                const parsedNumericSearch = Number(sanitizedSearch);

                orConditions.push(
                    { rate: { equals: parsedNumericSearch } }
                );
            } else {
                // vat type is 1 char, search by exact match
                orConditions.push(
                    { type: { equals: sanitizedSearch, mode: "insensitive" } }
                );
            }
        }

        const whereClause: Prisma.vatWhereInput = {
            deletion_date: null,
            ...(sanitizedSearch && { OR: orConditions })
        };

        const [vats, total] = await Promise.all([
            prisma.vat.findMany({
                where: whereClause,
                skip: sanitizedOffset,
                take: sanitizedLimit,
                select: {
                    type: true,
                    rate: true
                },
                orderBy: {
                    type: 'asc'
                }
            }),
            prisma.vat.count({
                where: whereClause
            })
        ]);

        res.status(200).send({
            data: vats,
            pagination: {
                total,
                offset: sanitizedOffset,
                limit: sanitizedLimit
            }
        });
    } catch(e) {
        
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
};

export const createVat = async (req : Request, res : Response) : Promise<void> => {
    try {
        await prisma.vat.create({
            data: {
                type: req.body.type,
                rate: req.body.rate
            }
        })
        res.sendStatus(201);
        
    } catch(e) {
        
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
}

export const updateVat = async (req : Request, res : Response) : Promise<void> => {
    try {
        await prisma.vat.update({
            where: {
                type: req.body.type
            },
            data: {
                rate: req.body.rate
            }
        })

        res.sendStatus(204);
    } catch(e) {
        
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
}

export const deleteVat = async (req : Request, res : Response) : Promise<void> => {
    try {
        await prisma.vat.update({
            where: {
                type: req.body.type,
                deletion_date: null
            },
            data: {
                deletion_date: new Date()
            }
        })

        res.sendStatus(204);
    } catch(e) {
        
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
}
