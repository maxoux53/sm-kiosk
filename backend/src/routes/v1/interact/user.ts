import { Router } from 'express';

import {
    getUser,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
} from "../../../controller/user";

import { replaceUserAvatar } from '../../../middleware/image-replacement';
import { isAdmin } from '../../../middleware/identification';
import { userVal } from "../../../middleware/validation/validator"

const router = Router();

router.get('/:id', userVal.get, getUser);
router.get('/', isAdmin, getAllUsers);
router.post('/', userVal.create, createUser);
router.patch('/:id', isAdmin, userVal.update, replaceUserAvatar, updateUser);
router.delete('/:id', isAdmin, userVal.delete, deleteUser);

export default router;
