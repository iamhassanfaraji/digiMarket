const mysql = require("mysql2")

const client = mysql.createPool({
    host: process.env.MYSQL_CONTAINER_NAME,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT,
    multipleStatements: true
})

class Model {

    constructor({ tableName, readQuery }) {
        this.connect = client
        this.tableName = tableName
        this.readQuery = readQuery

        this.read = this.read.bind(this)
        this.readById = this.readById.bind(this)
        this.readWithQuery = this.readWithQuery.bind(this)

        this.queryRunner = this.queryRunner.bind(this)
    }

    queryRunner(SQL, args) {
        return new Promise((resolve, reject) => {
            this.connect.query(SQL, args, (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            })
        })
    }

    readById(query) {
        return this.queryRunner(`SELECT * FROM ${this.tableName} WHERE ?`, [query])
    }

    read(page, limit) {
        return this.queryRunner(`${this.readQuery} LIMIT ? OFFSET ?; SELECT COUNT(*) AS total_pages FROM ${this.tableName}`,
            [limit, (page - 1) * limit])
    }

    readWithQuery(page, limit, query) {
        return this.queryRunner(`${this.readQuery} WHERE ? LIMIT ? OFFSET ?; SELECT COUNT(*) AS total_pages FROM ${this.tableName} WHERE ?`,
            [query, limit, (page - 1) * limit, query])
    }
}

module.exports = Model