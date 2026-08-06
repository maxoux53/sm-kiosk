import { Router } from 'express';

import {
    getProduct,
    getAllProducts
} from "../../../controller/product";

import { isAdmin } from "../../../middleware/identification";
import { productVal } from '../../../middleware/validation/validator';

const router = Router();

router.get('/:id', productVal.get, getProduct);

router.get('/', isAdmin, productVal.getAll, getAllProducts);

export default router;
