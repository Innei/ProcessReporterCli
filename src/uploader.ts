import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { s3 } from "./configs"
import { getDb } from "./db"
import { logger } from "./logger"
import { md5 } from "./utils"
import sharp from "sharp"

const s3client = new S3Client({
  region: s3.region,
  endpoint: s3.endpoint,
  credentials: {
    accessKeyId: s3.accessKeyId,
    secretAccessKey: s3.secretAccessKey,
  },
})

export async function uploadToS3(
  path: string,
  body: Buffer,
  contentType: string
) {
  const command = new PutObjectCommand({
    Bucket: s3.bucket,
    Key: path,
    Body: body,
    ContentType: contentType,
  })

  await s3client.send(command).then((res) => {
    if (res.$metadata.httpStatusCode !== 200) {
      throw new Error("Failed to upload to s3")
    }
  })
}

export class Uploader {
  public static readonly shared = new Uploader()

  private uploadingMap = {} as Record<string, boolean>

  async uploadIcon(iconBase64: string, name: string) {
    const db = await getDb()

    const md5Icon = md5(iconBase64)

    const path = `${md5Icon}.png`
    const url = s3.customDomain + "/" + path

    if (this.uploadingMap[name]) {
      return url
    }

    this.uploadingMap[name] = true

    const [query] = await db.all(
      "SELECT * FROM uploads WHERE name = ? OR md5 = ? LIMIT 1",
      [name, md5Icon]
    )
    if (query) {
      this.uploadingMap[name] = false
      return query.url as string
    }
    logger.log("Uploading icon", name)

    const buffer = Buffer.from(iconBase64.split(",")[1], "base64")

    await uploadToS3(
      path,
      await sharp(buffer).resize(64, 64).toBuffer(),
      "image/png"
    )
      .catch((err) => {
        logger.error("Failed to upload icon", err)
      })
      .then(() => {
        logger.log("Icon uploaded", name, url)

        db.run(`INSERT INTO uploads (md5, url, name) VALUES (?, ?, ?)`, [
          md5Icon,
          url,
          name,
        ])
      })
      .finally(() => {
        this.uploadingMap[name] = false
      })
    return url as string
  }
}
