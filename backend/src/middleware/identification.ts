import { Request, Response, NextFunction } from 'express';
import { verify } from '../util/jwt.js';
import { VerifyErrors } from 'jsonwebtoken';
import prisma from "../database/databaseORM";
import { appropriateHttpStatusCode } from '../util/appropriateHttpStatusCode';

/**
 * @swagger
 * components:
 *  securitySchemes:
 *      bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 *  responses:
 *      UnauthorizedError:
 *          description: JWT is missing or invalid
 *          content:
 *              text/plain:
 *                  schema:
 *                      type: string
 */
export const checkJWT = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    const authorizationHeader = req.get('authorization');

    if (authorizationHeader?.includes('Bearer')) {
        try {
            req.session = verify(authorizationHeader.split(' ')[1]);
            next();
        } catch (e) {
            res.status(401).send((e as VerifyErrors).message);
        }
    } else {
        res.status(401).send('No jwt');
    }
};

/**
 * @swagger
 * components:
 *  responses:
 *      AdminOnly:
 *          description: the action must be realized by an admin
 */
export const isAdmin = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    if (!req.session?.isAdmin) {
        res.status(403).send('Admin access required');
        return;
    }
    next();
}

/**
 * @swagger
 * components:
 *  responses:
 *      HostOnly:
 *          description: the action must be realized by the event host
 */
export const isHost = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    if (req.session?.isAdmin) {
        next();
        return;
    }

    const { event_id } = req.body;
    try {
        const membership = await prisma.membership.findFirst({
            where: {
                user_id: req.session.id,
                event_id: event_id,
                role: 'host'
            }
        })
        if (!membership) {
            res.status(403).send('Host access required');
            return;
        }
        next();

    } catch (e) {
        
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
}

/**
 * @swagger
 * components:
 *  responses:
 *      CashierOnly:
 *          description: the action must be realized by a host or cashier
 */
export const isCashier = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    if (req.session?.isAdmin) {
        next();
        return;
    }
    
    const { event_id } = req.body;
    try {
        const membership = await prisma.membership.findFirst({
            where: {
                user_id: req.session.id,
                event_id: event_id,
                role: {
                    in: ['host', 'cashier']
                }
            }
        })
        if (!membership) {
            res.status(403).send('Host or cashier access required');
            return;
        }
        next();

    } catch (e) {
        
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
}

/**
 * @swagger
 * components:
 *  responses:
 *      SelfOnly:
 *          description: the action can only be realized by the authenticated user on their own resources
 */
export const self = (req: Request, res: Response, next: NextFunction) : void => {
    if (!req.body) {
        req.body = {};
    }
    
    req.body.id = req.session.id;
    next();
}
