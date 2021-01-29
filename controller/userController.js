import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import UserDAO from "../model/UserDAO.js"

const hashPassword = async (password) => await bcrypt.hash(password, 10)

export class User {
  constructor({ _id, email, password, admin = {} } = {}) {
    this._id = _id
    this.email = email
    this.password = password
    this.admin = admin || false
  }

  toJson() {
    return { _id: this._id, email: this.email, admin: this.admin }
  }

  async comparePassword(plainText) {
    return await bcrypt.compare(plainText, this.password)
  }

  encoded() {
    return jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 4,
        ...this.toJson(),
      },
      process.env.SECRET_KEY
    )
  }

  static async decoded(token) {
    return jwt.verify(token, process.env.SECRET_KEY, (error, res) => {
      if (error) {
        return { error }
      }
      return new User(res)
    })
  }
}

export default class UserController {
  static getUser(req, res, next) {
    res.status(200).json({ Welcome: "To Our App" })
  }

  static async register(req, res) {
    try {
      // if user already exists don't bother running the rest of this:
      const userFromBody = req.body

      const userExists = await UserDAO.getUser(userFromBody.email)
      if (userExists) {
        res.status(400).json({ error: "User already exists" })
        return
      }

      let errors = []

      if (userFromBody && userFromBody.password.length < 5) {
        errors.push("Password must be at least 5 characters long")
      }

      if (userFromBody && userFromBody.password.length > 50) {
        errors.push("Password cannot be more then 50 characters long")
      }

      if (userFromBody && !userFromBody.email.length) {
        errors.push("Email must exist")
      }

      if (errors.length > 0) {
        res.status(400).json(errors)
        return
      }

      const userInfo = {
        ...userFromBody,
        password: await hashPassword(userFromBody.password),
      }

      const userFromDB = await UserDAO.addUser(userInfo)
      if (!userFromDB) {
        errors.push("Unable to register at this time, please try again later")
      }

      if (errors.length > 0) {
        res.status(400).json(errors)
        return
      }

      const user = new User(userFromDB)
      const token = user.encoded()

      res.json({
        token: user.encoded(),
        user: user.toJson(),
      })
    } catch (e) {
      res.status(500).json({ error: e })
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body

      if (!email || typeof email !== "string") {
        throw new Error("Bad Email Format, Expected String")
      }

      if (!password || typeof password !== "string") {
        throw new Error("Bad Password Format, Expected String")
      }

      const userData = await UserDAO.getUser(email)
      if (!userData) {
        throw new Error("Incorrect Email Type")
      }

      const user = new User(userData)
      if (!(await user.comparePassword(password))) {
        throw new Error("Wrong Password")
      }

      const loginResponse = await UserDAO.loginUser(user.email, user.encoded())
      if (!loginResponse.success) {
        throw new Error("Server Issues While Logging In")
      }

      res.json({
        token: user.encoded(),
        user: user.toJson(),
      })
    } catch (e) {
      return res.status(400).json({ error: e })
    }
  }

  static async loginUserInfo(req, res) {
    try {
      const userJwt = req.get("Authorization").slice("Bearer ".length)
      const userObj = await User.decoded(userJwt)
      let { error } = userObj
      if (error) {
        res.status(401).json({ error })
        return
      }
      res.send({ user: userObj })
    } catch (e) {
      return res.status(400).json({ error: e })
    }
  }

  static async logout(req, res) {
    try {
      const userJwt = req.get("Authorization").slice("Bearer ".length)
      const userObj = await User.decoded(userJwt)
      var { error } = userObj
      if (error) {
        res.status(401).json({ error })
        return
      }

      const logoutResult = UserDAO.logout(userObj.email)
      var { error } = logoutResult
      if (error) {
        res.status(500).json({ error: "Server Error" })
        return
      }

      res.json(logoutResult)
    } catch (e) {
      res.status(400).json({ error: e })
    }
  }

  static async verifyAdmin(req, res, next) {
    try {
      const userJwt = req.get("Authorization").slice("Bearer ".length)
      const userObj = await User.decoded(userJwt)

      var { error } = userObj
      if (error) {
        res.status(401).json({ error })
        return
      }

      if (!userObj.admin) {
        res.status(400).json({ error: "Unauthorized" })
        return
      }

      next()
    } catch (e) {
      res.send(400).json({ error: e })
    }
  }
}
