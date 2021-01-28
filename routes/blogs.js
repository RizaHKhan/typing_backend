import express from "express"
import blogsController from "../controller/blogsController.js"

const router = express.Router()
router.route("/").post(blogsController.postBlog)

export default router
