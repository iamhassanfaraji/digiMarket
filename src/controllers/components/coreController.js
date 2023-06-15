class Controller {
    constructor({model, inputValidationGenerator}) {

        this.model = model
        this.inputValidationGenerator = inputValidationGenerator

        this.errorHandler = this.errorHandler.bind(this)
        this.inputValidation = this.inputValidation.bind(this)


        this.readValidation = inputValidationGenerator("read")
        this.readByIdValidation = inputValidationGenerator("readById")
        this.deleteByIdValidation = inputValidationGenerator("deleteById")
        this.updateByIdValidation = inputValidationGenerator("updateById")

        this.read = this.read.bind(this)
        this.readById = this.readById.bind(this)
        this.updateById = this.updateById.bind(this)
        this.deleteById = this.deleteById.bind(this)
    }

    errorHandler(func) {
        async function f(req, res, next) {
            try {
                await func(req, res, next)
            } catch (err) {
                console.log(err)
                res.status(err.status || 500).json({
                    message: err.message
                })
            }
        }
        return f
    }

    inputValidation(validator) {
        const f = this.errorHandler(function (req, res, next) {
            const { error } = validator.validate(req.body)
            if (error) {
                throw ({ status: 406, message: error.message })
            } else {
                next()
            }
        })
        return f
    }



    read() {
        const requestHandler = this.errorHandler(async (req, res) => {
            const { limit, page, query } = req.body
            if (query) {
                const [data, totalPages] = await this.model.readWithQuery(page, limit, query)
                res.send({ data: data, totalPages: totalPages[0].total_pages })
            } else {
                const [data, totalPages] = await this.model.read(page, limit)
                res.send({ data: data, totalPages: Math.floor((totalPages[0].total_pages) / limit) })
            }
        })

        return [
            this.inputValidation(this.readValidation),
            requestHandler
        ]
    }


    readById() {
        const requestHandler = this.errorHandler(async (req, res) => {
            const result = await this.model.readById(req.body)
            res.send(result)
        })

        return [
            this.inputValidation(this.readByIdValidation),
            requestHandler
        ]
    }


    updateById() {
        const requestHandler = this.errorHandler(async (req, res) => {
            const { id, query } = req.body
            const result = await this.model.updateById(id, query)
            res.send(result)
        })


        return [
            this.inputValidation(this.updateByIdValidation),
            requestHandler
        ]
    }

    deleteById() {
        const requestHandler = this.errorHandler(async (req, res) => {
            const result = await this.model.deleteById(req.body.id)
            res.send(result)
        })

        return [
            this.inputValidation(this.deleteByIdValidation),
            requestHandler
        ]
    }
}

module.exports = Controller