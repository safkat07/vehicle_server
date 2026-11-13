import { pool } from "../../config/db";

const add_vehicle_db = async (payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
    added_by,
  } = payload;
  const result = await pool.query(
    `INSERT INTO vehicles(vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
    added_by
    ) VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
      added_by,
    ],
  );

  return result;
};

const get_all_vehicles_db = async () => {
  const result = await pool.query(`
    SELECT 
      vehicles.*,
      json_build_object(
        'id', users.id,
        'name', users.name,
        'email', users.email,
        'role', users.role
      ) AS added_by_user
    FROM vehicles
    LEFT JOIN users ON vehicles.added_by = users.id
    
  `);

  return result;
};
const get_single_vehicle = async (id: string) => {
  const result = await pool.query(
    `
    SELECT vehicles.* ,
    json_build_object(
    'id', users.id,
    'name', users.name,
    'email',users.email
    ) AS added_by_user
     FROM vehicles 
     LEFT JOIN users ON vehicles.added_by = users.id
     WHERE vehicles.id = $1
    `,
    [id],
  );
  return result;
};
const update_vehicle_db = async (
  id: string,
  payload: Record<string, unknown>,
) => {
  const restrictedFields = ["id", "added_by", "created_at"];
  const fields = Object.keys(payload).filter(
    (key) => !restrictedFields.includes(key) && payload[key] !== undefined,
  );
  const values = fields.map((key) => payload[key]);

  const setQuery = fields
    .map((field, index) => `"${field}" = $${index + 1}`)
    .join(", ");

  const query = `
  UPDATE vehicles 
  SET ${setQuery}
  WHERE id = $${fields.length + 1}
  RETURNING *;
`;
  const result = await pool.query(query, [...values, id]);
  return result;
};
const delete_vehicle_db = async (id: string) => {
  const result = await pool.query(
    `
    DELETE FROM vehicles WHERE id=$1 RETURNING *
    `,
    [id],
  );
  return result;
};

export const vehicle_sevices = {
  add_vehicle_db,
  get_all_vehicles_db,
  get_single_vehicle,
  update_vehicle_db,
  delete_vehicle_db,
};
