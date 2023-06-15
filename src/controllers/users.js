const joi = require('joi')
const jwt = require('jsonwebtoken')
const usersModel = require('../models/usersModel')
const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10);

const CoreController = require("./components/coreController")

const userSV = (type) => {
    const id = joi.number()

    const dataBase = {
        phoneNumber: joi.string()
            //.pattern(new RegExp('^[0-9]$'))
            .max(12),
        password: joi.string()
            .trim()
            .max(255),
        name: joi.string()
            .max(255),
        image: joi.number(),
        address: joi.array().items(
            joi.string()
                .max(255)
        ),
        isActive: joi.boolean(),
        levelUser: joi.number().max(10),
        loginSession: joi.boolean()
    }
    const app = {
        limit: joi.number().required(),
        page: joi.number().required()
    }

    let schema = {}
    switch (type) {
        case "create":
            schema = joi.object({
                phoneNumber: dataBase.phoneNumber.required(),
                password: dataBase.password.required(),
                name: dataBase.name.required(),
                image: dataBase.image.required(),
                address: dataBase.address.required(),
            })
            break;
        case "readById":
            schema = joi.object({
                id: id,
                phoneNumber: dataBase.phoneNumber,
            }).max(1)
            break;
        case "read":
            schema = joi.object({
                query: joi.object({
                    name: dataBase.name,
                    phoneNumber: dataBase.phoneNumber,
                }),
                ...app
            })
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
        case "login":
            schema = joi.object({
                phoneNumber: dataBase.phoneNumber.required(),
                password: dataBase.password.required()
            })
            break
        case "checkAdmin":
            schema = joi.object({
                token: joi.string()
                    .max(255)
            })
            break
    }
    return schema
}

class UsersController extends CoreController {
    constructor(props) {
        super(props)

        this.checkAdminValidation = this.inputValidationGenerator("checkAdmin") 
        this.loginValidation = this.inputValidationGenerator("login")
    }

    checkAdmin() {
        function jwtVerifyAsync(token) {
            return new Promise((resolve, reject) => {
                jwt.verify(token, process.env.secretKeyAdmin, (err, decode) => {
                    resolve([err, decode])
                })
            })
        }

        const requestHandler = this.errorHandler(async (req, res) => {
            const [err, decode] = await jwtVerifyAsync(req.body.token)
            if (err || decode.levelUser == 0) {
                res.status(401).send()
            } else {
                res.status(200).send()
            }
        })


        return [
            this.inputValidation(this.checkAdminValidation),
            requestHandler
        ]
    }


    login(){
        const requestHandler = this.errorHandler(async (req, res) => {
            try {
                const { phoneNumber, password } = req.body
                const user = await this.model.readOne({ phone_number: phoneNumber })

                const selectUser = user[0]
                const validatePassword = bcrypt.compareSync(password, selectUser.password)
                if (validatePassword) {
                    const { id } = selectUser
                    const token = jwt.sign({ id: id, levelUser: selectUser.levelUser }, process.env.secretKeyAdmin, { expiresIn: '7d' })
                    res.status(200).json({ message: token })
                } else {
                    res.status(406).send()
                }
            } catch (err) {
                throw { status: 400 }
            }
        })

        return [
            this.inputValidation(this.loginValidation),
            requestHandler
        ]
    }

}

module.exports = new UsersController({ model: usersModel, inputValidationGenerator: userSV })