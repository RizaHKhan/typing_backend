import BlogDAO from "../model/BlogDAO.js"
import { User } from "./userController.js"

export default class BlogsController {
  static async addTest(req, res) {
    try {
      const { email, wrongWords, correctWords, score } = req.body
      const response = await TestsDAO.addTest(email, wrongWords, score)
      if (!response.success) {
        res.send(401).json({ error: "Server Error" })
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
      res.send(400)
    }
  }
}
