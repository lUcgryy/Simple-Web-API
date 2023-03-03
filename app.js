const express = require('express');
const morgan = require('morgan');
const path = require('path');
const bodyparser = require('body-parser');
const rfs = require('rotating-file-stream');
const cookieParser = require('cookie-parser');
const https = require('https');
const fs = require('fs');
const mongoose = require('mongoose');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const {v4: uuidv4} = require('uuid');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
require('dotenv').config();

const itemRouter = require('./routes/itemRouter');
const vipRouter = require('./routes/vipRouter');
const userRouter = require('./routes/userRouter');
const transferRouter = require('./routes/transferRouter');

const swaggerOptions = {
    definition: {
        openapi: '3.0.3',
        info: {
            title: 'Shopping API',
            version: '1.0.0',
            description: 'A simple Express Shopping API',
        },
        servers: [
            {
                url: "https://localhost:3443"
            }
        ]
    },
    apis: ["./routes/*.js"]
}

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const app = express();
const port = process.env.PORT || 3443;
const accessLogStream = rfs.createStream('access.log', {
	interval: '1d',
	path: path.join(__dirname, 'logs')
});
const httpsOptions = {
	key: fs.readFileSync(__dirname + '/certs/private.key'),
	cert: fs.readFileSync(__dirname + '/certs/certificate.pem'),
};
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('MongoDB Connected');
}).catch(err => {
    console.log(err);
});

// Set up logging
app.use(morgan('combined', { stream: accessLogStream }));

// Set up static files
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

// Set up security HTTP headers
app.use(helmet());

// Limit requests from same API
const limiter = rateLimit({
    max: 150,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(bodyparser.json({ limit: '15kb' }));
app.use(bodyparser.urlencoded({ extended: true}));

// Cookie parser
app.use(cookieParser(uuidv4()));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// Routes

// Hello world
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));
app.use('/api/items', itemRouter);
app.use('/api/vips', vipRouter);
app.use('/api/users', userRouter);
app.use('/api/transfers', transferRouter)

// Handle 404 errors
app.use('*', (req, res, next) => {
    const err = new AppError(404, 'fail', 'Page not found');
    next(err, req, res, next);
});

// Global error handler
app.use(globalErrorHandler);

// Start server
var server = https.createServer(httpsOptions, app);
server.listen(port, () => {
    console.log('Server started on port ' + port);
});