const joi = require('joi')

const productsModel = require('../models/productModel')
const productPatternModel = require("../models/productDetailPatterns")
const productCategoriesModel = require("../models/productCategories")

const CoreController = require("./components/coreController")

const productSV = (type) => {
    const id = joi.number()

    const dataBase = {

        name: joi.string()
            .replace(/\s/, '')
            .min(6)
            .max(255)
            .normalize(),

        price: joi.number()
            .min(1000),

        discount: joi.string()
            .regex(/(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?$)/)
            .error(new Error("should be percent number")),

        colors: joi.array()
            .items(
                joi.string()
                    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
                    .error(new Error("should be Hexadecimal Color Code"))
            ),
        category_id: joi.number(),
        description: joi.string(),
        product_images: joi.array().items(
            joi.number()
        ),
        product_details: joi.array().items(
            joi.number()
        )
    }

    const app = {
        limit: joi.number().required(),
        page: joi.number().required()
    }

    let schema = {}
    switch (type) {
        case "create":
            schema = joi.object({
                name: dataBase.name.required(),
                price: dataBase.price.required(),
                discount: dataBase.discount.required(),
                colors: dataBase.colors.required(),
                category_id: dataBase.category_id.required(),
                product_details: dataBase.product_details.required(),
                product_images: dataBase.product_images.required()
            })
            break;
        case "read":
            schema = joi.object({
                query: joi.object({
                    name: dataBase.name,
                    price: dataBase.price,
                    category_id: dataBase.category_id,
                }),
                ...app
            })
            break;
        case "readById":
            schema = joi.object({
                id: id,
                name: dataBase.name
            }).max(1)
            break;
        case 'updateById':
            schema = joi.object({
                id: id.required(),
                values: joi.object(dataBase).min(1).required()
            })
            break;
        case 'deleteById':
            schema = id.required()
            break;
    }
    return schema

}

const productPatternDetailsSV = (type) => {
    const id = joi.number()

    const dataBase = {
        value: joi.string()
            .trim()
            .max(255),
        category_id: joi.number(),
    }

    const app = {
        limit: joi.number().required(),
        page: joi.number().required()
    }

    let schema = {}
    switch (type) {
        case "create":
            schema = joi.object({
                value: dataBase.value.required(),
                category_id: dataBase.category_id.required()
            })
            break;
        case "read":
            schema = joi.object({
                query: joi.object({
                    value: dataBase.value,
                    category_id: dataBase.category_id
                }),
                ...app
            })
            break;
        case "readById":
            schema = joi.object({
                value: dataBase.value,
                category_id: dataBase.category_id,
            }).max(1)
            break;
        case 'updateById':
            schema = joi.object({
                id: id.required(),
                values: joi.object(dataBase).min(1).required()
            })
            break;
        case 'deleteById':
            schema = id.required()
            break;
    }
    return schema
}

const categorySV = (type) => {
    const id = joi.number()

    const dataBase = {
        name: joi.string()
            .trim()
            .normalize()
            .max(255),
        parent_id: joi.number()
    }

    const app = {
        limit: joi.number().required(),
        page: joi.number().required()
    }

    let schema = {}
    switch (type) {
        case "create":
            schema = joi.object({
                name: dataBase.name.required(),
                parent_id: dataBase.parent_id.required()
            })
            break;
        case "read":
            schema = joi.object({
                query: joi.object({
                    name: dataBase.name,
                    parent_id: dataBase.parent_id
                }),
                ...app
            })
            break;
        case "readByID":
            schema = joi.object({
                name: dataBase.name,
                parent_id: dataBase.parent_id
            }).max(1)
            break;
        case 'updateById':
            schema = joi.object({
                id: id.required(),
                values: joi.object(dataBase).min(1).required()
            })
            break;
        case 'deleteById':
            schema = id.required()
            break;
    }
    return schema
}


const category = new CoreController({
    model: productCategoriesModel,
    inputValidationGenerator: categorySV
})

const product = new CoreController({
    model: productsModel,
    inputValidationGenerator: productSV
})


const productDetailPatterns = new CoreController({
    model: productPatternModel,
    inputValidationGenerator: productPatternDetailsSV
})

module.exports = {
    category
    , product
    , productDetailPatterns
}