import { ValidationError } from "@vinejs/vine";
import { Request, Response, NextFunction } from "express";
import * as categorySchemas from "./category";
import * as productSchemas from "./product";
import * as eventSchemas from "./event";
import * as membershipSchemas from "./membership";
import * as purchaseSchemas from "./purchase";
import * as userSchemas from "./user";
import * as vatSchemas from "./vat";

export const categoryVal = {
    get: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = await categorySchemas.categorySearch.validate(
                req.params
            );
            next();
        } catch (e) {
            console.error(e);
            res.status(400).send((e as ValidationError).message);
        }
    },
    getAll: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = await categorySchemas.categoriesSearch.validate(
                req.query
            );
            next();
        } catch (e) {
            console.error(e);
            res.status(400).send((e as ValidationError).message);
        }
    },
    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = await categorySchemas.categoryCreation.validate(
                req.body
            );
            next();
        } catch (e) {
            console.error(e);
            res.status(400).send((e as ValidationError).message);
        }
    },
    update: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body.id = req.params.id;
            req.body = await categorySchemas.categoryUpdate.validate(req.body);
            next();
        } catch (e) {
            console.error(e);
            res.status(400).send((e as ValidationError).message);
        }
    },
    delete: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = await categorySchemas.categoryDeletion.validate(
                req.params
            );
            next();
        } catch (e) {
            console.error(e);
            res.status(400).send((e as ValidationError).message);
        }
    },
    getByEvent: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = await categorySchemas.categoriesByEvent.validate(
                req.params
            );
            next();
        } catch (e) {
            console.error(e);
            res.status(400).send((e as ValidationError).message);
        }
    }
};

export const productVal = {
    get: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = await productSchemas.productSearch.validate(req.params);
            next();
        } catch (e) {
            console.error(e);
            res.status(400).send((e as ValidationError).message);
        }
    },
    getAll: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = await productSchemas.productsSearch.validate(req.query);
            next();
        } catch (e) {
            console.error(e);
            res.status(400).send((e as ValidationError).message);
        }
    },
    getByEvent: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = await productSchemas.productsByEvent.validate(
                req.params
            );
            next();
        } catch (e) {
            console.error(e);
            res.status(400).send((e as ValidationError).message);
        }
    },
    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = await productSchemas.productCreation.validate(req.body);
            next();
        } catch (e) {
            console.error(e);
            res.status(400).send((e as ValidationError).message);
        }
    },
    update: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body.id = req.params.id;
            req.body = await productSchemas.productUpdate.validate(req.body);
            next();
        } catch (e) {
            console.error(e);
            res.status(400).send((e as ValidationError).message);
        }
    },
    delete: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = await productSchemas.productDeletion.validate(
                req.params
            );
            next();
        } catch (e) {
            console.error(e);
            res.status(400).send((e as ValidationError).message);
        }
    }
};

export const eventVal = {
    get: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = await eventSchemas.eventSearch.validate(req.params);
            next();
        } catch (e) {
            console.error(e);
            res.status(400).send((e as ValidationError).message);
        }
    },
    getAll: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = await eventSchemas.eventsSearch.validate(req.query);
            next();
        } catch (e) {
            console.error(e);
            res.status(400).send((e as ValidationError).message);
        }
    },
    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = await eventSchemas.eventCreation.validate(req.body);
            next();
        } catch (e) {
            console.error(e);
            res.status(400).send((e as ValidationError).message);
        }
    },
    update: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body.id = req.params.event_id;
            req.body = await eventSchemas.eventUpdate.validate(req.body);
            next();
        } catch (e) {
            console.error(e);
            res.status(400).send((e as ValidationError).message);
        }
    },
    delete: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = await eventSchemas.eventDeletion.validate(req.params);
            next();
        } catch (e) {
            console.error(e);
            res.status(400).send((e as ValidationError).message);
        }
    }
};

