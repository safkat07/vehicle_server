import { Pool } from "pg";
import config from "../config";

export const pool = new Pool({
  connectionString: config.databaseURI,
});

const initDB = async () => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(`
      CREATE SEQUENCE IF NOT EXISTS user_id_seq START WITH 101 INCREMENT BY 1;
      CREATE SEQUENCE IF NOT EXISTS vehicle_id_seq START WITH 100 INCREMENT BY 1;
      CREATE SEQUENCE IF NOT EXISTS booking_id_seq START WITH 101 INCREMENT BY 1;
    `);

    // 2. Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        id VARCHAR(50) PRIMARY KEY DEFAULT ('usr' || nextval('user_id_seq')::TEXT),
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone VARCHAR(20) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Vehicles Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "vehicles" (
        id VARCHAR(50) PRIMARY KEY DEFAULT ('vehi' || nextval('vehicle_id_seq')::TEXT),
        vehicle_name VARCHAR(100) NOT NULL,
        type VARCHAR(30) NOT NULL CHECK (type IN ('car', 'bike', 'van', 'suv')),
        registration_number VARCHAR(100) NOT NULL UNIQUE,
        daily_rent_price DECIMAL(10, 2) NOT NULL CHECK (daily_rent_price > 0),
        availability_status VARCHAR(30) NOT NULL DEFAULT 'available' CHECK (availability_status IN ('available', 'booked')),
        added_by VARCHAR(50) REFERENCES "users"(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Bookings Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "bookings" (
        id VARCHAR(30) PRIMARY KEY DEFAULT ('bok' || nextval('booking_id_seq')::TEXT),
        customer_id VARCHAR(50) REFERENCES "users"(id) ON DELETE CASCADE,
        vehicle_id VARCHAR(50) REFERENCES "vehicles"(id) ON DELETE CASCADE,
        rent_start_date DATE NOT NULL,
        rent_end_date DATE NOT NULL CHECK (rent_end_date > rent_start_date),
        total_price DECIMAL(10, 2) NOT NULL CHECK (total_price > 0),
        status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'returned')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query("COMMIT");
    console.log("Database tables initialized successfully!");
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Database initialization failed:", error.message);
    throw error;
  } finally {
    client.release();
  }
};

export default initDB;
