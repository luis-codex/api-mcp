-- PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT NOT NULL,
  price REAL NOT NULL,
  stock INTEGER NOT NULL,
  category TEXT NOT NULL,
  image TEXT NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_products_slug ON products(slug);

-- SUPPLIERS
CREATE TABLE IF NOT EXISTS suppliers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  rut TEXT NOT NULL,
  phoneNumber TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_suppliers_email ON suppliers(email);

-- ORDERS
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  productId INTEGER NOT NULL,
  -- si manejas proveedor por orden, puedes agregar supplierId INTEGER NOT NULL,
  status TEXT NOT NULL,          -- opcional: CHECK(status IN ('pending','shipped','cancelled','done'))
  priority TEXT NOT NULL,        -- opcional: CHECK(priority IN ('low','medium','high','urgent'))
  quantity INTEGER NOT NULL,
  requestedBy TEXT NOT NULL,
  notes TEXT,                    -- lo hago opcional: a veces no hay nota
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
  expectedArrival TEXT,
  FOREIGN KEY (productId) REFERENCES products(id) ON DELETE RESTRICT ON UPDATE CASCADE
  -- , FOREIGN KEY (supplierId) REFERENCES suppliers(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS ix_orders_productId ON orders(productId);
CREATE INDEX IF NOT EXISTS ix_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS ix_orders_priority ON orders(priority);

-- ALERTS
CREATE TABLE IF NOT EXISTS alerts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  productId INTEGER,
  type TEXT NOT NULL,
  severity TEXT NOT NULL,        -- opcional: CHECK(severity IN ('info','warn','error'))
  status TEXT NOT NULL,          -- opcional: CHECK(status IN ('open','ack','resolved'))
  message TEXT NOT NULL,
  triggeredAt TEXT NOT NULL DEFAULT (datetime('now')),
  resolvedAt TEXT,
  assignedTo TEXT,
  FOREIGN KEY (productId) REFERENCES products(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS ix_alerts_productId ON alerts(productId);
CREATE INDEX IF NOT EXISTS ix_alerts_severity ON alerts(severity);
CREATE INDEX IF NOT EXISTS ix_alerts_status ON alerts(status);
