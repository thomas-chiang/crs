import * as api from '../api';
import * as actionType from '../constants/actionTypes';


export const getCourses = () => async(dispatch) => {
    
    try {
        dispatch({ type: actionType.START_LOADING })
        const { data } = await api.fetchCourses();

        dispatch({ type: actionType.FETCH_ALL, payload: data})
        dispatch({ type: actionType.END_LOADING })
    } catch (error) {
        console.log(error)
        dispatch({ type: actionType.END_LOADING })
    }    
}

export const createCourse = (formdata, history) => async(dispatch) => {
    
    try {
        dispatch({ type: actionType.START_CREATING_COURSE })
        const { data } = await api.createCourse(formdata);
        

        dispatch({ type: actionType.CREATE, payload: data})
        dispatch({ type: actionType.END_CREATING_COURSE })
    } catch (error) {
        console.log(error)
        dispatch({ type: actionType.END_CREATING_COURSE })
    }    
}

export const updateCourse = (courseId, courseData) => async(dispatch) => {
    
    try {
        dispatch({ type: actionType.START_UPDATING_COURSE })
        const { data } = await api.updateCourse(courseId, courseData);

        dispatch({ type: actionType.UPDATE, payload: data});
        dispatch({ type: actionType.END_UPDATING_COURSE })
    } catch (error) {
        console.log(error)
        dispatch({ type: actionType.END_UPDATING_COURSE })
    }    
}

export const deleteCourse = (courseId) => async(dispatch) => {
    
    try {
        dispatch({ type: actionType.START_DELETING_COURSE })
        await api.deleteCourse(courseId);

        dispatch({ type: actionType.DELETE, payload: courseId});
        dispatch({ type: actionType.END_DELETING_COURSE })
        
    } catch (error) {
        console.log(error)
        dispatch({ type: actionType.END_DELETING_COURSE })
    }    
}

export const getCoursesBySearch = (searchQuery) => async (dispatch) => {
    try {
        dispatch({ type: actionType.START_LOADING });
        dispatch({ type: actionType.START_SEARCHING_COURSE });
        const { data } = await api.fetchCoursesBySearch(searchQuery);
        
        dispatch({ type: actionType.FETCH_BY_SEARCH, payload: data });
        dispatch({ type: actionType.END_SEARCHING_COURSE });
        dispatch({ type: actionType.END_LOADING })
    } catch (error) {
        console.log(error);
        dispatch({ type: actionType.END_SEARCHING_COURSE });
        dispatch({ type: actionType.END_LOADING })
    }
};
