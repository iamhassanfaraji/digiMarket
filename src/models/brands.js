const mysql = require('./core-model')
const SqlString = require('sqlstring')

function readOne(query) {
    return new Promise((resolve, reject)=>{
        mysql.query("SELECT * FROM brands WHERE ? LIMIT 1 ", [query], (err, result)=>{
            if(err){
                reject(err)
            }else{
                resolve(result)
            }
        })
    })
}

function readAll(page, limit){
    return new Promise(async (resolve, reject) => {
        const data_query =  SqlString.format(
                "SELECT * FROM brands LIMIT ? OFFSET ?",
                [limit, (page-1)* limit]
            )

        mysql.query(`${data_query}; SELECT COUNT(*) AS total_pages FROM brands`, (err, result)=>{
            if(err){
                reject(err)
            }else{
                resolve(result)
            }
        })
    })
}

function readAllFiltered(page, limit, query) {
    return new Promise(async (resolve, reject) => {

        const data_query =  SqlString.format(
            "SELECT * FROM brands  WHERE ? LIMIT ? OFFSET ?",
             [query, limit, (page-1)* limit]
            )
        const total_pages_query = SqlString.format(
            "SELECT COUNT(*) AS total_pages FROM brands WHERE ?",
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
        mysql.execute(`DELETE FROM brands WHERE brand_id = ${id}`, (err, result)=>{
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
        mysql.execute(SqlString.format('UPDATE brands SET ? WHERE brand_id = ?', [values, id]), (err, result)=>{
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
        mysql.execute(`INSERT INTO brands VALUES(DEFAULT, ${values.name}, ${values.status}, ${values.media_id}, ${values.description})`,
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
    readOne,
    readAll,
    readAllFiltered,
    deleteById,
    updateById,
    insert
}