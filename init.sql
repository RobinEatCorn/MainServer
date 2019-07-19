CREATE TABLE IF NOT EXISTS Visitors (
	ReqDate TEXT NOT NULL,
	ReqTime TEXT NOT NULL,
	reqURL TEXT,
	reqHost TEXT,
	RemoteAddress TEXT,
	RemotePort INT UNSIGNED,
	LocalAddress TEXT,
	LocalPort INT UNSIGNED,
	UserAgent TEXT
);