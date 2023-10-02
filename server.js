const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const port = 3000;
const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'sample',
    connectionLimit: 5
});
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const options = {
    swaggerDefinition: {
        info: {
            title: 'Agents API',
            version: '1.0.0',
            description: 'Agents API written by Aditya Kumar Gupta'
        },
        host: '104.236.196.70:3000',
        basePath: '/',
    },
    apis: ['./server.js'],
}
const specs = swaggerJsdoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

/**
 * @swagger
 * /agents:
 *     get:
 *       description: Return the details of all the agents, from the agents table
 *       produces:
 *          - application/json
 *       responses:
 *          200:
 *              description: Returns the details of all the agents
 */
app.get('/agents', (request, response) => {
    pool.query('SELECT * FROM agents')
        .then(res => {
            response.statusCode = 200;
            response.setHeader('Content-Type', 'Application/json');
            response.send(res);
        })
        .catch(er => {
            response.statusCode = 404;
            console.error('Error occurred while executing GET /agents request', er.stack);
            response.setHeader('Content-Type', 'text/plain');
            response.send('Error occurred while executing GET /agents request' + er.stack);
        });
});

/**
 * @swagger
 * /agents:
 *  put:
 *    description: Update a specific agent's data from the agent table
 *    consumes:
 *    - application/json
 *    produces:
 *    - application/json
 *    parameters:
 *    - in: body
 *      name: agentCode
 *      required: true
 *      schema:
 *        type: string
 *        $ref: "#/definitions/putOperation"
 *    requestBody:
 *      request: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#definitions/putOperation"
 *    responses:
 *      200:
 *       description: Returns a success message
 * definitions:
 *   putOperation:
 *     type: object
 *     required:
 *     - agentCode
 *     - agentName
 *     - workingArea
 *     - commission
 *     - phoneNo
 *     - country
 *     properties:
 *       agentCode:
 *         type: string
 *         example: A022
 *       agentName:
 *         type: string
 *         example: Aditya Gupta
 *       workingArea:
 *         type: string
 *         example: Charlotte
 *       commission:
 *         type: number
 *         example: 0.22
 *       phoneNo:
 *         type: string
 *         example: 9998887776
 *       country:
 *         type: string
 *         example: USA
 */
app.put('/agents', (request, response) => {
    pool.query(`UPDATE sample.agents SET agent_name = '${request['body'].agentName}',  working_area = '${request['body'].workingArea}',
    commission  = '${request['body'].commission}', phone_no = '${request['body'].phoneNo}', country = '${request['body'].country}' WHERE agent_code = '${request['body'].agentCode}'`)
        .then(res => {
            if (res.affectedRows > 0) {
                pool.query(`SELECT * from sample.agents WHERE agent_code = '${request['body'].agentCode}'`).then(res => {
                    response.statusCode = 200;
                    response.setHeader('Content-Type', 'application/json');
                    response.send(res);
                }).catch(er => {
                    response.statusCode = 404;
                    console.error('Error occurred while executing PUT /agents request', er.stack);
                    response.setHeader('Content-Type', 'text/plain');
                    response.send('Error occurred while executing PUT /agents request' + er.stack);
                })
            } else {
                response.statusCode = 201;
                response.setHeader('Content-Type', 'text/plain');
                response.send("The agent data is not present in the database");
            }
        })
        .catch(er => {
            response.statusCode = 404;
            console.error('Error occurred while executing PUT /agents request', er.stack);
            response.setHeader('Content-Type', 'text/plain');
            response.send('Error occurred while executing PUT /agents request' + er.stack);
        });
});

/**
 * @swagger
 * /agents:
 *  post:
 *    description: Adds an agent's data in the agent table
 *    consumes:
 *    - application/json
 *    produces:
 *    - application/json
 *    parameters:
 *    - in: body
 *      name: agentCode
 *      required: true
 *      schema:
 *        type: string
 *        $ref: "#/definitions/postOperation"
 *    requestBody:
 *      request: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#definitions/postOperation"
 *    responses:
 *      200:
 *       description: Returns a success message
 * definitions:
 *   postOperation:
 *     type: object
 *     required:
 *     - agentCode
 *     - agentName
 *     - workingArea
 *     - commission
 *     - phoneNo
 *     - country
 *     properties:
 *       agentCode:
 *         type: string
 *         example: A022
 *       agentName:
 *         type: string
 *         example: Aditya Gupta
 *       workingArea:
 *         type: string
 *         example: Charlotte
 *       commission:
 *         type: number
 *         example: 0.22
 *       phoneNo:
 *         type: string
 *         example: 9998887776
 *       country:
 *         type: string
 *         example: USA
 */

app.post('/agents', (request, response) => {
    pool.query(`INSERT INTO sample.agents values ('${request['body'].agentCode}', '${request['body'].agentName}',
    '${request['body'].workingArea}', '${request['body'].commission}', '${request['body'].phone_no}', '${request['body'].country}')`)
        .then(res => {
            if (res.affectedRows > 0) {
                pool.query(`SELECT * from sample.agents WHERE agent_code = '${request['body'].agentCode}'`).then(res => {
                    response.statusCode = 200;
                    response.setHeader('Content-Type', 'application/json');
                    response.send(res);
                }).catch(er => {
                    response.statusCode = 404;
                    console.error('Error occurred while executing POST /agents request', er.stack);
                    response.setHeader('Content-Type', 'text/plain');
                    response.send('Error occurred while executing POST /agents request' + er.stack);
                })
            } else {
                response.statusCode = 201;
                response.setHeader('Content-Type', 'text/plain');
                response.send('POST call unsuccessful, data not inserted');
            }
        })
        .catch(er => {
            response.statusCode = 404;
            console.error('Error occurred while executing POST /agents request', er.stack);
            response.setHeader('Content-Type', 'text/plain');
            response.send('Error occurred while executing POST /agents request' + er.stack);
        });
});

