const express = require('express');
const ProductService = require('../../services/products');
const passport = require('passport');

const { createProductSchema, productIdSchema, productTagSchema, updateProductSchema } = require('../../utils/schemas/product');
const validation = require('../../utils/middlewares/validationHandler');

// JWT Strategy
require('../../utils/auth/strategies/jwt');

const cacheResponce = require('../../utils/cacheResponse');
const { FIVE_MINUTES_IN_SECONDS, SIXTY_MINUTES_IN_SECONDS } = require('../../utils/time');

function productsApi(app){
    const router = express.Router();
    app.use('/api/products', router);

    const productService = new ProductService();

    router.get('/', async (req, res, next)=>{
        cacheResponce(res, FIVE_MINUTES_IN_SECONDS);   
        const { tags } = req.query;
    
        try {
            const products = await productService.getProducts({ tags });
    
            res.status(200).json({
                data: products,
                message: 'products listed'
            });
        } catch(err){
            next(err);
        }
    });
    
    router.get('/:productId', async (req, res, next)=>{
        cacheResponce(res, SIXTY_MINUTES_IN_SECONDS);  
        const { productId } = req.params;
    
        try{
            const product = await productService.getProduct({ productId });
    
            res.status(200).json({
                data: product,
                message: 'products retrieved'
            });
        } catch(err){
            next(err);
        }
    });
    
    router.post('/', validation( createProductSchema ), async (req, res, next)=>{
        const { body: product } = req;
    
        try{
            const createdProduct = await productService.createProduct({ product });
    
            res.status(201).json({
                data: createdProduct,
                message: 'products created'
            });
        } catch(err){
            next(err);
        }
    });
    
    router.put('/:productId', passport.authenticate('jwt', { session: false }), validation({ productId: productIdSchema }, "params"), validation( updateProductSchema ), async (req, res, next)=>{
        const { productId } = req.params;
        const { body: product} = req
    
        try{
            const updatedProduct = await productService.updateProduct({ productId, product });
    
            res.status(200).json({
                data: updatedProduct,
                message: 'products updated'
            });
        } catch(err){
            next(err);
        }
    });
    
    router.delete('/:productId', passport.authenticate('jwt', { session: false }), async (req, res, next)=>{
        const { productId } = req.params;
    
        try{
            const deletedProduct = await productService.deleteProduct({ productId });
    
            res.status(200).json({
                data: deletedProduct,
                message: 'products deleted'
            });
        } catch(err){
            next(err);
        }
    });
    
}


module.exports = productsApi;