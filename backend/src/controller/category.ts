import prisma from "../database/databaseORM";
import { Prisma } from "../generated/prisma/client";
import { Request, Response } from "express";
import { eraseStoredImage } from '../util/images';
import { appropriateHttpStatusCode } from "../util/appropriateHttpStatusCode";

/**
 * @swagger
 * components:
 *  schemas:
 *      Category:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *              label:
 *                  type: string
 *              vat_type:
 *                  type: string
 *              picture:
 *                  type: string
 *              deletion_date:
 *                  type: string
 *                  format: date-time
 *                  nullable: true
 */

/**
 * @swagger
 * components:
 *  responses:
 *      Category:
 *          description: the category
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Category'
 */
export const getCategory = async (req : Request, res : Response) : Promise<void> => {
    try {
        const category = await prisma.category.findFirst({
            where: {
                id: req.body.id,
                deletion_date: null
            }
        });

        if (category) {
            res.status(200).send(category);
        } else {
            res.sendStatus(404);
        }
    } catch (e) {
        
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
};

/**
 * @swagger
 * components:
 *  responses:
 *      CategoryList:
 *          description: a list of categories
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          data:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/Category'
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
export const getAllCategories = async (req : Request, res : Response) : Promise<void> => {
    try {
        const { search, offset, limit } = req.body;

        const sanitizedOffset = offset ?? 0;
        const sanitizedLimit = limit ?? 20;
        const sanitizedSearch = (search !== undefined && search !== null) ? search.trim() : undefined;

        const orConditions = new Array<Prisma.categoryWhereInput>();

        if (sanitizedSearch) {
            if (!isNaN(Number(sanitizedSearch))) {
                const parsedNumericSearch = Number(sanitizedSearch);

                orConditions.push(
                    { id: { equals: parsedNumericSearch } },
                    { vat_type: { equals: String.fromCharCode(parsedNumericSearch) } }
                );
            } else {
                orConditions.push(
                    { label: { contains: sanitizedSearch, mode: "insensitive" } }
                );
            }
        }

        const whereClause: Prisma.categoryWhereInput = {
            deletion_date: null,
            ...(sanitizedSearch && { OR: orConditions })
        };

        const [categories, total] = await Promise.all([
            prisma.category.findMany({
                where: whereClause,
                skip: sanitizedOffset,
                take: sanitizedLimit,
                orderBy: {
                    id: 'asc'
                }
            }),
            prisma.category.count({
                where: whereClause
            })
        ]);

        res.status(200).send({
            data: categories,
            pagination: {
                total,
                offset: sanitizedOffset,
                limit: sanitizedLimit
            }
        });
    } catch (e) {
        
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
}

export const getAllLabelCategory = async (req : Request, res : Response) : Promise<void> => {
    try {
        const labels = await prisma.category.findMany({
            where: {
                deletion_date: null
            },
            select: {
                id: true,
                label: true
            }
        })
        res.status(200).send(labels);
    } catch (e) {
        
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
}

/**
 * @swagger
 * components:
 *  schemas:
 *      CategoryToAdd:
 *          type: object
 *          properties:
 *              label:
 *                  type: string
 *              vat_type:
 *                  type: string
 *              picture:
 *                  type: string
 */

/**
 * @swagger
 * components:
 *  responses:
 *      CategoryAdded:
 *          description: the created category id
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          id:
 *                              type: integer
 */
export const createCategory = async (req : Request, res : Response) : Promise<void> => {
    const { label, vat_type, picture } = req.body;

    try {
        const newCategory = await prisma.category.create({
            data: {
                label,
                vat_type,
                picture
            },
            select: {
                id: true
            }
        });

        res.status(201).send(newCategory);
    } catch (e) {
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
}

/**
 * @swagger
 * components:
 *  schemas:
 *      CategoryToUpdate:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *              label:
 *                  type: string
 *              vat_type:
 *                  type: string
 *              picture:
 *                  type: string
 */
export const updateCategory = async (req : Request, res : Response) : Promise<void> => {
    const { id, label, vat_type, picture } = req.body;

    try {
        await prisma.category.update({
            where: {
                id
            },
            data: {
                label, 
                vat_type,
                picture
            }
        });

        res.sendStatus(204);
    } catch (e) {
        
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
}

export const deleteCategory = async (req : Request, res : Response) : Promise<void> => {
    try {
        await eraseStoredImage((await prisma.category.update({
            where: {
                id: req.body.id
            },
            data: {
                deletion_date: new Date()
            },
            select: {
                picture: true
            }
        })).picture);

        res.sendStatus(204);
    } catch (e) {
        
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
}
