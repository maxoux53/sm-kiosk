import { Request, Response, NextFunction } from "express";
import { eraseStoredImage } from "../util/images";
import prisma from "../database/databaseORM";
import { appropriateHttpStatusCode } from "../util/appropriateHttpStatusCode";

export const replaceEventImage = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    if (req.body.image != undefined) {
        try {
            const event = await prisma.event.findUnique({
                where: {
                    id: req.body.id
                },
                select: {
                    image: true
                }
            });

            if (event?.image != null) {
                await eraseStoredImage(event.image);
            }
        } catch (e) {
            console.error(e);
            const { code, message } = appropriateHttpStatusCode(e as Error);
            res.status(code).send(message);
            return;
        }
    }

    next();
};

export const replaceUserAvatar = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    if (req.body.avatar != undefined) {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: req.body.id
                },
                select: {
                    avatar: true
                }
            });

            if (user?.avatar != null) {
                await eraseStoredImage(user.avatar);
            }
        } catch (e) {
            console.error(e);
            const { code, message } = appropriateHttpStatusCode(e as Error);
            res.status(code).send(message);
            return;
        }
    }

    next();
};

export const replaceProductPicture = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    if (req.body.picture != undefined) {
        try {
            const product = await prisma.product.findUnique({
                where: {
                    id: req.body.id
                },
                select: {
                    picture: true
                }
            });

            if (product?.picture != null) {
                await eraseStoredImage(product.picture);
            }
        } catch (e) {
            console.error(e);
            const { code, message } = appropriateHttpStatusCode(e as Error);
            res.status(code).send(message);
            return;
        }
    }

    next();
};

export const replaceCategoryPicture = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    if (req.body.picture != undefined) {
        try {
            const category = await prisma.category.findUnique({
                where: {
                    id: req.body.id
                },
                select: {
                    picture: true
                }
            });

            if (category?.picture != null) {
                await eraseStoredImage(category.picture);
            }
        } catch (e) {
            console.error(e);
            const { code, message } = appropriateHttpStatusCode(e as Error);
            res.status(code).send(message);
            return;
        }
    }

    next();
};
