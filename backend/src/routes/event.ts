import { Router } from 'express';

import {
    getEvent,
    getAllEvents,
    updateEvent,
    deleteEvent
} from "../controller/event";
import {
    createProduct,
    getProductsByEvent,
    updateProduct,
    deleteProduct
} from '../controller/product';
import {
    getPurchasesByEvent
} from '../controller/purchase';
import { 
    createMembership ,
    deleteCashierFromEvent,
    getAllCashiersByEvent
} from '../controller/membership';

import {
    eventVal, 
    membershipVal, 
    productVal, 
    purchaseVal 
} from '../middleware/validation/validator';

import { replaceEventImage } from '../middleware/image-replacement';

import { 
    isAdmin, 
    isHost, 
    isCashier 
} from "../middleware/identification";

import { replaceProductPicture } from '../middleware/image-replacement';


const router = Router();

router.get('/:event_id', eventVal.get, getEvent);
router.patch('/:event_id', isHost, eventVal.update, replaceEventImage, updateEvent);
router.get('/', isAdmin, getAllEvents);
router.delete('/:event_id', eventVal.delete, isHost, deleteEvent);

router.post('/:event_id/cashier', membershipVal.create, isHost, createMembership);
router.get('/:event_id/cashiers', membershipVal.getCashiersByEvent, isHost, getAllCashiersByEvent);
router.delete('/:event_id/cashier', membershipVal.delete, isHost, deleteCashierFromEvent);

router.get('/:event_id/products', productVal.getByEvent, getProductsByEvent);
router.post('/:event_id/product', productVal.create, isHost, createProduct);
router.post('/:event_id/product', productVal.update, isCashier, replaceProductPicture, updateProduct);
router.post('/:event_id/product', productVal.delete, isHost, deleteProduct);

router.get('/:event_id/purchases', purchaseVal.getByEvent, isCashier, getPurchasesByEvent);

export default router;
