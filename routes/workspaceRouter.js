const router = require('express').Router()
const workspaceController = require('../controllers/workspaceController')
const authMiddleware = require('../middlewares/authMiddleware')

router.get('/', authMiddleware, workspaceController.getAll)
router.post('/create', authMiddleware, workspaceController.create)
router.post('/project', authMiddleware, workspaceController.addProject)
router.put('/:id', authMiddleware, workspaceController.update)
router.post('/tool', authMiddleware, workspaceController.createTool)
router.delete('/:id', authMiddleware, workspaceController.remove)
router.put('/name/:id', authMiddleware, workspaceController.updateName)

module.exports = router