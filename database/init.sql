-- SmartLogist 

-- Очищення існуючих даних
DROP TABLE IF EXISTS manager_permissions CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS driver_vehicles CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS trip_routes CASCADE;
DROP TABLE IF EXISTS trip_feedback CASCADE;
DROP TABLE IF EXISTS trips CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS cargos CASCADE;
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS admin_requests CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;

-- 1. ДОВІДНИКИ ТА КОРНЕВІ ТАБЛИЦІ (3NF)

CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    city VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    UNIQUE(city, address)
);
CREATE INDEX idx_locations_city ON locations(city);

CREATE TABLE cargos (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type_id SMALLINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. КОРИСТУВАЧІ ТА ПРАВА (RBAC)

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'manager', 'driver')),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    
    manager_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    license_number VARCHAR(50) UNIQUE,
    driver_status VARCHAR(50) CHECK (driver_status IN ('available', 'on-trip', 'offline', 'on-break')),
    
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE manager_permissions (
    id SERIAL PRIMARY KEY,
    manager_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
    granted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(manager_id, permission_id)
);

-- 3. ТРАНСПОРТ

CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,
    model VARCHAR(255) NOT NULL,
    license_plate VARCHAR(20) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'Available' CHECK (status IN ('Available', 'InUse', 'Maintenance', 'Inactive')),
    type VARCHAR(100) NOT NULL,
    fuel_type VARCHAR(100) NOT NULL,
    fuel_consumption REAL NOT NULL,
    height REAL DEFAULT 0,
    width REAL DEFAULT 0,
    length REAL DEFAULT 0,
    weight REAL DEFAULT 0,
    is_hazardous BOOLEAN DEFAULT FALSE,
    total_mileage REAL DEFAULT 0 NOT NULL,
    mileage_at_last_maintenance REAL DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE driver_vehicles (
    id SERIAL PRIMARY KEY,
    driver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT false,
    assigned_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(driver_id, vehicle_id)
);

-- 4. РЕЙСИ (ГОРИЗОНТАЛЬНЕ ПАРТИЦІЮВАННЯ)

CREATE TABLE trips (
    id SERIAL,
    origin_id INTEGER NOT NULL REFERENCES locations(id),
    destination_id INTEGER NOT NULL REFERENCES locations(id),
    scheduled_departure TIMESTAMPTZ NOT NULL,
    scheduled_arrival TIMESTAMPTZ NOT NULL,
    actual_departure TIMESTAMPTZ,
    actual_arrival TIMESTAMPTZ,
    
    payment_amount NUMERIC(12, 2) NOT NULL,
    currency CHAR(3) DEFAULT 'UAH',
    distance_km NUMERIC(10, 2) NOT NULL,
    status SMALLINT DEFAULT 0,
    
    driver_id INTEGER NOT NULL REFERENCES users(id),
    vehicle_id INTEGER REFERENCES vehicles(id),
    manager_id INTEGER NOT NULL REFERENCES users(id),
    cargo_id INTEGER REFERENCES cargos(id),
    
    cargo_weight REAL DEFAULT 0,
    expected_profit NUMERIC(12, 2) DEFAULT 0,
    estimated_fuel_cost NUMERIC(12, 2) DEFAULT 0,
    actual_fuel_consumption REAL,
    fuel_price NUMERIC(10, 2) DEFAULT 60 NOT NULL,
    
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id, scheduled_departure)
) PARTITION BY RANGE (scheduled_departure);

CREATE TABLE trips_2025 PARTITION OF trips FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
CREATE TABLE trips_2026 PARTITION OF trips FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');

CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_trips_driver ON trips(driver_id);
CREATE INDEX idx_trips_vehicle ON trips(vehicle_id);

-- 5. ВЕРТИКАЛЬНІ ТАБЛИЦІ (ДЛЯ ВАЖКИХ ДАНИХ)

CREATE TABLE trip_routes (
    trip_id INT NOT NULL,
    departure_time TIMESTAMP(6) NOT NULL,
    route_geometry JSONB NOT NULL,
    CONSTRAINT PK_trip_routes PRIMARY KEY (trip_id, departure_time),
    CONSTRAINT FK_trip_routes_trips FOREIGN KEY (trip_id, departure_time) 
        REFERENCES trips (id, scheduled_departure) ON DELETE CASCADE
);

