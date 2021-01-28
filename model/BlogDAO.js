let blogs

export default class BlogDAO {
  static async injectDB(conn) {
    if (blogs) {
      return
    }

    try {
      blogs = await conn.db(process.env.TYPING_DB).collection("blogs")
    } catch (e) {
      console.log(`Unable to establish collection handles in Blog Model: ${e}`)
    }
  }

  static async postBlog(blog) {
    try {
      blog.createdAt = new Date().toISOString().substr(0, 10)
      blog.updatedAt = new Date().toISOString().substr(0, 10)
      await blogs.insertOne(blog)
      return { sucess: true }
    } catch (e) {
      return { error: e }
    }
  }
}
