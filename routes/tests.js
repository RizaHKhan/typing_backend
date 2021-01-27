import express from "express"
import testsController from "../controller/testsController.js"

const router = express.Router()
router.route("/").post(testsController.addTest).get(testsController.getMetaData)

export default router
