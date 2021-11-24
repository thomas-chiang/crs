import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import LoadingButton from '@mui/lab/LoadingButton';

import { useSelector } from "react-redux";
import TextField from "@mui/material/TextField";

import Participant from "./Participant/Participant";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

import { createCourseUser } from "../../../../actions/courseUser";
import { useDispatch } from "react-redux";

const Participants = ({ course, socket }) => {


  const { loadingCourseIdsByCoach, loadingUserIdsByCoach } = useSelector((state) => state.courseUsers)
  const course_id = course.course_id;

  const coach = JSON.parse(localStorage.getItem('profile'))?.result.position;
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { courseUsers } = useSelector((state) => state.courseUsers);
  
  const thisCourseUsers = courseUsers.filter(
    (courseUser) => courseUser.course_id === course.course_id
  );
  const thisCourseUsersSortedByTime = thisCourseUsers.sort(function (x, y) {
    return new Date(x.course_user_created_at).getTime() - new Date(y.course_user_created_at).getTime();
  })

  const thisCourseUserNames = thisCourseUsersSortedByTime.map(courseUser=> courseUser.user_name);


  const [courseUserToAdd, setCourseUserToAdd] = useState({
    course_id,
    user_id: '',
    user_name: '',
    coach
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(createCourseUser(courseUserToAdd));
    socket.emit('changeCourseUsers', {
      socketId: socket.id
    })
     
    setCourseUserToAdd({
      ...courseUserToAdd,
      user_name: '',
    }); 
    
  };

  useEffect(( )=>{},[ thisCourseUsersSortedByTime ]);
  

  return (
    <div>
      <Button
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        style={{ textTransform: "none" }}
      >
        Participants
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        {coach && 
        <form
          autoComplete="off"
          onSubmit={handleSubmit}
          style={{
            marginLeft: "10px",
            marginRight: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TextField
            error={thisCourseUserNames.includes(courseUserToAdd.user_name)}
            helperText={thisCourseUserNames.includes(courseUserToAdd.user_name) && 'this name alreay exists'}
            size="small"
            required
            name="user_id"
            variant="outlined"
            id='none'
            type="text"
            label="*add random participant"
            fullWidth
            inputProps={{ style: { fontSize: 12 } }}
            InputLabelProps={{ style: { fontSize: 12 } }}
            value={courseUserToAdd.user_name}
            onChange={(e) =>
              setCourseUserToAdd({ 
                course_id: course.course_id,
                user_id: e.target.value,
                user_name: e.target.value,
                coach
              })
            }
          />
          <div style={{ maxwidth: "5px" }}>
            <LoadingButton 
              loading={loadingCourseIdsByCoach.includes(course_id) && loadingUserIdsByCoach.includes(courseUserToAdd.user_id)}
              disabled={thisCourseUserNames.includes(courseUserToAdd.user_name)}
              type="submit"
            >
              {!(loadingCourseIdsByCoach.includes(course_id) && loadingUserIdsByCoach.includes(courseUserToAdd.user_id)) && 
              (thisCourseUsers.length >= course.course_capacity ?
                <PersonAddIcon style={{ color: "orange", fontSize: "15px" }} />
              :
                <PersonAddIcon style={{ color: "blue", fontSize: "15px" }} />
              )
              } 
            </LoadingButton>
          </div>
        </form>
        }
        


        {thisCourseUsersSortedByTime.map((courseUser) => (
          <Participant socket={socket} course={course} courseUser={courseUser} key={`${courseUser.user_id}+${courseUser.course_id}`} />
        ))}
      </Menu>
    </div>
  );
};


export default Participants;
