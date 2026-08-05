import vine from '@vinejs/vine'
import * as c from '../../../../shared/constraint.constants';

const id = vine.number();
const first_name = vine.string().minLength(1).maxLength(c.USER.FIRST_NAME_MAX);
const last_name = vine.string().minLength(1).maxLength(c.USER.LAST_NAME_MAX);
const email = vine.string().email().maxLength(c.USER.EMAIL_MAX);
const password = vine.string().minLength(c.USER.PASSWORD_MIN).maxLength(c.USER.PASSWORD_MAX);
const avatar = vine.string().optional();
const is_admin = vine.boolean().optional();

const userIdSchema = vine.object({
    id
});

const userCreatedSchema = vine.object({
    first_name,
    last_name,
    email,
    password,
    avatar,
    is_admin
});

const userUpdatedSchema = vine.object({
    id,
    first_name: first_name.optional(),
    last_name: last_name.optional(),
    email: email.optional(),
    password: password.optional(),
    avatar
});

const userLoginSchema = vine.object({
    email,
    password
});

export const
    userSearch = vine.create(userIdSchema),
    userCreation = vine.create(userCreatedSchema),
    userUpdate = vine.create(userUpdatedSchema),
    userDeletion = vine.create(userIdSchema),
    userLogin = vine.create(userLoginSchema)
;
