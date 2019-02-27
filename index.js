const express =  require('express');
const path = require('path');
const boom = require('boom');
const helmet = require('helmet');

const productsRouter = require('./router/views/products');
const productsApiRouter = require('./router/api/products');
const authApiRouter = require('./router/api/auth');

const { clientErrorHandler, logErrors, errorHandler, wrapErrors } = require('./utils/middlewares/errorHandlers')
const isRequestAjaxOrApi = require('./utils/isRequestAjaxOrApi');

// app
const app = express();

//middlewares global
app.use(helmet())
app.use(express.json());

// static files
app.use('/static', express.static(path.join(__dirname, "public")));


// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");


// routes
app.use('/products', productsRouter);
productsApiRouter(app);
app.use('/api/auth', authApiRouter);

// redirect desde el home a los productos
app.get('/', (req, res)=>{
    res.redirect('/products');
});

app.use((req, res, next) => {
    if (isRequestAjaxOrApi(req)) {
        const {
            output: { statusCode, payload }
        } = boom.notFound();

        res.status(statusCode).json(payload);
    }else{
        res.status(404).render('404');
    }
});

// Error Handlers
app.use(logErrors);
app.use(wrapErrors);
app.use(clientErrorHandler);
app.use(errorHandler);


const server = app.listen(process.env.PORT || 5000, () => {
    console.log('Server is setup and listening at -> http://localhost:' + server.address().port);
});