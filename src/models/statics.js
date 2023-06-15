const Model = require('./core-model')
const SqlString = require('sqlstring')

const statics = new Model({
    tableName: "media",
    readQuery: `SELECT m.id, dir, size, status, alt, mc.name AS category FROM media m 
     LEFT JOIN media_categories mc 
     ON m.category = mc.id`
})



module.exports = statics