import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { s3 } from "./configs"
import { logger } from "./logger"
import { getDb } from "./db"
import { md5 } from "./utils"
import { mkdirSync, readFile, readFileSync, writeFileSync } from "fs"

const s3client = new S3Client({
  region: s3.region,
  endpoint: s3.endpoint,
  credentials: {
    accessKeyId: s3.accessKeyId,
    secretAccessKey: s3.secretAccessKey,
  },
})

async function uploadToS3(path: string, body: Buffer, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: s3.bucket,
    Key: path,
    Body: body,
    ContentType: contentType,
  })

  await s3client.send(command).then((res) => {
    logger.log("Uploaded to S3", res)
  })
}

export class Uploader {
  public static readonly shared = new Uploader()

  async uploadIcon(iconBase64: string, name: string) {
    const db = await getDb()

    const md5Icon = md5(iconBase64)
    const [query] = await db.all(
      "SELECT * FROM uploads WHERE name = ? LIMIT 1",
      [md5Icon]
    )
    if (query) {
      return query.url
    }
    logger.log("Uploading icon", name)
    const path = `/process_icons/${md5Icon}.png`
    const url = s3.customDomain + path
    uploadToS3(
      path,
      // Buffer.from(iconBase64.split(",")[1], "base64"),
      saveTemp(iconBase64),
      "image/png"
    )
      .catch((err) => {
        logger.error("Failed to upload icon", err)
      })
      .then(() => {
        logger.log("Icon uploaded", name, url)

        db.run(`INSERT INTO uploads (name, url) VALUES (?, ?)`, [md5Icon, url])
      })
    return url
  }
}

function saveTemp(iconBase64: string) {
  const buffer = Buffer.from(iconBase64.split(",")[1], "base64")
  const ts = Date.now()

  writeFileSync(`./temp-${ts}.png`, buffer)

  return readFileSync(`./temp-${ts}.png`)
}
