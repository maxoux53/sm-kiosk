import vine from '@vinejs/vine'
import * as c from '../../../../shared/constraint.constants';

const id = vine.number();
const first_name = vine.string().minLength(1).maxLength(c.USER.FIRST_NAME_MAX);
const last_name = vine.string().minLength(1).maxLength(c.USER.LAST_NAME_MAX);
const email = vine.string().email().maxLength(c.USER.EMAIL_MAX);
const password = vine.string().minLength(c.USER.PASSWORD_MIN).maxLength(c.USER.PASSWORD_MAX);
const avatar = vine.string().optional();
const is_admin = vine.boolean().optional();

/**
 * @swagger
 * components:
 *  schemas:
 *      UserIdSchema:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *          required:
 *              - id
 */
const userIdSchema = vine.object({
    id
});

const usersSearchSchema = vine.object({
    search: vine.string().optional(),
    offset: vine.number().min(0).max(10000).optional(),
    limit: vine.number().min(1).max(40).optional()
});

/**
 * @swagger
 * components:
 *  schemas:
 *      UserToAdd:
 *          type: object
 *          properties:
 *              first_name:
 *                  type: string
 *              last_name:
 *                  type: string
 *              email:
 *                  type: string
 *              password:
 *                  type: string
 *              avatar:
 *                  type: string
 *              is_admin:
 *                  type: boolean
 *          required:
 *              - first_name
 *              - last_name
 *              - email
 *              - password
 */
const userCreatedSchema = vine.object({
    first_name,
    last_name,
    email,
    password,
    avatar,
    is_admin
});

/**
 * @swagger
 * components:
 *  schemas:
 *      UserToUpdate:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *              first_name:
 *                  type: string
 *              last_name:
 *                  type: string
 *              email:
 *                  type: string
 *              password:
 *                  type: string
 *              avatar:
 *                  type: string
 *          required:
 *              - id
 */
const userUpdatedSchema = vine.object({
    id,
    first_name: first_name.optional(),
    last_name: last_name.optional(),
    email: email.optional(),
    password: password.optional(),
    avatar
});

/**
 * @swagger
 * components:
 *  schemas:
 *      LoginRequest:
 *          type: object
 *          properties:
 *              email:
 *                  type: string
 *              password:
 *                  type: string
 *          required:
 *              - email
 *              - password
 */
const userLoginSchema = vine.object({
    email,
    password
});

export const
    userSearch = vine.create(userIdSchema),
    usersSearch = vine.create(usersSearchSchema),
    userCreation = vine.create(userCreatedSchema),
    userUpdate = vine.create(userUpdatedSchema),
    userDeletion = vine.create(userIdSchema),
    userLogin = vine.create(userLoginSchema)
;
