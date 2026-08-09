import prisma from "../database/databaseORM";
import { Prisma } from "../generated/prisma/client";
import { Request, Response } from "express";
import { eraseStoredImage } from "../util/images";
import { appropriateHttpStatusCode } from "../util/appropriateHttpStatusCode";
import { PAGINATION_LIMIT_DEFAULT_SIZE } from "../constraint-constants";

/**
 * @swagger
 * components:
 *  schemas:
 *      Product:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *              label:
 *                  type: string
 *              is_available:
 *                  type: boolean
 *              excl_vat_price:
 *                  type: number
 *              picture:
 *                  type: string
 *                  nullable: true
 *              deletion_date:
 *                  type: string
 *                  format: date-time
 *                  nullable: true
 *              category_id:
 *                  type: integer
 *              event_id:
 *                  type: integer
 *                  nullable: true
 *              category:
 *                  $ref: '#/components/schemas/Category'
 */

/**
 * @swagger
 * components:
 *  responses:
 *      Product:
 *          description: the product
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Product'
 */
export const getProduct = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const product = await prisma.product.findFirst({
            where: {
                id: req.body.id,
                deletion_date: null
            },
            select: {
                id: true,
                label: true,
                is_available: true,
                excl_vat_price: true,
                picture: true,
                event_id: true,
                category: {
                    select: {
                        id: true,
                        label: true,
                        vat: {
                            select: {
                                rate: true
                            }
                        }
                    }
                }
            }
        });

        if (product?.picture) {
            product.picture = `https://imagedelivery.net/${process.env.CF_ACCOUNT_HASH}/${product.picture}/public`;
        }

        if (product) {
            res.status(200).send(product);
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
 *      ProductList:
 *          description: a list of products
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          data:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/Product'
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
export const getAllProducts = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { search, offset, limit } = req.body;

        const sanitizedOffset = offset ?? 0;
        const sanitizedLimit = limit ?? PAGINATION_LIMIT_DEFAULT_SIZE;
        const sanitizedSearch =
            search !== undefined && search !== null ? search.trim() : undefined; // valeur de la recherche ou undefined si pas de recherche. évite " " qui devient 0 via Number() et est considéré comme une recherche numérique

        const orConditions = new Array<Prisma.productWhereInput>();

        if (sanitizedSearch) {
            if (!isNaN(Number(sanitizedSearch))) {
                const parsedNumericSearch = Number(sanitizedSearch);

                orConditions.push(
                    { id: { equals: parsedNumericSearch } },
                    { excl_vat_price: { equals: parsedNumericSearch } },
                    { event_id: { equals: parsedNumericSearch } },
                    { category: { id: { equals: parsedNumericSearch } } }
                );
            } else {
                orConditions.push({
                    label: { contains: sanitizedSearch, mode: "insensitive" }
                });
            }
        }

        const whereClause: Prisma.productWhereInput = {
            deletion_date: null,
            ...(sanitizedSearch && { OR: orConditions })
        };

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where: whereClause,
                skip: sanitizedOffset,
                take: sanitizedLimit,
                select: {
                    id: true,
                    label: true,
                    is_available: true,
                    excl_vat_price: true,
                    picture: true,
                    event_id: true,
                    category: {
                        select: {
                            id: true,
                            vat: {
                                select: {
                                    type: true
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    id: "asc"
                }
            }),
            prisma.product.count({
                where: whereClause
            })
        ]);

        products.forEach((product) => {
            if (product?.picture) {
                product.picture = `https://imagedelivery.net/${process.env.CF_ACCOUNT_HASH}/${product.picture}/public`;
            }
        });

        res.status(200).send({
            data: products,
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
};

// Unavailable products are shown but disabled on the frontend
export const getProductsByEvent = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const products = await prisma.product.findMany({
            where: {
                deletion_date: null,
                event_id: req.body.event_id
            },
            select: {
                id: true,
                label: true,
                is_available: true,
                excl_vat_price: true,
                picture: true,
                category: {
                    select: {
                        id: true,
                        label: true,
                        vat: {
                            select: {
                                type: true,
                                rate: true
                            }
                        }
                    }
                }
            }
        });

        products.forEach((product) => {
            if (product?.picture) {
                product.picture = `https://imagedelivery.net/${process.env.CF_ACCOUNT_HASH}/${product.picture}/public`;
            }
        });

        res.status(200).send(products);
    } catch (e) {
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
};

/**
 * @swagger
 * components:
 *  schemas:
 *      ProductToAdd:
 *          type: object
 *          properties:
 *              label:
 *                  type: string
 *              is_available:
 *                  type: boolean
 *              excl_vat_price:
 *                  type: number
 *              picture:
 *                  type: string
 *                  nullable: true
 *              category_id:
 *                  type: integer
 *              event_id:
 *                  type: integer
 *                  nullable: true
 */

/**
 * @swagger
 * components:
 *  responses:
 *      ProductAdded:
 *          description: the created product id
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          id:
 *                              type: integer
 */
export const createProduct = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const {
            label,
            is_available,
            excl_vat_price,
            picture,
            category_id,
            event_id
        } = req.body;

        const category = await prisma.category.findUnique({
            where: {
                id: category_id
            },
            select: {
                id: true
            }
        });

        if (!category) {
            res.status(404).send("Category not found");
            return;
        }

        const newProductId = await prisma.product.create({
            data: {
                label,
                is_available,
                excl_vat_price,
                picture: picture || null,
                category_id,
                event_id
            },
            select: {
                id: true
            }
        });

        res.status(201).send(newProductId);
    } catch (e) {
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
};

/**
 * @swagger
 * components:
 *  schemas:
 *      ProductToUpdate:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *              label:
 *                  type: string
 *              is_available:
 *                  type: boolean
 *              excl_vat_price:
 *                  type: number
 *              picture:
 *                  type: string
 *                  nullable: true
 *              category_id:
 *                  type: integer
 */
export const updateProduct = async (
    req: Request,
    res: Response
): Promise<void> => {
    const {
        id,
        label,
        is_available,
        excl_vat_price,
        picture,
        category_id
    } = req.body;

    try {
        await prisma.product.update({
            where: {
                id,
                deletion_date: null
            },
            data: {
                label,
                is_available,
                excl_vat_price,
                picture,
                category_id
            }
        });

        res.sendStatus(204);
    } catch (e) {
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
};

/**
 * @swagger
 * components:
 *  schemas:
 *      ProductToDelete:
 *          type: object
 *          properties:
 *              product_id:
 *                  type: integer
 */
export const deleteProduct = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const product = await prisma.product.update({
            where: {
                id: req.body.id
            },
            data: {
                deletion_date: new Date()
            },
            select: {
                picture: true
            }
        });

        if (product.picture) {
            await eraseStoredImage(product.picture);
        }

        res.sendStatus(204);
    } catch (e) {
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
};
