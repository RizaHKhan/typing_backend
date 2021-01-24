import TestsDAO from "../models/TestsDAO.js"

export default class TestsController {
  static async addTest(req, res) {
    try {
    } catch (e) {
      res.send(400).json({ error: e })
    }
  }
}
