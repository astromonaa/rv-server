const ApiError = require('../error/ApiError')
const {Workspace, WorkspacePlan, WorkspaceType, WorkspaceTool, Projects} = require('../models/models')

class workspaceService {
  async getAll(userId) {
    const workspaces = await Workspace.findAll({
      where: {userId},
      include: [
        {model: WorkspacePlan},
        {model: WorkspaceType},
        {model: WorkspaceTool},
        {model: Projects}
      ]
    })
    return workspaces
  }
  async create(name, emails, plan, type, role, userId) {
    const workspace = await Workspace.create({name, emails, role, userId})
    const workspacePlan = await WorkspacePlan.create({...plan, workspaceId: workspace.id})
    const workspaceType = await WorkspaceType.create({...type, workspaceId: workspace.id})
    return {
      ...workspace.dataValues,
      workspacePlan,
      workspaceType,
      Projects: []
    }
  }
  async addProject(name, type, detecting, workspaceId) {
    const project = await Projects.create({name, type, detecting, workspaceId})
    return project
  }
  async update(id, name, emails, role, workspacePlan, workspaceType) {

    const candidate = await Workspace.findByPk(id)
    const plan = await WorkspacePlan.findByPk(workspacePlan.id)
    const type = await WorkspaceType.findByPk(workspaceType.id)
    if (!candidate || !plan || !type) {
      throw ApiError.badRequest('Invalid workspace')
    }
    const updated = await candidate.update({name, emails, role})
    const updatedPlan = await plan.update({...workspacePlan})
    const updatedType = await type.update({...workspaceType})

    return {
      ...updated.dataValues,
      workspacePlan: updatedPlan,
      workspaceType: updatedType,
      Projects: []
    }
  }
  async createTool(workspaceId, tool) {
    const candidate = await WorkspaceTool.findOne({where: {workspaceId}})
    if (candidate) {
      throw ApiError.badRequest('Tool already taken')
    }
    const created = await WorkspaceTool.create({...tool, workspaceId})
    return created
  }
  async remove(workspaceId) {
    let workspace = await Workspace.findByPk(workspaceId)
    const workspacePlan = await WorkspacePlan.destroy({where: {workspaceId}})
    const workspaceType = await WorkspaceType.destroy({where: {workspaceId}})
    const workspaceTool = await WorkspaceTool.destroy({where: {workspaceId}})
    const workspaceProjects = await Projects.destroy({where: {workspaceId}})
    workspace = await workspace.destroy()
    return {
      workspace,
      workspacePlan,
      workspaceType,
      workspaceTool,
      Projects: workspaceProjects
    }
  }
  async updateName(workspaceId, name) {
    const workspace = await Workspace.findByPk(workspaceId)
    const updated = await workspace.update({...workspace, name})
    return updated
  }
  
}

module.exports = new workspaceService()