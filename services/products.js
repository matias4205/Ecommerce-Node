const produtsMocks = require('../utils/mocks/products');
const MongoLib = require('../lib/mongo');

class ProductService {
    constructor(){
        this.collection = 'products';
        this.mongodb = new MongoLib();
    }

    async getProducts({ tags }) {
        const query = tags && { tags: { $in: tags } };
        const products = await this.mongodb.getAll(this.collection, query);
        return products || [];
    }

    async getProduct({ productId }) {
        const product = await this.mongodb.get(this.collection, productId);
        return product || {};
    }

    async createProduct({ product }) {
        const createProductId = await this.mongodb.create(this.collection, product);
        return createProductId;
    }

    async updateProduct({ productId , product}) {
        const updateProduct = await this.mongodb.update(this.collection, productId, product);
        return updateProduct;
    }

    async deleteProduct({ productId }) {
        const deleteProduct = await this.mongodb.delete(this.collection, productId);
        return deleteProduct;
    }
}

module.exports = ProductService;
