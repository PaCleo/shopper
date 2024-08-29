import pg from 'pg'

const pool = new pg.Pool({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT, 10) : undefined,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB
});

async function main() {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM customers;');
        console.log(result.rows);
    } catch (err) {
        console.error(err);
    } finally {
        client.release();
    }
}

main()
    .then(() => console.log('Server started.'))
    .catch(err => console.error('Error connecting to database', err));