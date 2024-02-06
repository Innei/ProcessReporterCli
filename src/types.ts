export interface Rule {
  matchApplication: string
  replace?: {
    application?: (appName: string) => string
    description?: (des: string | undefined) => string | undefined
  }
  override?: {
    iconUrl?: string
  }
}
