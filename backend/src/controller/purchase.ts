import prisma from "../database/databaseORM";
import { Request, Response } from "express";
import { Decimal } from "@prisma/client/runtime/library";
import { appropriateHttpStatusCode } from "../util/appropriateHttpStatusCode";

export const getPurchase = async (req: Request, res: Response): Promise<void> => {
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
        
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
};

export const getAllPurchases = async (req : Request, res :Response) : Promise<void> => {
    try {
        const purchases = await prisma.purchase.findMany({}); 
        res.status(200).send(purchases);
    } catch (e) {
        
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
};

export const getPurchasesByUser = async (req : Request, res :Response) : Promise<void> => {
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
                                    label: true,
                                    picture: true,
                                    event: {
                                        select: {
                                            id: true,
                                            name: true
                                        }
                                    },
                                    category:{
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
            purchase.order_line.map((line) => {
                if (line?.product.picture) {
                    line.product.picture = `https://imagedelivery.net/${process.env.CF_ACCOUNT_HASH}/${line.product.picture}/public`;
                }
            })
        })
            
        res.status(200).send(purchases);
    } catch (e) {
        
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
}

export const getPurchasesByEvent = async (req : Request, res :Response) : Promise<void> => {
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
                                    label: true,
                                }
                            }
                        }
                }
            }
        });
            
        res.status(200).send(purchases);
    } catch (e) {
        
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
}

export const createPurchase = async (req: Request, res: Response): Promise<void> => {
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
            await Promise.all(order_lines.map(async (line: {product_id: number, quantity: number}) => {
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
                    throw new Error(`Produit ${line.product_id} introuvable`);
                }

                const totalPrice = ((new Decimal(line.quantity).mul(product.excl_vat_price).mul(new Decimal(1).plus(product.category.vat.rate / 100)))).toDecimalPlaces(2);

                // no await : create all order line in parallel and return the promise
                return tx.order_line.create({
                    data: {
                        product_id: line.product_id,
                        purchase_id: purchase.id,
                        quantity: line.quantity,
                        price: totalPrice
                    }
                });
            }));
        });

        res.sendStatus(201);
    } catch (e) {
        
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
};


export const deletePurchase = async (req: Request, res: Response) : Promise<void> => {
    try {
        await prisma.purchase.delete({
            where: {
                id: req.body.id
            }
        });

        res.sendStatus(204);
    } catch (e) {
        
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
}
