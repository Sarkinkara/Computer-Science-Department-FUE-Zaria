const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { pool, logAction } = require('./config/database');
const { apiLimiter } = require('./middleware/security');
const { authenticateJWT, authorizeRole } = require('./middleware/auth');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use('/api/', apiLimiter);

// --- AUTHENTICATION ENDPOINT ---
app.post('/api/auth/login', async (req, res) => {
    const { id_number, email, password } = req.body;
    try {
        const userRes = await pool.query('SELECT * FROM users WHERE id_number = $1 AND email = $2', [id_number, email]);
        if (userRes.rows.length === 0) return res.status(401).json({ error: "Invalid Credentials" });

        const user = userRes.rows[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) return res.status(401).json({ error: "Invalid Credentials" });

        const token = jwt.sign(
            { id: user.id, role: user.role, name: user.full_name }, 
            process.env.JWT_SECRET, 
            { expiresIn: '6h' }
        );
        
        await logAction(user.id, 'USER_LOGIN', req);
        res.json({ token, user: { name: user.full_name, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Fault" });
    }
});

// --- CORE CURRICULUM ASSETS ---
app.get('/api/materials/:level', authenticateJWT, async (req, res) => {
    try {
        const { level } = req.params;
        const materials = await pool.query(
            `SELECT m.*, c.code, c.title as course_title, u.full_name as lecturer_name 
             FROM materials m 
             JOIN courses c ON m.course_id = c.id 
             JOIN users u ON m.uploaded_by = u.id 
             WHERE c.level = $1 AND u.role IN ('lecturer', 'admin')`, 
            [level]
        );
        await logAction(req.user.id, `VIEW_MATERIALS_LEVEL_${level}`, req);
        res.json(materials.rows);
    } catch (err) {
        res.status(500).json({ error: "Database operational failure" });
    }
});

app.post('/api/admin/upload', authenticateJWT, authorizeRole(['lecturer', 'admin']), async (req, res) => {
    const { course_id, title, file_url, file_type } = req.body;
    try {
        await pool.query(
            'INSERT INTO materials (course_id, uploaded_by, title, file_url, file_type) VALUES ($1, $2, $3, $4, $5)',
            [course_id, req.user.id, title, file_url, file_type]
        );
        await logAction(req.user.id, `UPLOADED_MATERIAL_${title}`, req);
        res.status(201).json({ success: true, message: "Material deployed successfully." });
    } catch (err) {
        res.status(500).json({ error: "Persistence operations error." });
    }
});

// --- AI INTERFACE & SIMULATION ENGINE ---
app.post('/api/ai/explain', authenticateJWT, async (req, res) => {
    const { text, context } = req.body;
    if (!text) return res.status(400).json({ error: "No target strings highlighted." });
    try {
        const mockExplanation = `**Simplified Breakdown:** This refers to an atomic execution operation. In layman's terms: imagine it like ordering a single, indivisible combo meal at a restaurant—either you get the whole meal exactly as ordered, or you get absolutely nothing. There is no partial state.`;
        await logAction(req.user.id, 'REQUESTED_AI_EXPLANATION', req);
        res.json({ explanation: mockExplanation });
    } catch (err) {
        res.status(500).json({ error: "LLM Orchestration system timeout." });
    }
});

// --- SANDBOX RUNTIME COMPILER ---
app.post('/api/compiler/execute', authenticateJWT, async (req, res) => {
    const { language, source_code } = req.body;
    await logAction(req.user.id, `COMPILED_${language.toUpperCase()}_CODE`, req);
    res.json({ output: `Execution simulation for ${language} accomplished successfully.\nStandard Output: Process exited with code 0.` });
});

// --- DISCUSSIONS INTERACTION CHANNEL ---
app.get('/api/forum/threads', authenticateJWT, async (req, res) => {
    const threads = await pool.query('SELECT t.*, u.full_name FROM forum_threads t JOIN users u ON t.user_id = u.id ORDER BY t.created_at DESC');
    res.json(threads.rows);
});

app.post('/api/forum/threads', authenticateJWT, async (req, res) => {
    const { title, content } = req.body;
    await pool.query('INSERT INTO forum_threads (user_id, title, content) VALUES ($1, $2, $3)', [req.user.id, title, content]);
    res.sendStatus(201);
});

// --- FACULTY DIRECTORY ROUTE ---
app.get('/api/department/staff', async (req, res) => {
    try {
        const staff = await pool.query("SELECT full_name, academic_rank, email FROM users WHERE role IN ('lecturer', 'admin') ORDER BY academic_rank DESC");
        res.json(staff.rows);
    } catch (err) {
        res.status(500).json({ error: "Could not fetch directory catalog." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔒 Production Server running on Port ${PORT}`));