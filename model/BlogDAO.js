import mongodb from "mongodb"

const { ObjectId } = mongodb
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
      // No implementation for unique slugs, if we plan on making the slugs unique, it will help make for a nicer blog endpint
      // For the time being we will use the _id
      blog.slug = blog.title.toLowerCase().split(" ").join("-")
      await blogs.insertOne(blog)
      return { success: true }
    } catch (e) {
      return { error: e }
    }
  }

  static async getBlogsTitle() {
    try {
      const allBlogTitles = await blogs
        .aggregate([
          {
            $project: {
              title: 1,
              slug: 1,
              published: 1,
            },
          },
        ])
        .toArray()

      return { allBlogTitles }
    } catch (e) {
      return { error: e }
    }
  }

  static async getBlogById(id) {
    try {
      const blog = await blogs.findOne({ _id: ObjectId(id) })
      return blog
    } catch (e) {
      return { error: e }
    }
  }

  static async updateBlogById(id, blog) {
    delete blog._id
    blog.updatedAt = new Date().toISOString().substr(0, 10)
    try {
      await blogs.updateOne(
        { _id: ObjectId(id) },
        {
          $set: { ...blog },
        }
      )
      return { success: true }
    } catch (e) {
      return { error: e }
    }
  }

  static async deleteBlogById(id) {
    try {
      await blogs.deleteOne({ _id: ObjectId(id) })
      return { success: true }
    } catch (e) {
      return { error: e }
    }
  }
}
