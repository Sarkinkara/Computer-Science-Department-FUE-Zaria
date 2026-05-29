const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

module.exports = {
    pool,
    logAction: async (userId, action, req) => {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const userAgent = req.headers['user-agent'];
        await pool.query(
            'INSERT INTO access_logs (user_id, action, ip_address, user_agent) VALUES ($1, $2, $3, $4)',
            [userId, action, ip, userAgent]
        );
    }
};