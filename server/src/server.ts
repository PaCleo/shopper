import  express from 'express';
import bodyParser from 'body-parser';
import { pool } from './services/database.js';
import router from './routes/routes.js';

const app = express()

app.use(bodyParser.json())
app.use('/', router)
async function main() {
    try {
        const client = await pool.connect();
        client.release();
        
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Error connecting to database', err);
    }
}

main()
    .then(() => console.log('Server started.'))
    .catch(err => console.error('Error starting server', err));