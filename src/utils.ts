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
