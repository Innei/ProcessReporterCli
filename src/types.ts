export interface Rule {
  matchApplication: string
  replace?: {
    application?: (appName: string) => string
    description?: (des: string) => string
  }
  override?: {
    iconUrl?: string
  }
}
