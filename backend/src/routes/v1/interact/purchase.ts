import { Router } from 'express';

import { 
    getPurchase,
    getAllPurchases,
    createPurchase,
    deletePurchase
} from '../../../controller/purchase';

import { purchaseVal } from '../../../middleware/validation/validator';
import { isAdmin } from '../../../middleware/identification';

const router = Router();

router.get('/:id', purchaseVal.get, getPurchase);
router.get('/', isAdmin, purchaseVal.getAll, getAllPurchases);
router.post('/', createPurchase);
router.delete('/:id', purchaseVal.delete, deletePurchase);

export default router;
