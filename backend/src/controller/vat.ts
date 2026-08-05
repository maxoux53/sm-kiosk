import prisma from "../database/databaseORM";
import { Request, Response } from "express";
import { appropriateHttpStatusCode } from "../util/appropriateHttpStatusCode";
import { PrismaClientKnownRequestError } from "../generated/prisma/internal/prismaNamespace";

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
        const vats = await prisma.vat.findMany({
            where: {
                deletion_date: null
            },
            select: {
                type: true,
                rate: true
            }
        });

        res.status(200).send(vats);
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
