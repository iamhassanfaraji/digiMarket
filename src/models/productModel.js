const Model = require("./core-model")
const SqlString = require('sqlstring')

const productModel = new Model({
    tableName: "products",
    readQuery: "SELECT * FROM products"
})


module.exports = productModel