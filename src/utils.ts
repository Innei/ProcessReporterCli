export function equalObject(a: any, b: any) {
  return JSON.stringify(a) === JSON.stringify(b)
}

export const getStringSize = (str: string) => new Blob([str]).size

export const md5 = (text: string) => {
  return require("crypto")
    .createHash("md5")
    .update(text)
    .digest("hex") as string
}

export const throttle = <T extends (...args: any[]) => any>(
  fn: T,
  time: number
) => {
  let lastTime = 0
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastTime > time) {
      lastTime = now
      return fn(...args)
    }
  }
}
