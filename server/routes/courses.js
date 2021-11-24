const express = require("express");
const router = express.Router();
const pool = require("../db.js");

const auth = require("../middleware/auth.js");

const { emailService } = require("../services");


router.get('/', async (req, res) => {
    try {
        const allCourses = await pool.query("SELECT * FROM courses");

        const sortedCourses = allCourses.rows.sort(function (x, y) {
            return new Date(x.course_time).getTime() - new Date(y.course_time).getTime();
        });

        res.status(200).json({ data: sortedCourses });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }}
);

router.get('/search', async (req, res) => {
    const { courseName, coach, time, fromTime, toTime } = req.query;
    
    try {
        
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
        const searchedCourses = await pool.query(
            `  
            SELECT 
                *
            FROM 
                (SELECT *, TO_CHAR(course_time AT TIME ZONE $1, 'MM/DD HH12:MI AM') AS time FROM courses) AS x 
            WHERE LOWER(x.course_name) LIKE LOWER($2)
                AND LOWER(x.coach) LIKE LOWER($3)
                AND LOWER(x.time) LIKE LOWER($4)
                AND x.course_time BETWEEN $5 AND $6
            `,
            [timeZone, '%'+courseName+'%', '%'+coach+'%', '%'+time+'%', fromTime, toTime]
        );
        const sortedCourses = searchedCourses.rows.sort(function (x, y) {
            return new Date(x.course_time).getTime() - new Date(y.course_time).getTime();
        });

        res.status(200).json(sortedCourses);

    } catch (error) {
        res.status(404).json(error);
    }}
);


router.post('/', auth, async (req, res) => {
    try {
        const { course_name, coach, course_time, course_capacity, course_signup_time, quit_deadline } = req.body;
        const createdCourse = await pool.query(
            "INSERT INTO courses (course_name, course_creator, course_time, course_capacity, course_signup_time, coach, quit_deadline) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [ course_name, req.userId, course_time, course_capacity, course_signup_time, coach, quit_deadline]);
        res.status(201).json(createdCourse.rows[0]);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }}
);

router.patch('/:course_id', async (req, res) => {
     const { course_id } = req.params;
    const selectedCourse = await pool.query("SELECT * FROM courses WHERE course_id = $1", [course_id]);
    if (selectedCourse.rows.length === 0) return res.status(404).send('no course with the id');
      try {
            const { course_id } = req.params;
            const { course_name, course_creator, course_time, course_capacity, course_signup_time, quit_deadline, coach } = req.body;
            const updatedCourse = await pool.query(
                `UPDATE courses SET course_name = $1, course_creator = $2, course_time = $3, course_capacity = $4, course_signup_time = $5, quit_deadline = $6, coach= $8 WHERE course_id = $7 RETURNING *`, 
                [ course_name, course_creator, course_time, course_capacity, course_signup_time, quit_deadline, course_id, coach ]);
            
            const selectedCourseInfo = updatedCourse.rows[0]

            const  cusRows = await pool.query(
                "SELECT * FROM course_user WHERE course_id = $1",
                [ course_id ]);

            const cusInfo = cusRows.rows;

            if(cusInfo) {
                for (let i = 0; i < cusInfo.length; i++) {
                    const userRows = await pool.query("SELECT * FROM users WHERE user_id = $1", [cusInfo[i].user_id]);
                    const user = userRows.rows[0];
                    if (user) {
                        await emailService.sendCourseUpdatingEmail(user, selectedCourseInfo)
                    }
                }
            }
            
            
            
                res.json(updatedCourse.rows[0]);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }
);

router.delete('/:course_id', async (req, res) => {
    const { course_id } = req.params;
    const selectedCourse = await pool.query("SELECT * FROM courses WHERE course_id = $1", [course_id]);
    if (selectedCourse.rows.length === 0) return res.status(404).send('no course with the id');
        try {
            const { course_id } = req.params;
           
            const selectedCourseInfoRows = await pool.query("SELECT * FROM courses WHERE course_id = $1", [course_id]);
            const selectedCourseInfo = selectedCourseInfoRows.rows[0]

            const  cusOfCourse = await pool.query(
                "SELECT * FROM course_user WHERE course_id = $1",
                [ course_id ]);

            const cusInfo = cusOfCourse.rows;

            if(cusInfo) {
                for (let i = 0; i < cusInfo.length; i++) {
                    const userRows = await pool.query("SELECT * FROM users WHERE user_id = $1", [cusInfo[i].user_id]);
                    const user = userRows.rows[0];
                    if (user) {
                        await emailService.sendCourseCancelingEmail(user, selectedCourseInfo)
                    }
                }
            }

            await pool.query(
                `DELETE FROM course_user WHERE course_id = $1 RETURNING *`,
                [course_id]
            );


            const deletedCourse = await pool.query(
               "DELETE FROM courses WHERE course_id = $1 RETURNING *", 
               [ course_id ]);

            res.json(deletedCourse.rows[0]);
        } catch (error) {
           res.status(404).json({ message: error.message });
        }
   }
);

module.exports = router;