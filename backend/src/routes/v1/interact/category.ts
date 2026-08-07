import { Router } from 'express';

import {
    getCategory,
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from "../../../controller/category";

import { replaceCategoryPicture } from '../../../middleware/image-replacement';
import { isAdmin } from "../../../middleware/identification";
import { categoryVal } from '../../../middleware/validation/validator';

const router = Router();

router.get('/:id', categoryVal.get, getCategory);
router.get('/', categoryVal.getAll, getAllCategories);
router.post('/', isAdmin, categoryVal.create, createCategory);
router.patch('/:id', isAdmin, categoryVal.update, replaceCategoryPicture, updateCategory);
router.delete('/:id', isAdmin, categoryVal.delete, deleteCategory);

export default router;
