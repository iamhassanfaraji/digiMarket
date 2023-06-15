const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')
const joi = require('joi')

const staticsModel = require('../models/statics')
const CoreController = require("./components/coreController")

const staticsSV = (type) => {
    const id = joi.number()
    const dataBase = {
        name: joi.string()
            .max(255),
        category: joi.valid(1, 2),
        dir: joi.string()
            .max(255),
        size: joi.number(),
        alt: joi.string().max(255),
        status: joi.string().valid(0, 1)
    }

    const app = {
        limit: joi.number()
            .required(),
        page: joi.number()
            .required()
    }

    let schema = {}

    switch (type) {
        case 'read':
            schema = joi.object({
                query: joi.object({
                    name: dataBase.name,
                    status: dataBase.status,
                    category: dataBase.category,
                }),
                ...app
            })
            break;
        case 'readById':
            schema = joi.object({
                id: id,
                name: dataBase.name
            }).max(1)
            break;
        case 'deleteById':
            schema = id.required()
            break;
        case 'updateById':
            schema = joi.object({
                id: id.required(),
                values: joi.object(dataBase).min(1).required()
            })
            break;
    }
    return schema
}

class StaticsController extends CoreController {
    constructor({model, inputValidationGenerator}) {
        super({model, inputValidationGenerator})
        this.create = this.create.bind(this)
    }

    create() {
        const requestHandler = this.errorHandler(async (req, res) => {
            const mediaCategory = {
                'video': 1,
                'image': 2
            }

            const MAX_SIZE = 104857600 + 100
            const { files } = req.body
            for (let file in files) {
                const { data } = files[file]
                const { filename, size, mimeType } = files[file].info
                const category = mediaCategory[`${mimeType.split('/')[0]}`]
                const ext = filename.split('.')[1]
                const direction = `upload/${pureName}-${uuidv4()}.${ext}`
                const exist = fs.existsSync(direction)
                const { error, value } = joi.object(staticsSV('create')).validate({
                    category: category,
                    dir: direction,
                    size: size
                })
                if (!exist && size < MAX_SIZE && !error) {
                    fs.appendFileSync(direction, data)
                    const { name, category, dir, size } = value
                    await insert({
                        name: name,
                        media_category_id: category,
                        dir: dir,
                        size: size,
                        alt: name
                    })
                } else if (error) {
                    throw { status: 406, message: error.message }
                } else if (exist) {
                    throw { status: 406, message: 'this file is exist' }
                }
            }
            res.send('uploaded')
        })

        return [
            requestHandler
        ]
    }
}




module.exports = new StaticsController({model:staticsModel, inputValidationGenerator: staticsSV })