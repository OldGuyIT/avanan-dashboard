CREATE TABLE IF NOT EXISTS avanan_alerts (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMP,
  tenant VARCHAR,
  user_email VARCHAR,
  ip1 VARCHAR,
  ip1_city VARCHAR,
  ip1_state VARCHAR,
  ip1_country VARCHAR,
  ip1_isp VARCHAR,
  ip1_geo POINT,
  ip2 VARCHAR,
  ip2_city VARCHAR,
  ip2_state VARCHAR,
  ip2_country VARCHAR,
  ip2_isp VARCHAR,
  ip2_geo POINT
);

CREATE TABLE IF NOT EXISTS tenant_domains (
  id SERIAL PRIMARY KEY,
  domain VARCHAR UNIQUE,
  tenant_name VARCHAR
);
