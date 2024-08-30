import { pool } from './database.js'

export const findMeasure = async (measure_uuid: string) => {
    const query = `
        SELECT * FROM measures
        WHERE measure_uuid = $1
    `;
    const result = await pool.query(query, [measure_uuid])
    if (result.rows.length > 0) {
        return result.rows[0];
    }
    return null;
}

export const hasConfirmed = async (measure_uuid: string) => {
    const query = `
        UPDATE measures
        SET has_confirmed = true
        WHERE measure_uuid = $1
    `;
    const result = await pool.query(query, [measure_uuid])
    if (result.rows.length > 0) {
        return true
    }
    return false
}

export const saveNewValue = async (measure_uuid: string, measure_value: number) => {
    const has_confirmed = true
    const query = `
        UPDATE measures
        SET measure_value = $2,
            has_confirmed = $3
        WHERE measure_uuid = $1
    `;
    const result = await pool.query(query, [measure_uuid, measure_value, has_confirmed])
    if (result.rowCount !== null && result.rowCount > 0) {
        return true
    }
    return false
};
