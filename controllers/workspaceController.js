const workspaceService = require('../services/workspaceService')

class workspaceController {
  async getAll(req, res, next) {
   try {
      const workspaces = await workspaceService.getAll(req.user.id)
      return res.json(workspaces)
   }catch(e) {
      next(e)
   }
  }
  async create(req, res, next) {
    try {
      const { name, emails, workspacePlan, workspaceType, role } = req.body
      const userId = req.user?.id
      const data = await workspaceService.create(name, emails, workspacePlan, workspaceType, role, userId)
      return res.json(data)
    }catch(e) {
      next(e)
    }
  }
  async addProject(req, res, next) {
    try {
      const { name, type, detecting, workspaceId } = req.body
      const project = await workspaceService.addProject(name, type, detecting, workspaceId)
      return res.json(project)
    }catch(e) {
      next(e)
    }
  }
  async update(req, res, next) {
    try {
      const {name, emails, role, workspacePlan, workspaceType} = req.body
      const {id} = req.params
      const updated = await workspaceService.update(id, name, emails, role, workspacePlan, workspaceType)
      return res.json(updated)
    }catch(e) {
      next(e)
    }
  }
  async createTool(req, res, next) {
    try {
      const {workspaceId, tool} = req.body;
      const createdTool = await workspaceService.createTool(workspaceId, tool)
      return res.json(createdTool)
    }catch(e) {
      next(e)
    }
  }
  async remove(req, res, next) {
    try {
      const {id} = req.params
      const removed = await workspaceService.remove(id)
      return res.json(removed)
    }catch(e) {
      next(e)
    }
  }
  async updateName(req, res, next) {
    try {
      const {id} = req.params;
      const {name} = req.body
      const updated = await workspaceService.updateName(id, name)
      return res.json(updated)
    }catch(e) {
      next(e)
    }
  }
}

module.exports = new workspaceController()