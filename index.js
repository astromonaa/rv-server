require('dotenv').config()
const express = require('express')
const cors = require('cors')
const sequelize = require('./db')
const models = require('./models/models')
const router = require('./routes')
const cookieParser = require('cookie-parser')
const errorMiddleware = require('./middlewares/erroMiddleware')

const PORT = process.env.PORT || 5000

const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000'
}))
app.use('/api', router)

app.use(errorMiddleware)

const start = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
    app.listen(PORT, () => console.log(`Listening ${PORT} port`))
  }catch(e) {
    console.log(e);
  }
}
start()