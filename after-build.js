const { cpSync } = require("fs")
const path = require("path")

const bindingDir = path.join(__dirname, "./node_modules/sqlite3/build")

cpSync(bindingDir, path.join(__dirname, "./dist/build"), {
  recursive: true,
  overwrite: true,
})
