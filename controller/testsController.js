import TestsDAO from "../model/TestsDAO.js"
import { User } from "./userController.js"

export default class TestsController {
  static async addTest(req, res) {
    try {
      const { email, wrongWords, score } = req.body
      const response = await TestsDAO.addTest(email, wrongWords, score)
      if (!response.success) {
        res.sendStatus(401).json({ error: "Server Error" })
      }
      res.sendStatus(200)
    } catch (e) {
      res.json({ error: e })
    }
  }

  static async getMetaData(req, res) {
    try {
      const userJwt = req.get("Authorization").slice("Bearer ".length)
      const { email } = await User.decoded(userJwt)
      const metaData = await TestsDAO.getMetaData(email)
      res.send(metaData)
    } catch (e) {
      res.sendStatus(400)
    }
  }
}
