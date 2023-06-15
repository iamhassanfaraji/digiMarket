const router = require('express').Router()

const user = require('../controllers/users')

router.post('/read', ...user.read())
router.post('/readById', ...user.readById())
router.post('/login', ...user.login())
router.post('/checkAdmin', user.checkAdmin())


module.exports=router