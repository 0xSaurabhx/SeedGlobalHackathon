-- WearOS Data Table
CREATE TABLE IF NOT EXISTS wearos_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId TEXT NOT NULL,
  heartRate REAL,
  stepCount INTEGER,
  timestamp INTEGER NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id)
);

-- Health Data Table
CREATE TABLE IF NOT EXISTS health_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId TEXT NOT NULL,
  healthMetrics TEXT NOT NULL,
  analysisReport TEXT,
  timestamp INTEGER NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_wearos_userid ON wearos_data(userId);
CREATE INDEX IF NOT EXISTS idx_health_userid ON health_data(userId);
