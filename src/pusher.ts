import { endpoint, updateKey } from "./configs"
import { logger } from "./logger"
import { Uploader } from "./uploader"
import { equalObject } from "./utils"

export interface PushDto {
  process: string

  meta?: {
    iconUrl?: string
    iconBase64?: string
    description?: string
  }

  timestamp: number
  key: string
}

export type PushData = Pick<PushDto, "process"> & PushDto["meta"]

export class Pusher {
  static readonly shared = new Pusher()
  private requestQueue = [] as {
    fetcher: () => Promise<any>
    cancelToken: AbortController
  }[]

  private dataList = [] as PushDto[]

  push(data: PushData) {
    const { process, ...meta } = data
    this.dataList.push({
      key: updateKey,
      timestamp: Date.now(),
      process,
      meta,
    })
    this.batch()
  }

  batch() {
    const data = this.dataList.at(-1)

    if (!data) return

    const now = Date.now()

    const last2 = this.dataList.at(-2)

    if (last2)
      if (equalObject(data, last2) && now - last2.timestamp < 1000 * 30) {
        return
      }

    const cancelToken = new AbortController()
    const fetcher = async () => {
      try {
        try {
          const iconBase64 = data.meta?.iconBase64
          if (iconBase64) {
            data.meta!.iconUrl = await Uploader.shared.uploadIcon(
              iconBase64,
              data.process
            )

            delete data.meta?.iconBase64
          }

          const body = JSON.stringify(data)
          const res = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body,
            signal: cancelToken.signal,
          })
          return res
        } catch (err) {
          if (err.name === "AbortError") {
            logger.log("AbortError: Fetch request aborted")
          } else logger.error(err)
          return err
        }
      } finally {
        this.requestQueue = this.requestQueue.filter(
          (task) => task.cancelToken !== cancelToken
        )
        this.dataList = this.dataList.filter((item) => item !== data)
      }
    }

    this.requestQueue.forEach((task) => {
      if (task.cancelToken.signal.aborted) {
        return
      }
      task.cancelToken.abort()
    })
    this.requestQueue = []
    this.requestQueue.push({ fetcher, cancelToken: cancelToken })

    logger.log(
      "Pushing process",
      data.process + " - " + (data.meta?.description || "N/A")
    )
    fetcher()
  }
}