CREATE TABLE trip_feedback (
    trip_id INTEGER NOT NULL,
    departure_time TIMESTAMPTZ NOT NULL,
    rating SMALLINT CHECK (rating BETWEEN 1 AND 5),
    manager_review TEXT,
    PRIMARY KEY (trip_id, departure_time)
);

-- 6. СИСТЕМНІ ТАБЛИЦІ

CREATE TABLE activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(255) NOT NULL,
    details TEXT,
    entity_type VARCHAR(100),
    entity_id VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admin_requests (
    id SERIAL PRIMARY KEY,
    type SMALLINT NOT NULL,
    status SMALLINT NOT NULL DEFAULT 1,
    requester_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_id INTEGER,
    target_name TEXT NOT NULL,
    comment TEXT NOT NULL,
    admin_response TEXT,
    created_at TIMESTAMPTZ DEFAULT (now() at time zone 'utc'),
    processed_at TIMESTAMPTZ,
    processed_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'Info',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT (now() at time zone 'utc')
);

-- Зв'язки
ALTER TABLE trip_routes ADD CONSTRAINT fk_routes_trip 
FOREIGN KEY (trip_id, departure_time) REFERENCES trips(id, scheduled_departure) ON DELETE CASCADE;

ALTER TABLE trip_feedback ADD CONSTRAINT fk_feedback_trip 
FOREIGN KEY (trip_id, departure_time) REFERENCES trips(id, scheduled_departure) ON DELETE CASCADE;


-- ДОЗВОЛИ
-- Дозволи для Рейсів
INSERT INTO permissions (code, name, description, category) VALUES
('trips.view', 'Перегляд рейсів', 'Можливість переглядати список рейсів', 'trips'),
('trips.create', 'Створення рейсів', 'Можливість створювати нові рейси', 'trips'),
('trips.edit', 'Редагування рейсів', 'Можливість редагувати існуючі рейси', 'trips'),
('trips.delete', 'Видалення рейсів', 'Можливість видаляти рейси', 'trips'),
('trips.assign', 'Призначення рейсів', 'Можливість призначати рейси водіям', 'trips');

-- Дозволи для Водіїв
INSERT INTO permissions (code, name, description, category) VALUES
('drivers.view', 'Перегляд водіїв', 'Можливість переглядати список водіїв', 'drivers'),
('drivers.create', 'Додавання водіїв', 'Можливість додавати нових водіїв', 'drivers'),
('drivers.edit', 'Редагування водіїв', 'Можливість редагувати дані водіїв', 'drivers'),
('drivers.delete', 'Видалення водіїв', 'Можливість видаляти водіїв', 'drivers');

-- Дозволи для Транспорту
INSERT INTO permissions (code, name, description, category) VALUES
('vehicles.view', 'Перегляд транспорту', 'Можливість переглядати список транспорту', 'vehicles'),
('vehicles.create', 'Додавання транспорту', 'Можливість додавати новий транспорт', 'vehicles'),
('vehicles.edit', 'Редагування транспорту', 'Можливість редагувати дані транспорту', 'vehicles'),
('vehicles.delete', 'Видалення транспорту', 'Можливість видаляти транспорт', 'vehicles');

-- Дозволи для Аналітики
INSERT INTO permissions (code, name, description, category) VALUES
('analytics.view', 'Перегляд аналітики', 'Доступ до звітів та аналітики', 'analytics'),
('analytics.export', 'Експорт даних', 'Можливість експортувати дані', 'analytics');

ALTER TABLE notifications 
ADD COLUMN related_entity_type VARCHAR(100),
ADD COLUMN related_entity_id VARCHAR(100);
ALTER TABLE manager_permissions 
ADD COLUMN granted_by INTEGER REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE trips 
ADD COLUMN notes TEXT,
ADD COLUMN is_mileage_accounted BOOLEAN DEFAULT FALSE;
