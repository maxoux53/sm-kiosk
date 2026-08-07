import prisma from "../database/databaseORM";
import { Prisma } from "../generated/prisma/client";
import { Request, Response } from "express";
import { appropriateHttpStatusCode } from "../util/appropriateHttpStatusCode";
import { PAGINATION_LIMIT_DEFAULT_SIZE } from '../../../shared/constraint-constants';

/**
 * @swagger
 * components:
 *  schemas:
 *      Event:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *              name:
 *                  type: string
 *              location:
 *                  type: string
 *              image:
 *                  type: string
 *                  nullable: true
 *              is_active:
 *                  type: boolean
 *              iban:
 *                  type: string
 */

/**
 * @swagger
 * components:
 *  responses:
 *      Event:
 *          description: the event
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Event'
 */
export const getEvent = async (req : Request, res : Response) : Promise<void> => {
    try {
        const event = await prisma.event.findUnique({
            where: {
                id: req.body.event_id
            },
        });

        if (event?.image) {
            event.image = `https://imagedelivery.net/${process.env.CF_ACCOUNT_HASH}/${event.image}/public`;
        }

        if (event) {
            res.status(200).send(event);
        } else {
            res.sendStatus(404);
        }
    } catch (e) {
        
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
}

/**
 * @swagger
 * components:
 *  responses:
 *      EventList:
 *          description: a list of events
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          data:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/Event'
 *                          pagination:
 *                              type: object
 *                              properties:
 *                                  total:
 *                                      type: integer
 *                                  offset:
 *                                      type: integer
 *                                  limit:
 *                                      type: integer
 */
export const getAllEvents = async (req : Request, res : Response) : Promise<void> => {
    try {
        const { search, offset, limit } = req.body;

        const sanitizedOffset = offset ?? 0;
        const sanitizedLimit = limit ?? PAGINATION_LIMIT_DEFAULT_SIZE;
        const sanitizedSearch = (search !== undefined && search !== null) ? search.trim() : undefined;

        const orConditions = new Array<Prisma.eventWhereInput>();

        if (sanitizedSearch) {
            if (!isNaN(Number(sanitizedSearch))) {
                const parsedNumericSearch = Number(sanitizedSearch);

                orConditions.push(
                    { id: { equals: parsedNumericSearch } }
                );
            } else {
                orConditions.push(
                    { name: { contains: sanitizedSearch, mode: "insensitive" } },
                    { location: { contains: sanitizedSearch, mode: "insensitive" } },
                    { iban: { contains: sanitizedSearch, mode: "insensitive" } }
                );
            }
        }

        const whereClause: Prisma.eventWhereInput = {
            ...(sanitizedSearch && { OR: orConditions })
        };

        const [events, total] = await Promise.all([
            prisma.event.findMany({
                where: whereClause,
                skip: sanitizedOffset,
                take: sanitizedLimit,
                orderBy: {
                    id: 'asc'
                }
            }),
            prisma.event.count({
                where: whereClause
            })
        ]);

        events.map((event) => {
            if (event?.image) {
                event.image = `https://imagedelivery.net/${process.env.CF_ACCOUNT_HASH}/${event.image}/public`;
            }
        });

        res.status(200).send({
            data: events,
            pagination: {
                total,
                offset: sanitizedOffset,
                limit: sanitizedLimit
            }
        });
    } catch(e) {
        console.error(e)
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
}

export const getEventsByUser = async (req : Request, res : Response) : Promise<void> => {
    try {
         const events = await prisma.event.findMany({
            where: {
                membership: {
                    some: {
                        user_id: req.session.id,  
                        role: {
                            in: ['host', 'cashier']
                        }
                    }
                }
            }
        });
      
        res.status(200).send(events);
    } catch(e) {
        console.error(e)
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
}

/**
 * @swagger
 * components:
 *  schemas:
 *      EventToAdd:
 *          type: object
 *          properties:
 *              name:
 *                  type: string
 *              location:
 *                  type: string
 *              is_active:
 *                  type: boolean
 *              iban:
 *                  type: string
 *              image:
 *                  type: string
 *                  nullable: true
 */

/**
 * @swagger
 * components:
 *  responses:
 *      EventAdded:
 *          description: the created event id
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          id:
 *                              type: integer
 */
export const createEvent = async (req : Request, res : Response) : Promise<void> => {
    const { name, location, is_active, iban, image } = req.body;

    try {
        const newEvent = await prisma.event.create({
            data: {
                name,
                location,
                is_active,
                iban,
                image,
                membership: {
                    // Nested write transaction
                    create: {
                        role: 'host',
                        user: {
                            connect: { id: req.session.id }
                        }
                    }
                }
            },
            select: {id: true}
        });

        res.status(201).send(newEvent);
    } catch (e) {
        
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
}

/**
 * @swagger
 * components:
 *  schemas:
 *      EventToUpdate:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *              name:
 *                  type: string
 *              location:
 *                  type: string
 *              is_active:
 *                  type: boolean
 *              iban:
 *                  type: string
 *              image:
 *                  type: string
 *                  nullable: true
 */
export const updateEvent = async (req : Request, res : Response) : Promise<void> => {
    const { id, name, location, is_active, iban, image } = req.body;

    try {
        await prisma.event.update({
            where: { id },
            data: {
                name,
                location,
                is_active,
                iban,
                image
            }
        });
        
        res.sendStatus(204);
    } catch (e) {
        
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
}

export const deleteEvent = async (req : Request, res : Response) : Promise<void> => {
    try {
        await prisma.$transaction([
            prisma.product.updateMany({
                where: {
                    event_id: req.body.event_id,
                    deletion_date: null
                },
                data: {
                    deletion_date: new Date()
                }
            }),
            prisma.event.delete({
                where: { 
                    id: req.body.event_id
                }
            })
        ])
        res.sendStatus(204);
        
    } catch (e) {
        
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
}
