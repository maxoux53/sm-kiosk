import prisma from "../database/databaseORM";
import { Request, Response } from "express";
import { appropriateHttpStatusCode } from "../util/appropriateHttpStatusCode";

export const getMembership = async (req : Request, res : Response) : Promise<void> => {
    const { user_id, event_id } = req.body;
    try {
        const membership = await prisma.membership.findUnique({
            where: {
                user_id_event_id: {
                    user_id,
                    event_id
                }
            }
        });

        if (membership) {
            res.status(200).send(membership);
        } else {
            res.sendStatus(404);
        }   

    } catch (e) {
        
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
}

export const getAllCashiersByEvent = async (req : Request, res : Response) : Promise<void> => {
    const { event_id } = req.body;

    try {
        const cashiers = await prisma.membership.findMany({
            where: {
                event_id,
                role: "cashier"
            },
            select: {
                user: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        email: true
                    }
                }
            }
        })
        res.status(200).send(cashiers);

    } catch (e) {
        
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
}

export const createMembership = async (req : Request, res : Response) : Promise<void> => {
    const { user_email, event_id } = req.body;

    try {
        const user_id = (await prisma.user.findUnique({
            where: {
                email: user_email
            },
            select: {
                id: true
            }
        }))?.id;

        if (!user_id) {
            res.status(404).send("User not found");
            return;
        }

        await prisma.membership.create({
            data: {
                user_id,
                event_id,
                role: "cashier"
            }
        });
        res.sendStatus(201);

    } catch (e) {
        
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
}

export const joinEvent = async (req : Request, res : Response) : Promise<void> => {
    const { event_id } = req.body;

    try {
        await prisma.membership.create({
            data: {
                user_id : req.session.id,
                event_id
            }
        });
        res.sendStatus(201);
        
    } catch (e) {
        
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
}

export const deleteMembership = async (req : Request, res : Response) : Promise<void> => {
    const { event_id } = req.body;

    try {
        await prisma.membership.delete({
            where: {
                user_id_event_id: {
                    user_id: req.session.id,
                    event_id
                }
            }
        });
        res.sendStatus(204);
        
    } catch (e) {
        
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
}

export const deleteCashierFromEvent = async (req : Request, res : Response) : Promise<void> => {
    const { user_id, event_id } = req.body;

    try {
        await prisma.membership.delete({
            where: {
                user_id_event_id: {
                    user_id,
                    event_id,
                },
                role: "cashier"
            }
        })
        res.sendStatus(204);

    } catch (e) {
        
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
}
