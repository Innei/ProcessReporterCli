import ActiveWindow from "@paymoapp/active-window"
import { Pusher } from "./pusher"

import { pushDataReplacor } from "./replacer"
import { Uploader } from "./uploader"

ActiveWindow.initialize()
if (!ActiveWindow.requestPermissions()) {
  console.log(
    "Error: You need to grant screen recording permission in System Preferences > Security & Privacy > Privacy > Screen Recording"
  )
  process.exit(0)
}

ActiveWindow.subscribe((activeWin) => {
  if (!activeWin) return

  Uploader.shared.uploadIcon(activeWin.icon, activeWin.application)

  const transformedData = pushDataReplacor({
    process: activeWin.application,
    description: activeWin.title,
    // iconBase64: activeWin.icon,
  })

  if (!transformedData) return
  Pusher.shared.push(transformedData)
})
