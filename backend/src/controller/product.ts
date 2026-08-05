import prisma from "../database/databaseORM";
import { Request, Response } from "express";
import { appropriateHttpStatusCode } from "../util/appropriateHttpStatusCode";

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         label:
 *           type: string
 *         is_available:
 *           type: boolean
 *         excl_vat_price:
 *           type: number
 *         deletion_date:
 *           type: string
 *           format: date-time
 *         category_id:
 *           type: integer
 *         event_id:
 *           type: integer
*/



/**
 * @swagger
 * components:
 *   responses:
 *     getProduct:
 *       description: The product
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
*/
export const getProduct = async (req : Request, res : Response) : Promise<void> => {
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
                        vat:{
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

export const getAllProducts = async (req : Request, res : Response) : Promise<void> => {
    try {
        const products = await prisma.product.findMany({
            where: {
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
                        vat: {
                            select: {
                                type: true,
                            }
                        }
                    }
                }
            }
        });

        products.map((product) => {
            if (product?.picture) {
                product.picture = `https://imagedelivery.net/${process.env.CF_ACCOUNT_HASH}/${product.picture}/public`;
            }
        })

        res.status(200).send(products);
    } catch (e) {
        
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
};

// Unavailable products are shown but disabled on the frontend
export const getProductsByEvent = async (req : Request, res : Response) : Promise<void> => {
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
                        vat:{
                            select: {
                                type: true,
                                rate: true
                            }
                        }
                    }
                }
            }
        });

        products.map((product) => {
            if (product?.picture) {
                product.picture = `https://imagedelivery.net/${process.env.CF_ACCOUNT_HASH}/${product.picture}/public`;
            }
        })

        res.status(200).send(products);
    } catch (e) {
        
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
};

/**
 * @swagger
 * components:
 *   responses:
 *     ProductAdded:
 *       description: The product
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
*/
export const createProduct = async (req : Request, res : Response) : Promise<void> => {
    try {
        const { label, is_available, excl_vat_price, picture, category_id, event_id } = req.body;

        const category = await prisma.category.findUnique({
            where: {
                id: category_id
            },
            select: {
                picture: true
            }
        });

        if (!category) {
            res.status(404).send("Category not found");
            return;
        }
        
        const productPicture = picture || category.picture;
        
        const newProductId = await prisma.product.create({
            data: {
                label,
                is_available,
                excl_vat_price,
                picture: productPicture,
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

export const updateProduct = async (req : Request, res : Response) : Promise<void> => {
    const { product_id, label, is_available, excl_vat_price, deletion_date, picture, category_id } = req.body;
    
    try {
        await prisma.product.update({
            where: {
                id: product_id,
                deletion_date: null
            },
            data: {
                label,
                is_available,
                excl_vat_price,
                deletion_date,
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

export const deleteProduct = async (req : Request, res : Response) : Promise<void> => {
    try {
        await prisma.product.update({
            where: {
                id: req.body.product_id
            },
            data: {
                deletion_date: new Date()
            }
        });

        res.sendStatus(204);
    } catch (e) {
        
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }  
};