const express = require('express');
const itemRouter = express.Router();
const itemController = require('../controllers/itemController');
const authController = require('./../controllers/authController');
//Global component in swagger
/**
 * @swagger
 * components:
 *  schemas:
 *    Error:
 *     type: object
 *     properties:
 *          status:
 *              type: string
 *              description: The status of the error
 *          error:
 *              type: object
 *              properties:
 *                  statusCode:
 *                      type: integer
 *                      description: The http status code of the error
 *                  status:
 *                      type: string
 *                      description: The status
 *              description: The error object containing the status code and the status
 *          message:
 *              type: string
 *              description: The message of the error
 *          stack:
 *              type: string
 *              description: The stack trace of the error
 *    Delete:
 *      type: object
 *      properties:
 *        status:
 *          type: string
 *          description: The status of the delete
 *        data:
 *          type: string
 *          nullable: true
 *          description: The data of the response
 *          example: null
 * 
 *  securitySchemes:
 *     bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 *  responses:
 *     UnauthorizedError:
 *      description: Access token is missing or invalid
 *      content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Error'
 *     AdminUnauthorizedError:
 *      description: You are not authorized to perform this action
 *      content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Error'
 *     BadRequestError:
 *      description: Bad request
 *      content:
 *         application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 *     NotFoundError:
 *      description: No document found with that ID
 *      content:
 *          application/json:
 *            schema:
 *             $ref: '#/components/schemas/Error'
 *     LoginError:
 *      description: Incorrect username or password
 *      content:
 *          application/json:
 *            schema:
 *             $ref: '#/components/schemas/Error'
 *     InformationError:
 *      description: The information is not provided
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Error'
 *     ValidationError:
 *      description: The information is not valid
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * components:
 *  schemas:
 *     Item:
 *      type: object
 *      required:
 *          - _id
 *          - name
 *          - description
 *          - price
 *          - amount
 *          - __v
 *      properties:
 *          _id:
 *              type: string
 *              description: The auto-generated id of the item
 *          name:
 *              type: string
 *              description: The name of the item
 *          description:
 *              type: string
 *              description: The description of the item
 *          price:
 *              type: number
 *              description: The price of the item
 *          amount:
 *              type: integer
 *              description: The amount of the item which is available to buy
 *          __v:
 *              type: integer
 *              description: The version key of the item that is auto generated by MongoDB
 *      example:
 *          _id: 63fdd1a9d8620449707ef599
 *          name: "Táo"
 *          description: "Táo Mỹ"
 *          price: 200
 *          amount: 5
 *          __v: 0
 * 
 */

/**
 * @swagger
 * tags:
 *  name: Items
 *  description: The item managing API
 */

/**
 * @swagger
 * /api/items:
 *  get:
 *      summary: Returns the list of all the items
 *      tags: [Items]
 *      security: []
 *      responses:
 *          200:
 *              description: The list of the items
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                            status:                    
 *                              type: string
 *                              description: The status of the response
 *                              example: success
 *                            results:
 *                              type: integer
 *                              description: The number of items             
 *                            data:
 *                              type: array
 *                              description: The data of the created items
 *                              items:          
 *                                $ref: '#/components/schemas/Item'
 *          
 *  post:
 *     summary: Create a list of new items
 *     tags: [Items]
 *     security:
 *         - bearerAuth: []
 *     requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                                  description: The name of the item
 *                              description:
 *                                  type: string
 *                                  description: The description of the item
 *                              price:
 *                                  type: number
 *                                  description: The price of the item
 *                              amount:
 *                                  type: integer
 *                                  description: The amount of the item which is available to buy
 *                  example:
 *                      - name: "Táo"
 *                        description: "Táo Mỹ"
 *                        price: 200
 *                        amount: 5
 *                      - name: "Chuối"
 *                        description: "Non"
 *                        price: 200
 *                        amount: 6
 *                                        
 *     responses:
 *      201:
 *        description: The item was successfully created
 *        content:
 *         application/json:
 *          schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  description: The status of the response
 *                  example: success
 *                  required: true
 *                  enum: [success]
 *                  default: success
 *                data:
 *                  type: array
 *                  description: The data of the created items
 *                  items:          
 *                    $ref: '#/components/schemas/Item'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        $ref: '#/components/responses/AdminUnauthorizedError'
 *      400:
 *        $ref: '#/components/responses/BadRequestError'
 *      500:
 *        $ref: '#/components/responses/ValidationError'
 *  delete:
 *   summary: Delete all items
 *   tags: [Items]
 *   security:
 *     - bearerAuth: []
 *   responses:
 *     200:
 *       description: The items were successfully deleted
 *       content:
 *         application/json:
 *           schema:
 *            $ref: '#/components/schemas/Delete'
 *     403:                      
 *       $ref: '#/components/responses/AdminUnauthorizedError'  
 *     401:
 *       $ref: '#/components/responses/UnauthorizedError'         
 */

/**
 * @swagger
 * /api/items/{id}:
 *  get:
 *    summary: Get the item by id
 *    tags: [Items]
 *    security: []
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The item id
 *    responses:
 *      200:
 *        description: The item description by id
 *        content:
 *          application/json:
 *            schema:
 *                type: object
 *                properties: 
 *                  status:
 *                    type: string
 *                    description: The status of the response
 *                    example: success
 *                    required: true
 *                    enum: [success]
 *                    default: success
 *                  data:     
 *                    $ref: '#/components/schemas/Item'
 *      404:
 *        $ref: '#/components/responses/NotFoundError'
 *  put:
 *   summary: Update the item by the id in the request
 *   tags: [Items]
 *   security:
 *     - bearerAuth: []
 *   parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The item id
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               description: The name of the item
 *             description:
 *               type: string
 *               description: The description of the item
 *             price:
 *               type: number
 *               description: The price of the item
 *             amount:
 *               type: integer
 *               description: The amount of the item which is available to buy
 *         example:
 *           name: "Táo"
 *           description: "Táo Mỹ"
 *           price: 300
 *           amount: 5
 *   responses:
 *     200:
 *       description: The item was updated successfully.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: The status of the response
 *               data:
 *                 $ref: '#/components/schemas/Item'
 *     400:
 *       $ref: '#/components/responses/BadRequestError'
 *     403:
 *       $ref: '#/components/responses/AdminUnauthorizedError'
 *     404:
 *       $ref: '#/components/responses/NotFoundError'
 *     401:
 *       $ref: '#/components/responses/UnauthorizedError'
 *     500:
 *       $ref: '#/components/responses/ValidationError'  
 *  delete:
 *    summary: Delete the item with the specified id in the request
 *    tags: [Items]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The item id
 *    responses:
 *      200:
 *        description: The items were successfully deleted
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Delete'
 *      403:                      
 *        $ref: '#/components/responses/AdminUnauthorizedError'   
 *      404:
 *       $ref: '#/components/responses/NotFoundError'
 *      401:
 *       $ref: '#/components/responses/UnauthorizedError'
 */
// Unauthenticated routes
itemRouter.route('/').get(itemController.getAllItems);
itemRouter.route('/:id').get(itemController.getItem);

// Admin routes
itemRouter.use(authController.protect);
itemRouter.use(authController.restrictTo('admin'));

itemRouter.route('/')
.post(itemController.createItem)
.delete(itemController.deleteAllItems);

itemRouter.route('/:id')
.put(itemController.updateItem)
.delete(itemController.deleteItem);

module.exports = itemRouter;