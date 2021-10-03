import * as CONST from "../types";
const initialState = {
    employees: []
};

export const employeeReducer = (state = initialState, action) =>{
    switch(action.type){
        case CONST.EMPLOYEE_LIST_SUCCESS:
        return {
            ...state,
            employees: action.payload
        }
        default: return state;
    }
}