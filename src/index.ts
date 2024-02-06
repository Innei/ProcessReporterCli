import { resolve } from "path"
import { existsSync, writeFileSync } from "fs"

process.title = "Process Report Cli"

const PKG_PATH = resolve(process.cwd(), "./package.json")
if (!existsSync(PKG_PATH)) {
  writeFileSync(PKG_PATH, "{}", "utf-8")
}

import("./bootstarp").then(({ bootstrap }) => {
  bootstrap()
})
