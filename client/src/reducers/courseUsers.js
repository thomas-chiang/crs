import * as actionType from '../constants/actionTypes';

export const courseUsers = ( 
    state = { 
        courseUsers: [],
        isCreatingCourseUser: false,
        isDeletingCourseUser: false,
        loadingCourseIds: [],
        loadingCourseIdsByCoach: [],
        loadingUserIdsByCoach: []
    }
, 
    action
) => {
    switch (action.type) {

        case actionType.SET_LOADING_USER_ID_COACH:
            return {...state, loadingUserIdsByCoach: [...state.loadingUserIdsByCoach, action.payload] }

        case actionType.UNSET_LOADING_USER_ID_COACH:
            return {...state, loadingUserIdsByCoach: state.loadingUserIdsByCoach.filter((loadingUserId) => loadingUserId !== action.payload) }
        

        case actionType.SET_LOADING_COURSE_ID_COACH:
            return {...state, loadingCourseIdsByCoach: [...state.loadingCourseIdsByCoach, action.payload] }

        case actionType.UNSET_LOADING_COURSE_ID_COACH:
            return {...state, loadingCourseIdsByCoach: state.loadingCourseIdsByCoach.filter((loadingCourseId) => loadingCourseId !== action.payload) }

 
        case actionType.SET_LOADING_COURSE_ID:
            return {...state, loadingCourseIds: [...state.loadingCourseIds, action.payload] }

        case actionType.UNSET_LOADING_COURSE_ID:
            return {...state, loadingCourseIds: state.loadingCourseIds.filter((loadingCourseId) => loadingCourseId !== action.payload) }

        case actionType.FETCH_ALL_CU:
            return {
                ...state,
                courseUsers: action.payload
            }
            

        case actionType.CREATE_CU:
            return {
                ...state,
                courseUsers: action.payload
            }
        case actionType.START_CREATING_COURSE_USER:
            return{ ...state, isCreatingCourseUser: true }
    
        case actionType.END_CREATING_COURSE_USER:
            return{ ...state, isCreatingCourseUser: false }


        case actionType.UPDATE_CU:
            return {
                ...state,
                courseUsers: action.payload
            }


        case actionType.DELETE_CU:
            return {
                ...state,
                courseUsers: action.payload
            }
        case actionType.START_DELETING_COURSE_USER:
            return{ ...state, isDeletingCourseUser: true }
    
        case actionType.END_DELETING_COURSE_USER:
            return{ ...state, isDeletingCourseUser: false }
          
            
        default:
            return state;
    }
}