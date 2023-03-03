const express = require('express');
const transferRouter = express.Router();
const transferController = require('../controllers/transferController');
const authController = require('../controllers/authController');

/**
 * @swagger
 * tags:
 *   name: Transfers
 *   description: The transfer managing API 
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Transfer:
 *       type: object
 *       required:
 *         - sender
 *         - receiver
 *         - time
 *         - amount
 *       properties:
 *         sender:
 *           $ref: '#/components/schemas/User'
 *         receiver:
 *           $ref: '#/components/schemas/User'
 *         time:
 *           type: string
 *           format: date-time
 *         amount:
 *           type: number
 *           minimum: 1
 *         note:
 *           type: string
 *           maxLength: 100
 *     TransferOutput:
 *       type: object
 *       required:
 *         - sender
 *         - receiver
 *         - time
 *         - amount
 *       properties:
 *         sender:
 *           type: string
 *           description: The sender's id
 *         receiver:
 *           type: string
 *           description: The receiver's id
 *         time:
 *           type: string
 *           format: date-time
 *         amount:
 *           type: number
 *           minimum: 1
 *         note:
 *           type: string
 *           maxLength: 100
 *       example:
 *         sender: 63fed905251065a7825e8bfe
 *         receiver: 63fed99b251065a7825e8c07
 *         time: 2021-05-01T00:00:00.000Z
 *         amount: 1000
 *         note: "Thank you"
 */

// /

/**
 * @swagger
 * /api/transfers:
 *   get:
 *     summary: Get all transfers
 *     tags: [Transfers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All transfers were successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  example: success
 *                results:
 *                  type: number
 *                  example: 5
 *                data:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Transfer' 
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/AdminUnauthorizedError'
 *   delete:
 *     summary: Delete all transfers
 *     tags: [Transfers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: All transfers were successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Delete'  
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/AdminUnauthorizedError'
 */

// /:id

/**
 * @swagger
 * /api/transfers/{id}:
 *   get:
 *     summary: Get a transfer based on id
 *     tags: [Transfers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The transfer's id
 *     responses:
 *       200:
 *         description: The transfer was successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Transfer'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/AdminUnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *   delete:
 *     summary: Delete a transfer based on id
 *     tags: [Transfers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The transfer's id
 *     responses:
 *       204:
 *         description: The transfer was successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Delete'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/AdminUnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

transferRouter.use(authController.protect);
transferRouter.use(authController.restrictTo('admin'));

transferRouter.route('/')
.get(transferController.getAllTransfers)
.delete(transferController.deleteAllTransfers);

transferRouter.route('/:id')
.get(transferController.getTransfer)
.delete(transferController.deleteTransfer);

module.exports = transferRouter