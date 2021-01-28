import express from "express"
import blogsController from "../controller/blogsController.js"
import userController from "../controller/userController.js"

const router = express.Router()
router.route("/").post(userController.verifyAdmin, blogsController.postBlog)

export default router
