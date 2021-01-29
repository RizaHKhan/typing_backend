import BlogDAO from "../model/BlogDAO.js"

export default class BlogsController {
  static async postBlog(req, res) {
    try {
      const blog = req.body
      const response = await BlogDAO.postBlog(blog)
      if (!response.success) {
        res.sendStatus(401).json({ error: "Server Error" })
        return
      }
      res.sendStatus(200)
    } catch (e) {
      res.sendStatus(401).json({ error: e })
    }
  }

  static async getBlogTitles(req, res) {
    try {
      const blogs = await BlogDAO.getBlogsTitle()
      res.send(blogs)
    } catch (e) {
      res.sendStatus(400).json({ error: e })
    }
  }

  static async getBlogById(req, res) {
    try {
      const blog = await BlogDAO.getBlogById(req.params.id)
      res.send(blog)
    } catch (e) {
      res.sendStatus(400).json({ error: e })
    }
  }

  static async updateBlogById(req, res) {
    try {
      const response = await BlogDAO.updateBlogById(req.params.id, req.body)
      if (!response.success) {
        res.sendStatus(401).json({ error: "Server Error" })
        return
      }
      res.sendStatus(200)
    } catch (e) {
      res.sendStatus(400).json({ error: e })
    }
  }

  static async deleteBlogById(req, res) {
    try {
      const response = await BlogDAO.deleteBlogById(req.params.id)
      if (!response.success) {
        res.sendStatus(401).json({ error: "Server Error" })
        return
      }
      res.sendStatus(200)
    } catch (e) {
      res.sendStatus(400).json({ error: e })
    }
  }
}
