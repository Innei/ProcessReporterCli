import { resolve } from "path"
import sqlite, { open } from "sqlite"
import * as sqlite3 from "sqlite3"

const { Database } = sqlite3

let _db: sqlite.Database<sqlite3.Database, sqlite3.Statement> | null = null

async function getDb() {
  if (_db) return _db
  const dbFile = resolve(process.cwd(), "data.db")
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
