import dotenv from "dotenv"
import express from "express"
import morgan from "morgan"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import cors from "cors"
import users from "./routes/users.js"
import tests from "./routes/tests.js"
import blogs from "./routes/blogs.js"

dotenv.config()
const app = express()

app.use(cors())
app.use(cookieParser())
process.env.NODE_ENV !== "prod" && app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// registering routes
app.use("/api/v1/users", users)
app.use("/api/v1/tests", tests)
app.use("/api/v1/blogs", blogs)
//
export default app
