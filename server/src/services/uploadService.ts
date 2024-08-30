import { pool } from './database.js'

export const validateBase64Image = (base64Image: string): boolean => {
    const base64Data = base64Image.replace(/^data:image\/(?:jpeg|png|gif);base64,/, '');
    return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(base64Data);
};

export const checkMontlhyReading = async (customers_code:string, measure_datetime: Date, measure_type: string): Promise<boolean> => {
    const startOfMonth = new Date(measure_datetime);
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);

    const query = `
        SELECT * FROM measures
        WHERE customer_code = $1
        AND measure_type = $2
        AND measure_datetime >= $3
        AND measure_datetime < $4 `

    const result = await pool.query(query, [customers_code, measure_type, startOfMonth, endOfMonth]);

    if (result && typeof result.rowCount === 'number') {
        return result.rowCount > 0;
    }

    return false
}

export const saveMeasure = async (measure_uuid: string ,customers_code: string, measure_datetime: Date, measure_type: string, image_url: string, measure_value: number) => {
    const query = `
        INSERT INTO measures
        (measure_uuid, customer_code, measure_datetime, measure_type, measure_value, image_url)
        VALUES
        ($1, $2, $3, $4, $5, $6)
    `
    const result = await pool.query(query, [measure_uuid, customers_code, measure_datetime, measure_type, measure_value, image_url]);

    if ( (result.rowCount ?? 0)> 0) {
        return true
    }

    return false
};
