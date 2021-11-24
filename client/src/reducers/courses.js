import * as actionType from '../constants/actionTypes';


export const courses = (
    state = { 
        isLoading: false, 
        courses: [], 
        isMyCourses: false, 
        isUpdatingCourse: false,
        isDeletingCourse: false,
        isCreatingCourse: false,
        isSearchingCourse: false 
    }, 
    action
) => {
    switch (action.type) {
        case actionType.IS_MY_COURSES:
            return{ ...state, isMyCourses: action.payload }

        case actionType.START_LOADING:
            return{ ...state, isLoading: true }
            
        case actionType.END_LOADING:
            return{ ...state, isLoading: false }

        case actionType.START_UPDATING_COURSE:
            return{ ...state, isUpdatingCourse: true }

        case actionType.END_UPDATING_COURSE:
            return{ ...state, isUpdatingCourse: false }

        case actionType.START_DELETING_COURSE:
            return{ ...state, isDeletingCourse: true }

        case actionType.END_DELETING_COURSE:
            return{ ...state, isDeletingCourse: false }
        
        case actionType.START_CREATING_COURSE:
            return{ ...state, isCreatingCourse: true }
    
        case actionType.END_CREATING_COURSE:
            return{ ...state, isCreatingCourse: false }

        case actionType.START_SEARCHING_COURSE:
            return{ ...state, isSearchingCourse: true }
    
        case actionType.END_SEARCHING_COURSE:
            return{ ...state, isSearchingCourse: false }

        
        case actionType.FETCH_ALL:
            return {
                ...state,
                courses: action.payload.data,
            }

        case actionType.FETCH_BY_SEARCH:
            return  {
                ...state,
                courses: action.payload,
            };

        case actionType.CREATE:
            return { ...state, courses: [...state.courses, action.payload] };


        case actionType.UPDATE:
            return { ...state, courses: state.courses.map((course) => (course.course_id === action.payload.course_id  ? action.payload : course)) };

        case actionType.DELETE:
            return { ...state, courses: state.courses.filter((course) => course.course_id !== action.payload) };

        default:
            return state;
    }
}

