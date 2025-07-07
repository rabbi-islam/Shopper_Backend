// index.js
require("dotenv").config()
const app = require("./app")
const config = require("./config/config")

const port = config.app.port || 8080

app.listen(port, () => {
  console.log(`🚀 Server started at http://localhost:${port}`)
})
