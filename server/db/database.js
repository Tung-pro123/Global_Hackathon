// database.js — JSON file-based storage (no native dependencies needed)
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = join(__dirname, '../../db.json');

// Default empty structure
const DEFAULT_DB = {
  slangs: [],
  challenges: [],
  players: [],
  users: []
};

// Load DB from disk
function loadDb() {
  if (!existsSync(DB_PATH)) {
    saveDb(DEFAULT_DB);
    return structuredClone(DEFAULT_DB);
  }
  try {
    return JSON.parse(readFileSync(DB_PATH, 'utf-8'));
  } catch {
    return structuredClone(DEFAULT_DB);
  }
}

// Save DB to disk
function saveDb(data) {
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// Simple query helpers mimicking SQLite API
export function getDb() {
  const db = loadDb();

  return {
    // Get all rows from a collection
    all(collection, filterFn = null, sortFn = null) {
      let rows = db[collection] || [];
      if (filterFn) rows = rows.filter(filterFn);
      if (sortFn) rows = [...rows].sort(sortFn);
      return rows;
    },

    // Get one row
    get(collection, filterFn) {
      return (db[collection] || []).find(filterFn) || null;
    },

    // Insert a row (ignores if id already exists)
    insertOrIgnore(collection, row) {
      if (!db[collection]) db[collection] = [];
      const exists = db[collection].some(r => r.id === row.id);
      if (!exists) {
        db[collection].push({ ...row, created_at: row.created_at || new Date().toISOString() });
        saveDb(db);
      }
    },

    // Update rows matching filterFn with patch object
    update(collection, filterFn, patch) {
      if (!db[collection]) return;
      let changed = false;
      db[collection] = db[collection].map(row => {
        if (filterFn(row)) { changed = true; return { ...row, ...patch, updated_at: new Date().toISOString() }; }
        return row;
      });
      if (changed) saveDb(db);
    },

    // Count rows
    count(collection, filterFn = null) {
      let rows = db[collection] || [];
      if (filterFn) rows = rows.filter(filterFn);
      return rows.length;
    },

    // Get random row from filtered set
    random(collection, filterFn = null) {
      let rows = db[collection] || [];
      if (filterFn) rows = rows.filter(filterFn);
      if (!rows.length) return null;
      return rows[Math.floor(Math.random() * rows.length)];
    }
  };
}

export default getDb;
