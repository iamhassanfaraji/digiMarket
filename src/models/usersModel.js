const CoreModel = require("./core-model")
const SqlString = require('sqlstring')

const userModel = new CoreModel({
    tableName: "users",
    readQuery: "SELECT * FROM users"
})




module.exports = userModel