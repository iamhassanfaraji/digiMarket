const mysql = require('./core-model')
const SqlString = require('sqlstring')

function readById(query) {
    return new Promise((resolve, reject)=>{
        mysql.query("SELECT * FROM products WHERE ?", [query], (err, result)=>{
            if(err){
                reject(err)
            }else{
                resolve(result)
            }
        })
    })
}

function read(page, limit){
    return new Promise(async (resolve, reject) => {
        const data_query =  SqlString.format(
                "SELECT * FROM products LIMIT ? OFFSET ?",
                [limit, (page-1)* limit]
            )

        mysql.query(`${data_query}; SELECT COUNT(*) AS total_pages FROM products`, (err, result)=>{
            if(err){
                reject(err)
            }else{
                resolve(result)
            }
        })
    })
}

function readWithQuery(page, limit, query) {
    return new Promise(async (resolve, reject) => {
        const data_query =  SqlString.format(
            "SELECT * FROM products  WHERE ? LIMIT ? OFFSET ?",
             [query, limit, (page-1)* limit]
            )
        const total_pages_query = SqlString.format(
            "SELECT COUNT(*) AS total_pages FROM products WHERE ?",
             [query]
            )

        mysql.query(`${data_query}; ${total_pages_query}`, (err, result, fields)=>{
            if(err){
                reject(err)
            }else{
                resolve(result)
            }
        })
    })
}

function deleteById(id) {
    return new Promise((resolve, reject)=>{
        mysql.execute(`DELETE FROM products WHERE product_id = ${id}`, (err, result)=>{
            if(err){
                reject(err)
            }else{
                resolve(result)
            }
        })
    })
}

function updateById(id, values) {
    return new Promise((resolve, reject)=>{
        mysql.execute(SqlString.format('UPDATE products SET ? WHERE product_id = ?', [values, id]), (err, result)=>{
            if(err){
                reject(err)
            }else{
                resolve(result)
            }
        })
    })
}

function insert(values) {
    return new Promise((resolve, reject)=>{
        mysql.execute(`INSERT INTO products VALUES(DEFAULT, ${values.name}, ${values.media_id}, ${values.product_category_id}, ${values.brand_id}, ${values.price}, ${values.product_detail_id})`,
             (err, result)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(result)
                }
            })
    })
}

module.exports = {
    readById,
    read,
    readWithQuery,
    deleteById,
    updateById,
    insert
}