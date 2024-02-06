import { createLogger } from "nestjs-pretty-logger"
import { resolve } from "path"

export const logger = createLogger({
  writeToFile: {
    loggerDir: resolve(process.cwd(), "logs"),
  },
})
