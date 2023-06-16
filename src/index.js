const path = require('path')
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const authentication = require('./controllers/authentication')
app.post('*',authentication)

const product = require('./routes/product')
const statics = require('./routes/statics')
const user = require('./routes/user')

app.use("/product", product)
app.use("/statics", statics)
app.use("/user", user)

app.listen(process.env.PANEL_ADMIN_PORT, '0.0.0.0', () => {
    console.log(`app is ready on ${process.env.PANEL_ADMIN_PORT}`)
})  