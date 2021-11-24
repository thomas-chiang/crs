import * as api from '../api';
import * as actionType from '../constants/actionTypes';


export const getCourseUsers = () => async(dispatch) => {
    
    try {
        const { data } = await api.fetchCourseUsers();

        dispatch({ type: actionType.FETCH_ALL_CU, payload: data})
    } catch (error) {
        console.log(error)
    }    
}

export const createCourseUser = (CUdata) => async(dispatch) => {
    
    try {
        if(CUdata.coach) {
            dispatch({ type: actionType.SET_LOADING_COURSE_ID_COACH, payload: CUdata.course_id})
            dispatch({ type: actionType.SET_LOADING_USER_ID_COACH, payload: CUdata.user_id})

        } else {
            dispatch({ type: actionType.SET_LOADING_COURSE_ID, payload: CUdata.course_id})
        }
        const { data } = await api.createCourseUser(CUdata);
        
        dispatch({ type: actionType.CREATE_CU, payload: data })
        if(CUdata.coach) {
            dispatch({ type: actionType.UNSET_LOADING_COURSE_ID_COACH, payload: CUdata.course_id})
            dispatch({ type: actionType.UNSET_LOADING_USER_ID_COACH, payload: CUdata.user_id})
        } else {
            dispatch({ type: actionType.UNSET_LOADING_COURSE_ID, payload: CUdata.course_id})
        }
    } catch (error) {
        console.log(error)
        if(CUdata.coach) {
            dispatch({ type: actionType.UNSET_LOADING_COURSE_ID_COACH, payload: CUdata.course_id})
            dispatch({ type: actionType.UNSET_LOADING_USER_ID_COACH, payload: CUdata.user_id})
        } else {
            dispatch({ type: actionType.UNSET_LOADING_COURSE_ID, payload: CUdata.course_id})
        }
    }    
}

export const updateCourseUser = (CUdata) => async(dispatch) => {    
    try {
        const { data } = await api.updateCourseUser(CUdata);

        dispatch({ type: actionType.UPDATE_CU, payload: data });
        
    } catch (error) {
        console.log(error)
    }    
} 

export const deleteCourseUser = (CUdata) => async(dispatch) => {
    try {
        if(CUdata.coach) {
            dispatch({ type: actionType.SET_LOADING_COURSE_ID_COACH, payload: CUdata.course_id})
            dispatch({ type: actionType.SET_LOADING_USER_ID_COACH, payload: CUdata.user_id})
        } else {
            dispatch({ type: actionType.SET_LOADING_COURSE_ID, payload: CUdata.course_id})
        }
        
        const { data } = await api.deleteCourseUser(CUdata);

        dispatch({ type: actionType.DELETE_CU, payload: data});
        if(CUdata.coach) {
            dispatch({ type: actionType.UNSET_LOADING_COURSE_ID_COACH, payload: CUdata.course_id})
            dispatch({ type: actionType.UNSET_LOADING_USER_ID_COACH, payload: CUdata.user_id})
        } else {
            dispatch({ type: actionType.UNSET_LOADING_COURSE_ID, payload: CUdata.course_id})
        }
    } catch (error) {
        console.log(error)
        if(CUdata.coach) {
            dispatch({ type: actionType.UNSET_LOADING_COURSE_ID_COACH, payload: CUdata.course_id})
            dispatch({ type: actionType.UNSET_LOADING_USER_ID_COACH, payload: CUdata.user_id})
        } else {
            dispatch({ type: actionType.UNSET_LOADING_COURSE_ID, payload: CUdata.course_id})
        }
    }    
}

