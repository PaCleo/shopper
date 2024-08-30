import { pool } from './database.js'
import { measureTypeEnum } from '../models/Enums/measureTypeEnum.js'

export const getList = async (customer_code: string, measure_type?: string) => {
    if (measure_type === measureTypeEnum.GAS) {
        const query = await getGasList(customer_code, measure_type);
        return query
    }

    if (measure_type === measureTypeEnum.WATER) {
        const query = await getWaterList(customer_code, measure_type);
        return query
    }

    return await getListall(customer_code);

}

const getListall = async (customer_code: string) => {
    const query = `
        SELECT
            measure_uuid, 
            measure_datetime,
            measure_type,
            has_confirmed,
            image_url
        FROM measures
        WHERE customer_code = $1
        ORDER BY measure_datetime DESC
    `;

    const result = await pool.query(query, [customer_code])
    if (result.rows.length > 0) {
        return result.rows
    }

    return 
}

const getGasList = async (customer_code: string, measure_type?: string) => {
    const query = `
        SELECT
            measure_uuid, 
            measure_datetime,
            measure_type,
            has_confirmed,
            image_url
        FROM measures
        WHERE customer_code = $1
        AND measure_type = $2
        ORDER BY measure_datetime DESC
    `;

    const result = await pool.query(query, [customer_code, measure_type])
    if (result.rows.length > 0) {
        return result.rows
    }

    return
}

const getWaterList = async (customer_code: string, measure_type?: string) => {
    const query = `
        SELECT 
            measure_uuid, 
            measure_datetime,
            measure_type,
            has_confirmed,
            image_url
        FROM measures
        WHERE customer_code = $1
        AND measure_type = $2
        ORDER BY measure_datetime DESC
    `;

    const result = await pool.query(query, [customer_code, measure_type])
    if (result.rows.length > 0) {
        return result.rows
    }

    return
}
