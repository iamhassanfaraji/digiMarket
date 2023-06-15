const router = require('express').Router()
const statics = require('../controllers/statics')
const busBoyBodyParser = require('../controllers/components/multibodparser')

router.post('/read', ...statics.read())
router.post('/readById', ...statics.readById())

module.exports = router