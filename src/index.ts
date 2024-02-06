import ActiveWindow, { WindowInfo } from "@paymoapp/active-window"
import { Pusher } from "./pusher"

import { pushDataReplacor } from "./replacer"
import { Uploader, uploadToS3 } from "./uploader"
async function main() {
  ActiveWindow.initialize()
  if (!ActiveWindow.requestPermissions()) {
    console.log(
      "Error: You need to grant screen recording permission in System Preferences > Security & Privacy > Privacy > Screen Recording"
    )
    process.exit(0)
  }

  ActiveWindow.subscribe(handler)

  handler(ActiveWindow.getActiveWindow())

  async function handler(activeWin: WindowInfo | null) {
    if (!activeWin) return

    const iconUrl = await Uploader.shared.uploadIcon(
      activeWin.icon,
      activeWin.application
    )

    const transformedData = pushDataReplacor({
      process: activeWin.application,
      description: activeWin.title,
      iconUrl,
    })

    if (!transformedData) return
    Pusher.shared.push(transformedData)
  }
}

main()