/**
 * @swagger
 * /agents:
 *  delete:
 *    description: Deletes an agent's data from the agent table
 *    consumes:
 *    - application/json
 *    produces:
 *    - application/json
 *    parameters:
 *    - in: body
 *      name: name
 *      required: true
 *      schema:
 *        type: string
 *        $ref: "#/definitions/deleteOperation"
 *    responses:
 *      200:
 *       description: Returns a success message
 * definitions:
 *   deleteOperation:
 *     type: object
 *     required:
 *     - agentCode
 *     properties:
 *       agentCode:
 *         type: string
 *         example: 'A022'
 */
app.delete('/agents', (request, response) => {
    pool.query(`DELETE FROM sample.agents WHERE agent_Code =  ('${request['body'].agentCode}')`).then(res => {
        if (res.affectedRows > 0) {
            response.statusCode = 200;
            response.setHeader('Content-Type', 'Application/json');
            response.send("Operation Successful, Please send /GET request to validate the changes");
        } else {
            response.statusCode = 201;
            response.setHeader('Content-Type', 'text/plain');
            response.send('DELETE call unsuccessful, data not deleted');
        }
    })
        .catch(er => {
            response.statusCode = 404;
            console.error('Error occurred while executing DELETE /agents request', er.stack);
            response.setHeader('Content-Type', 'text/plain');
            response.send('Error occurred while executing DELETE /agents request' + er.stack);
        });
});

/**
 * @swagger
 * /agents:
 *  patch:
 *    description: Insets or updates an agent's data in the agent table
 *    consumes:
 *    - application/json
 *    produces:
 *    - application/json
 *    parameters:
 *    - in: body
 *      name: agentCode
 *      required: true
 *      schema:
 *        type: string
 *        $ref: "#/definitions/patchOperation"
 *    requestBody:
 *      request: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#definitions/patchOperation"
 *    responses:
 *      200:
 *       description: Returns a success message
 * definitions:
 *   patchOperation:
 *     type: object
 *     required:
 *     - agentCode
 *     - agentName
 *     - workingArea
 *     - commission
 *     - phoneNo
 *     - country
 *     properties:
 *       agentCode:
 *         type: string
 *         example: A022
 *       agentName:
 *         type: string
 *         example: Aditya Gupta
 *       workingArea:
 *         type: string
 *         example: Charlotte
 *       commission:
 *         type: number
 *         example: 0.22
 *       phoneNo:
 *         type: string
 *         example: 9998887776
 *       country:
 *         type: string
 *         example: USA
 */
app.patch('/agents', (request, response) => {
    pool.query(`UPDATE sample.agents SET agent_name = '${request['body'].agentName}',  working_area = '${request['body'].workingArea}',
    commission  = '${request['body'].commission}', phone_no = '${request['body'].phoneNo}',
    country = '${request['body'].country}' WHERE agent_code = '${request['body'].agentCode}'`)
        .then(res => {
            if (res.affectedRows > 0) {
                pool.query(`SELECT * from sample.agents WHERE agent_code = '${request['body'].agentCode}'`).then(res => {
                    response.statusCode = 200;
                    response.setHeader('Content-Type', 'application/json');
                    response.send(res);
                }).catch(er => {
                    response.statusCode = 404;
                    console.error('Error occurred while executing PATCH /agents request', er.stack);
                    response.setHeader('Content-Type', 'text/plain');
                    response.send('Error occurred while executing PATCH /agents request' + er.stack);
                })
            } else {
                pool.query(`insert into sample.agents values('${request['body'].agentCode}', '${request['body'].agentName}',
                '${request['body'].workingArea}', '${request['body'].commission}', '${request['body'].phoneNo}', '${request['body'].country}')`)
                    .then(resp => {
                        if (resp.affectedRows > 0) {
                            pool.query(`SELECT * from sample.agents WHERE agent_code = '${request['body'].agentCode}'`).then(res => {
                                response.statusCode = 200;
                                response.setHeader('Content-Type', 'application/json');
                                response.send(res);
                            }).catch(er => {
                                response.statusCode = 404;
                                console.error('Error occurred while executing PATCH /agents request', er.stack);
                                response.setHeader('Content-Type', 'text/plain');
                                response.send('Error occurred while executing PATCH /agents request' + er.stack);
                            })
                        } else {
                            response.statusCode = 201;
                            response.setHeader('Content-Type', 'text/plain');
                            response.send("PATCH call unsuccessful, data not updated");
                        }
                    })
                    .catch(er => {
                        response.statusCode = 404;
                        console.error('Error occurred while executing PATCH /agents request', er.stack);
                        response.setHeader('Content-Type', 'text/plain');
                        response.send('Error occurred while executing PATCH /agents request' + er.stack);
                    });
            }
        })
        .catch(er => {
            response.statusCode = 404;
            console.error('Error occurred while executing PATCH /agents request', er.stack);
            response.setHeader('Content-Type', 'text/plain');
            response.send('Error occurred while executing PATCH /agents request' + er.stack);
        });
});

app.listen(port, () => {
    console.log(`The application is running at port: ${port}`);
});
