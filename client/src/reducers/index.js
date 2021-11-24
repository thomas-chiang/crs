import { combineReducers } from "redux";
import {courses} from './courses';
import auth  from './auth';
import {courseUsers}  from './courseUsers';


export default combineReducers({
    courses,
    auth,
    courseUsers
})