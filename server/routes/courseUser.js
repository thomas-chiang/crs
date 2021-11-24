const express = require("express");
const router = express.Router();
const pool = require("../db.js");

const auth = require("../middleware/auth.js");

const { emailService } = require("../services");



router.get('/', async (req, res) => {
    try {
        const allCourseUserData = await pool.query(
            `SELECT * FROM course_user`
        );
        res.status(200).json(allCourseUserData.rows);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }}
);

router.post('/', async (req, res) => { 

    const { course_id, user_id } = req.body;
    const query_inputCourseUser = await pool.query(
        "SELECT * FROM course_user WHERE user_id = $1 AND course_id = $2",
        [ user_id, course_id ]
    );
    if (query_inputCourseUser.rows.length !== 0) { return res.status(404).json({ message: 'Course user already exists'}); } 

    try {
        const { course_id, user_id, user_name  } = req.body;
    
        const query_course_capacity = await pool.query(
            `SELECT course_capacity FROM courses WHERE course_id = $1`,
            [ course_id ]
        )
        const course_capacity = query_course_capacity.rows[0].course_capacity

        const query_course_users = await pool.query(
            `SELECT * FROM course_user WHERE course_id = $1`,
            [ course_id ]
        )
        const numberOfCourseUser = query_course_users.rows.length
        
        let is_waiting = numberOfCourseUser >= course_capacity;

        const query_createdCourseUser = await pool.query(
            "INSERT INTO course_user (course_id, user_id, user_name, is_waiting) VALUES ($1, $2, $3, $4) RETURNING *",
            [ course_id, user_id, user_name, is_waiting]
        ); 
        
        const allCourseUserData = await pool.query(
            `SELECT * FROM course_user`
        );
        res.status(200).json(allCourseUserData.rows);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }}
);


router.delete('/', async (req, res) => {  
    try {
        const { course_id, user_id  } = req.body;
        

        const query_course_users = await pool.query(
            `SELECT * FROM course_user WHERE course_id = $1`,
            [ course_id ]
        );

    

        const userIsWaiting = query_course_users.rows.filter(user => user.user_id === user_id)[0].is_waiting;
        

        const courseUsersSortedByTime = query_course_users.rows.sort(function (x, y) {
            return new Date(x.course_user_created_at).getTime() - new Date(y.course_user_created_at).getTime();
        })
        const nextUserIsWaiting = courseUsersSortedByTime[courseUsersSortedByTime.findIndex(user => user.user_id !== user_id && user.is_waiting)]?.is_waiting
        const nextUserId = courseUsersSortedByTime[courseUsersSortedByTime.findIndex(user => user.user_id !== user_id && user.is_waiting)]?.user_id
        

        if(!userIsWaiting && nextUserIsWaiting) {

            const query_course = await pool.query(
                `SELECT * FROM courses WHERE course_id = $1`,
                [ course_id ]
            )
            const course = query_course.rows[0]

            const query_user = await pool.query(
                `SELECT * FROM users WHERE user_id = $1`,
                [ nextUserId ]
            )
            const nextUser = query_user.rows[0]

            if (nextUser) await emailService.sendMakeIntoClassEmail(nextUser, course)
        } 

        const updatedNextUserIsWaiting = !(!userIsWaiting && nextUserIsWaiting)

        
        await pool.query(
            `UPDATE course_user SET is_waiting = $1 WHERE course_id = $2 AND user_id = $3 RETURNING *`, 
            [ updatedNextUserIsWaiting, course_id, nextUserId ]
        );


        await pool.query(
            "DELETE FROM course_user WHERE course_id = $1 AND user_id = $2 RETURNING *", 
            [ course_id, user_id ]
        ); 
    
        
        const allCourseUserData = await pool.query(
            `SELECT * FROM course_user`
        );


        res.status(200).json(allCourseUserData.rows);
    } catch (error) {
          res.status(404).json({ message: error.message });
    }
});

router.patch('/', async (req, res) => {
    try {
        const { user_id, course_id, is_waiting } = req.body;
        await pool.query(
            `UPDATE course_user SET is_waiting = $1 WHERE course_id = $2 AND user_id = $3 RETURNING *`, 
            [ is_waiting ,course_id, user_id ]
        );

        const  query_course = await pool.query(
            "SELECT * FROM courses WHERE course_id = $1",
            [ course_id]
        );
        const course = query_course.rows[0];

        const query_user = await pool.query(
            "SELECT * FROM user WHERE user_id = $1",
            [ user_id]
        );
        const user = query_user.rows[0];

        if (user && course && is_waiting === false) {
            await emailService.sendMakeIntoClassEmail(user, course) 
        } else if (user && course && is_waiting === true) {
            await emailService.sendDegradedToRsvpEmail(user, course)
        }

        const allCourseUserData = await pool.query(
            `SELECT * FROM course_user`
        );
        res.status(200).json(allCourseUserData.rows); 
    } catch (error) {
        res.status(404).json({ message: error.message });
    }}
);


module.exports = router;