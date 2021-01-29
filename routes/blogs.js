import express from "express"
import blogsController from "../controller/blogsController.js"
import userController from "../controller/userController.js"

const router = express.Router()

router
  .route("/")
  .post(userController.verifyAdmin, blogsController.postBlog)
  .get(blogsController.getBlogTitles)

router
  .route("/:id")
  .get(blogsController.getBlogById)
  .delete(blogsController.deleteBlogById)
  .put(blogsController.updateBlogById)

export default router
