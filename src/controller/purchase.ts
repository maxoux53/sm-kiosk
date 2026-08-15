import prisma from "../database/databaseORM";
import { Prisma } from "../generated/prisma/client";
import { Request, Response } from "express";
import { Decimal } from "../generated/prisma/internal/prismaNamespace";
import { appropriateHttpStatusCode } from "../util/appropriateHttpStatusCode";
import { PAGINATION_LIMIT_DEFAULT_SIZE } from "../constraint-constants";

/**
 * @swagger
 * components:
 *  schemas:
 *      OrderLine:
 *          type: object
 *          properties:
 *              product_id:
 *                  type: integer
 *              purchase_id:
 *                  type: integer
 *              quantity:
 *                  type: integer
 *              price:
 *                  type: number
 */

/**
 * @swagger
 * components:
 *  schemas:
 *      Purchase:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *              date:
 *                  type: string
 *                  format: date-time
 *              user_id:
 *                  type: integer
 *              is_served:
 *                  type: boolean
 *              order_line:
 *                  type: array
 *                  items:
 *                      $ref: '#/components/schemas/OrderLine'
 */

/**
 * @swagger
 * components:
 *  responses:
 *      Purchase:
 *          description: the purchase
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Purchase'
 */
export const getPurchase = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const purchase = await prisma.purchase.findUnique({
            where: {
                id: req.body.id
            }
        });

        if (purchase) {
            res.status(200).send(purchase);
        } else {
            res.sendStatus(404);
        }
    } catch (e) {
        console.error(e);
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
};

/**
 * @swagger
 * components:
 *  responses:
 *      PurchaseList:
 *          description: a list of purchases
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          data:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/Purchase'
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
export const getAllPurchases = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { search, offset, limit } = req.body;

        const sanitizedOffset = offset ?? 0;
        const sanitizedLimit = limit ?? PAGINATION_LIMIT_DEFAULT_SIZE;
        const sanitizedSearch =
            search !== undefined && search !== null ? search.trim() : undefined;

        const orConditions = new Array<Prisma.purchaseWhereInput>();

        if (sanitizedSearch) {
            if (!isNaN(Number(sanitizedSearch))) {
                const parsedNumericSearch = Number(sanitizedSearch);

                orConditions.push(
                    { id: { equals: parsedNumericSearch } },
                    { user_id: { equals: parsedNumericSearch } }
                );
            }
        }

        const whereClause: Prisma.purchaseWhereInput = {
            ...(sanitizedSearch &&
                orConditions.length > 0 && { OR: orConditions })
        };

        const [purchases, total] = await Promise.all([
            prisma.purchase.findMany({
                where: whereClause,
                skip: sanitizedOffset,
                take: sanitizedLimit,
                orderBy: {
                    id: "asc"
                }
            }),
            prisma.purchase.count({
                where: whereClause
            })
        ]);

        res.status(200).send({
            data: purchases,
            pagination: {
                total,
                offset: sanitizedOffset,
                limit: sanitizedLimit
            }
        });
    } catch (e) {
        console.error(e);
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
};

export const getPurchasesByUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const purchases = await prisma.purchase.findMany({
            where: {
                user_id: req.session.id
            },
            select: {
                id: true,
                date: true,
                order_line: {
                    select: {
                        product_id: true,
                        quantity: true,
                        price: true,
                        product: {
                            select: {
                                id: true,
                                label: true,
                                picture: true,
                                event: {
                                    select: {
                                        id: true,
                                        name: true
                                    }
                                },
                                category: {
                                    select: {
                                        id: true,
                                        label: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        purchases.map((purchase) => {
            purchase.order_line.map((line) => {
                if (line?.product.picture) {
                    line.product.picture = `https://imagedelivery.net/${process.env.CF_ACCOUNT_HASH}/${line.product.picture}/public`;
                }
            });
        });

        res.status(200).send(purchases);
    } catch (e) {
        console.error(e);
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
};

export const getPurchasesByEvent = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const purchases = await prisma.purchase.findMany({
            where: {
                is_served: false,
                order_line: {
                    some: {
                        product: {
                            event_id: req.body.event_id
                        }
                    }
                }
            },
            select: {
                id: true,
                date: true,
                user_id: true,
                order_line: {
                    select: {
                        quantity: true,
                        price: true,
                        product: {
                            select: {
                                label: true
                            }
                        }
                    }
                }
            }
        });

        res.status(200).send(purchases);
    } catch (e) {
        console.error(e);
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
};

/**
 * @swagger
 * components:
 *  schemas:
 *      PurchaseToAdd:
 *          type: object
 *          properties:
 *              order_lines:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          product_id:
 *                              type: integer
 *                          quantity:
 *                              type: integer
 */

/**
 * @swagger
 * components:
 *  responses:
 *      PurchaseAdded:
 *          description: the purchase has been created
 */
export const createPurchase = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { order_lines } = req.body;

    try {
        // tx = Prisma client for transactions, every tx operations are in tranasaction
        await prisma.$transaction(async (tx) => {
            const purchase = await tx.purchase.create({
                data: {
                    user_id: req.session.id,
                    date: new Date()
                }
            });

            // Promise.all = garantee that all order lines are created (wait for all promises))
            await Promise.all(
                order_lines.map(
                    async (line: { product_id: number; quantity: number }) => {
                        const product = await tx.product.findFirst({
                            where: {
                                id: line.product_id,
                                deletion_date: null
                            },
                            select: {
                                excl_vat_price: true,
                                category: {
                                    select: {
                                        vat: {
                                            select: {
                                                rate: true
                                            }
                                        }
                                    }
                                }
                            }
                        });

                        if (!product) {
                            // If product not found, throw error to rollback the transaction
                            throw new Error(
                                `Produit ${line.product_id} introuvable`
                            );
                        }

                        const totalPrice = new Decimal(line.quantity)
                            .mul(product.excl_vat_price)
                            .mul(
                                new Decimal(1).plus(
                                    product.category.vat.rate / 100
                                )
                            )
                            .toDecimalPlaces(2);

                        // no await : create all order line in parallel and return the promise
                        return tx.order_line.create({
                            data: {
                                product_id: line.product_id,
                                purchase_id: purchase.id,
                                quantity: line.quantity,
                                price: totalPrice
                            }
                        });
                    }
                )
            );
        });

        res.sendStatus(201);
    } catch (e) {
        console.error(e);
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
};

export const deletePurchase = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        await prisma.purchase.delete({
            where: {
                id: req.body.id
            }
        });

        res.sendStatus(204);
    } catch (e) {
        console.error(e);
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
};
