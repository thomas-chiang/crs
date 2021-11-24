const cron = require("node-cron");
const pool = require("./db.js");

cron.schedule('* * * * *', async () => {
    await pool.query(
        `DELETE FROM course_user WHERE course_id in (
            SELECT course_id FROM courses WHERE course_time < now() - INTERVAL '1 DAY'
        ) RETURNING *
        `
    );

    await pool.query(
        `DELETE FROM courses WHERE course_time < now() - INTERVAL '1 DAY'`
    );
});