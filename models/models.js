const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  email: { type: DataTypes.STRING, require: true },
  password: { type: DataTypes.STRING, require: true },
  role: { type: DataTypes.STRING, defaultValue: 'USER' },
  activationLink: { type: DataTypes.STRING },
  isActivated: { type: DataTypes.BOOLEAN, defaultValue: false }
})
const Token = sequelize.define('token', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  refreshToken: { type: DataTypes.STRING, require: true }
})

const Workspace = sequelize.define('workspace', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, require: true },
  emails: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, required: true }
})

const WorkspacePlan = sequelize.define('workspacePlan',{
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, require: true },
  goal: { type: DataTypes.STRING, require: true },
  type: { type: DataTypes.STRING, require: true },
  desc: { type: DataTypes.STRING, require: true },
})

const WorkspaceType = sequelize.define('workspaceType', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  text: { type: DataTypes.STRING, require: true },
  type: { type: DataTypes.STRING, require: true },
})

const WorkspaceTool = sequelize.define('workspaceTool', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, require: true },
  desc: { type: DataTypes.STRING, require: true },
})

const Projects = sequelize.define('Projects', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, require: true },
  detecting: { type: DataTypes.STRING, require: true }
})

Workspace.hasOne(WorkspacePlan)
WorkspacePlan.belongsTo(Workspace)

Workspace.hasOne(WorkspaceType)
WorkspaceType.belongsTo(Workspace)

Workspace.hasOne(WorkspaceTool)
WorkspaceTool.belongsTo(Workspace)

Workspace.hasMany(Projects)
Projects.belongsTo(Workspace)

User.hasMany(Workspace)
Workspace.belongsTo(User)

User.hasOne(Token)
Token.belongsTo(User)

module.exports = { User, Token, Workspace, WorkspacePlan, WorkspaceTool, WorkspaceType, Projects }