export const membershipVal = {
    join: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body.event_id = req.params.event_id;
            req.body = await membershipSchemas.eventJoin.validate(req.body);
            next();
        } catch (e) {
            console.error(e);
            res.status(400).send((e as ValidationError).message);
        }
    },
    getCashiersByEvent: async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            req.body = await membershipSchemas.cashiersByEvent.validate(
                req.params
            );
            next();
        } catch (e) {
            console.error(e);
            res.status(400).send((e as ValidationError).message);
        }
    },
    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body.event_id = req.params.event_id;
            req.body = await membershipSchemas.membershipCreation.validate(
                req.body
            );
            next();
        } catch (e) {
            console.error(e);
            res.status(400).send((e as ValidationError).message);
        }
    },
    delete: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body.event_id = req.params.event_id;
            req.body = await membershipSchemas.membershipDeletion.validate(
                req.body
            );
            next();
        } catch (e) {
            console.error(e);
            res.status(400).send((e as ValidationError).message);
        }
    }
};

export const purchaseVal = {
    get: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = await purchaseSchemas.purchaseSearch.validate(
                req.params
            );
            next();
        } catch (e) {
            console.error(e);
            res.status(400).send((e as ValidationError).message);
        }
    },
    getAll: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = await purchaseSchemas.purchasesSearch.validate(
                req.query
            );
            next();
        } catch (e) {
            console.error(e);
            res.status(400).send((e as ValidationError).message);
        }
    },
    getByEvent: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = await purchaseSchemas.purchasesByEvent.validate(
                req.params
            );
            next();
        } catch (e) {
            console.error(e);
            res.status(400).send((e as ValidationError).message);
        }
    },
    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = await purchaseSchemas.purchaseCreation.validate(
                req.body
            );
            next();
        } catch (e) {
            console.error(e);
            res.status(400).send((e as ValidationError).message);
        }
    },
    delete: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = await purchaseSchemas.purchaseDeletion.validate(
                req.params
            );
            next();
        } catch (e) {
            console.error(e);
            res.status(400).send((e as ValidationError).message);
        }
    }
};

export const userVal = {
    get: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = await userSchemas.userSearch.validate(req.params);
            next();
        } catch (e) {
            console.error(e);
            res.status(400).send((e as ValidationError).message);
        }
    },
    getAll: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = await userSchemas.usersSearch.validate(req.query);
            next();
        } catch (e) {
            console.error(e);
            res.status(400).send((e as ValidationError).message);
        }
    },
    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = await userSchemas.userCreation.validate(req.body);
            next();
        } catch (e) {
            console.error(e);
            res.status(400).send((e as ValidationError).message);
        }
    },
    update: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body.id = req.params.id;
            req.body = await userSchemas.userUpdate.validate(req.body);
            next();
        } catch (e) {
            console.error(e);
            res.status(400).send((e as ValidationError).message);
        }
    },
    delete: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = await userSchemas.userDeletion.validate(req.params);
            next();
        } catch (e) {
            console.error(e);
            res.status(400).send((e as ValidationError).message);
        }
    },
    login: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = await userSchemas.userLogin.validate(req.body);
            next();
        } catch (e) {
            console.error(e);
            res.status(400).send((e as ValidationError).message);
        }
    },
    signup: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = await userSchemas.userSignup.validate(req.body);
            next();
        } catch (e) {
            console.error(e);
            res.status(400).send((e as ValidationError).message);
        }
    }
};

export const vatVal = {
    getAll: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = await vatSchemas.vatsSearch.validate(req.query);
            next();
        } catch (e) {
            console.error(e);
            res.status(400).send((e as ValidationError).message);
        }
    },
    get: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = await vatSchemas.vatSearch.validate(req.params);
            next();
        } catch (e) {
            console.error(e);
            res.status(400).send((e as ValidationError).message);
        }
    },
    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = await vatSchemas.vatCreation.validate(req.body);
            next();
        } catch (e) {
            console.error(e);
            res.status(400).send((e as ValidationError).message);
        }
    },
    update: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body.type = req.params.type;
            req.body = await vatSchemas.vatUpdate.validate(req.body);
            next();
        } catch (e) {
            console.error(e);
            res.status(400).send((e as ValidationError).message);
        }
    },
    delete: async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = await vatSchemas.vatDeletion.validate(req.params);
            next();
        } catch (e) {
            console.error(e);
            res.status(400).send((e as ValidationError).message);
        }
    }
};
