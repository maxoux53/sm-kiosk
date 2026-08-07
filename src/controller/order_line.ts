import prisma from "../database/databaseORM";
import { Request, Response } from "express";
import { appropriateHttpStatusCode } from "../util/appropriateHttpStatusCode";

export const getOrderLine = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { product_id, purchase_id } = req.body;

    try {
        const order_line = await prisma.order_line.findUnique({
            where: {
                product_id_purchase_id: {
                    // Prisma Composite Key
                    product_id,
                    purchase_id
                }
            }
        });

        if (order_line) {
            res.status(200).send(order_line);
        } else {
            res.sendStatus(404);
        }
    } catch (e) {
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
};
