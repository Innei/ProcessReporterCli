import { Rule } from "./types"
import { config } from "dotenv"

const cwd = process.cwd()

const resolvePath = (path: string) => require("path").resolve(cwd, path)
const env = config({
  path: resolvePath(".env"),
})
export const endpoint = env.parsed?.API_URL!
export const updateKey = env.parsed?.UPDATE_KEY!

if (!endpoint || !updateKey) {
  throw new Error("API_URL or UPDATE_KEY is not set")
}
export const rules: Rule[] = [
  {
    matchApplication: "Visual Studio Code",
    replace: {
      application: (appName) => "Code",
      description: (des) =>
        "写码:\n-> " + des?.split(" - ").slice(0, 2).join(" - "),
    },
    override: {},
  },
  {
    matchApplication: "Google Chrome",
    replace: {
      description: (des) =>
        "正在浏览:\n->" + des?.split(" - ").slice(0, 2).join(" - "),
    },
  },
  {
    matchApplication: "*",
    replace: {
      description(des) {
        return `\n${des}`
      },
    },
  },
]

export const ignoreProcessNames: (
  | string
  | RegExp
  | ((processName: string) => boolean)
)[] = ["下载"]

export const s3 = {
  accountId: "de7ecb0eaa0a328071255d557a6adb66",
  accessKeyId: process.env.S3_ACCESS_KEY as string,
  secretAccessKey: process.env.S3_SECRET_KEY as string,
  bucket: "process-reporter",
  customDomain: "https://process-reporter-cdn.innei.in",
  region: "auto",
  get endpoint() {
    return `https://${s3.accountId}.r2.cloudflarestorage.com`
  },
}
