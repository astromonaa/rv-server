const router = require('express').Router()
const userRouter = require('./userRouter')
const workspaceRouter = require('./workspaceRouter')

router.use('/users', userRouter)
router.use('/workspaces', workspaceRouter)

module.exports = router

