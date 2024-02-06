import { mkdirSync } from "fs"
import path, { resolve } from "path"
import sqlite, { open } from "sqlite"
import * as sqlite3 from "sqlite3"

const { Database } = sqlite3

let _db: sqlite.Database<sqlite3.Database, sqlite3.Statement> | null = null

const dbFile = resolve(
  require("os").homedir(),
  "./AppData/Local/ProcessRepoter/data.db"
)

mkdirSync(path.dirname(dbFile), { recursive: true })

async function getDb() {
  if (_db) return _db

  const db = await open({
    driver: Database,
    filename: dbFile,
  })
  _db = db

  async function initializeDb() {
    await db.exec(`CREATE TABLE IF NOT EXISTS uploads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    md5 TEXT NOT NULL,
    url TEXT NOT NULL,
    name TEXT NOT NULL
  )`)
  }

  await initializeDb()

  return db
}

getDb()
export { getDb }
