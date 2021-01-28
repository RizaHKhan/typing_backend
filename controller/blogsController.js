import BlogDAO from "../model/BlogDAO.js"

export default class BlogsController {
  static async postBlog(req, res) {
    try {
      const blog = req.body
      await BlogDAO.postBlog(blog)
      res.sendStatus(200)
    } catch (e) {
      res.sendStatus(401).json({ error: e })
    }
  }
}
