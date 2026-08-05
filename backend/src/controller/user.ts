import prisma from "../database/databaseORM";
import { Request, Response } from "express";
import { hash, compare} from "../util/hash";
import { sign } from "../util/jwt";
import { eraseStoredImage } from '../util/images';
import { appropriateHttpStatusCode } from "../util/appropriateHttpStatusCode";

export const login = async (req: Request, res: Response) : Promise<void> => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: {
                email
            },
            select: {
                id: true,
                password_hash: true,
                is_admin: true
            }
        });

        if (user && (await compare(password, user.password_hash))) {
            res.status(200).send({
                token: sign(
                    { id: user.id, isAdmin: user.is_admin },
                    { expiresIn: '8h' }
                ),
                user: {id: user.id, is_admin: user.is_admin}
            });
        } else {
            res.sendStatus(401);
        }
    } catch (e) {
        
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                id: req.body.id,
                deletion_date: null
            },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                avatar: true,
                is_admin: true
            }
        });

        if (user) {
            if (user.avatar) {
                user.avatar = `https://imagedelivery.net/${process.env.CF_ACCOUNT_HASH}/${user.avatar}/public`;
            }

            res.status(200).send(user);
        } else {
            res.sendStatus(404);
        }
    } catch (e) {
        
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
};

export const getAllUsers = async (req: Request, res: Response) : Promise<void> => {
    try {
        const users = await prisma.user.findMany({
            where: {
                deletion_date: null
            },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                avatar: true
            }
        });

        for (const iUser in users) {
            if (users[iUser].avatar) {
                users[iUser].avatar = `https://imagedelivery.net/${process.env.CF_ACCOUNT_HASH}/${users[iUser].avatar}/public`;
            }
        }
        
        res.status(200).send(users);
    } catch (e) {
        
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
};

export const createUser = async (req: Request, res: Response) : Promise<void> => {
    const { first_name, last_name, email, password, is_admin, avatar } = req.body;
    
    try {
        const newUser = await prisma.user.create({
            data: {
                first_name,
                last_name,
                email,
                password_hash: await hash(password),
                is_admin,
                avatar
            },
            select: {
                id: true
            }
        });

        res.status(201).send(newUser);
    } catch (e) {
        
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
};

export const deleteUser = async (req: Request, res: Response) : Promise<void> => {
    try {
        const user = await prisma.user.update({
            where: {
                id: req.body.id,
                deletion_date: null
            },
            data: {
                deletion_date: new Date()
            },
            select: {
                avatar: true
            }
        });

        if (user.avatar) {
            await eraseStoredImage(user.avatar);
        }

        res.sendStatus(204);
    } catch (e) {
        
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
};

export const updateUser = async (req: Request, res: Response) : Promise<void> => {
    const { id, first_name, last_name, email, avatar } = req.body;
    const password_hash = (req.body.password ? await hash(req.body.password) : undefined);
    
    try {
        await prisma.user.update({
            where: {
                id: id
            },
            data: {
                first_name,
                last_name,
                email,
                password_hash,
                avatar
            },
        });

        res.sendStatus(204);
    } catch (e) {
        
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
};
