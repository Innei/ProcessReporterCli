import { ignoreProcessNames, rules } from "./configs"
import { PushData, PushDto } from "./pusher"

export const pushDataReplacor = async (data: PushData) => {
  const processName = data.process

  if (
    ignoreProcessNames.some((ignoreName) => {
      if (typeof ignoreName === "string") {
        return processName === ignoreName
      } else if (ignoreName instanceof RegExp) {
        return ignoreName.test(processName)
      }
      return ignoreName(processName)
    })
  ) {
    return
  }

  const rule = rules.find(
    (rule) =>
      rule.matchApplication === data.process || rule.matchApplication === "*"
  )
  if (!rule) return data
  const finalIconProps: PushDto["meta"] =
    typeof rule.override?.iconUrl !== "undefined"
      ? {
          iconUrl: rule.override.iconUrl,
          iconBase64: undefined,
        }
      : {
          iconUrl: data.iconUrl,
          iconBase64: data.iconBase64,
        }

  const finalProcessName =
    rule.replace?.application?.(data.process) || data.process
  const finalDescription =
    rule.replace?.description?.(data.description) || data.description

  return {
    process: finalProcessName,
    description: finalDescription,
    ...finalIconProps,
  }
}
