import vine from "@vinejs/vine";

const user_id = vine.number();
const event_id = vine.number();
const user_email = vine.string().email();

/**
 * @swagger
 * components:
 *  schemas:
 *      MembershipIdSchema:
 *          type: object
 *          properties:
 *              user_id:
 *                  type: integer
 *              event_id:
 *                  type: integer
 *          required:
 *              - user_id
 *              - event_id
 */
const membershipIdSchema = vine.object({
    user_id,
    event_id
});

/**
 * @swagger
 * components:
 *  schemas:
 *      MembershipToAdd:
 *          type: object
 *          properties:
 *              user_email:
 *                  type: string
 *              event_id:
 *                  type: integer
 *          required:
 *              - user_email
 *              - event_id
 */
const membershipCreationSchema = vine.object({
    user_email,
    event_id
});

/**
 * @swagger
 * components:
 *  schemas:
 *      EventIdOnlySchema:
 *          type: object
 *          properties:
 *              event_id:
 *                  type: integer
 *          required:
 *              - event_id
 */
const evendIdSchema = vine.object({
    event_id
});

export const membershipSearch = vine.create(membershipIdSchema),
    membershipCreation = vine.create(membershipCreationSchema),
    eventJoin = vine.create(evendIdSchema),
    membershipDeletion = vine.create(evendIdSchema),
    cashiersByEvent = vine.create(evendIdSchema);
