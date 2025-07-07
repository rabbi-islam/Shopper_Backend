// app.js
const express = require("express")
const cors = require("cors")
const { errorHandler } = require("./middleware/errorHandler")
const app = express()

//router
const userRouter = require("./routes/user_routes")

//import DB
require("./config/db")

app.use(express.urlencoded({ extended: true }))
app.use(express.json())







app.use("/api/v1/auth", userRouter)






app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
  })
)

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome To Shopper Backend :)",
  })
})

// Wrong route
app.use((req, res, next) => {
  res.status(404).json({
    message: "Wrong Route",
  })
})

// Error handling middleware
app.use(errorHandler)

module.exports = app
