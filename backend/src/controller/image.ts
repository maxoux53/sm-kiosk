import { genImgUploadUrl } from "../util/images";
import { Request, Response } from "express";
import { appropriateHttpStatusCode } from "../util/appropriateHttpStatusCode";

export const upload = async (req : Request, res : Response) : Promise<void> => {
    try {
        res.status(201).send(await genImgUploadUrl());
    } catch (e) {
        
        const { code, message } = appropriateHttpStatusCode(e as Error);
        res.status(code).send(message);
    }
}
