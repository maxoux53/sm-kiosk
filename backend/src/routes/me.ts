import { Router } from 'express';

import {
    getUser,
    updateUser,
    deleteUser
} from '../controller/user';
import {
    getPurchasesByUser,
    createPurchase
} from '../controller/purchase';
import { 
    getEventsByUser,
    createEvent 
} from '../controller/event';
import {
    joinEvent,
    deleteMembership
} from '../controller/membership';

import { replaceUserAvatar } from '../middleware/image-replacement';
import { purchaseVal, userVal } from '../middleware/validation/validator';
import { eventVal } from '../middleware/validation/validator';
import { membershipVal } from '../middleware/validation/validator';

const router = Router();

router.get('/', getUser);
router.patch('/', userVal.update, replaceUserAvatar, updateUser);
router.delete('/', deleteUser);

router.post('/event', eventVal.create, createEvent);
router.get('/events', getEventsByUser);


router.get('/purchases', getPurchasesByUser);
router.post('/purchase', purchaseVal.create, createPurchase);

router.post('/event/:event_id', membershipVal.join, joinEvent);
router.delete('/event/:event_id', membershipVal.delete, deleteMembership);

export default router;
