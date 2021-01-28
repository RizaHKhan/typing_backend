export default class BlogsController {
  static async postBlog(req, res) {
    console.log(req.body)
    res.sendStatus(200)
  }
}
