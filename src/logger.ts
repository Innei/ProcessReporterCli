import { createLoggerConsola } from "nestjs-pretty-logger/esm/consola.instance"
import { resolve } from "path"

export const logger = createLoggerConsola({
  writeToFile: {
    loggerDir: resolve(process.cwd(), "logs"),
  },
})
