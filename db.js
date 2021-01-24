import app from "./app.js"
import mongodb from "mongodb"
import UserDAO from "./model/UserDAO.js"
import TestsDAO from "./model/TestsDAO.js"

const port = process.env.PORT || 3001

mongodb.MongoClient.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 50,
  wtimeout: 2500,
}).then(async (client) => {
  await UserDAO.injectDB(client)
  await TestsDAO.injectDB(client)
  app.listen(port, () => {
    console.log(`listening on port ${port}`)
  })
})
