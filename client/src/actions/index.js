import * as CONST from "../types/index";


export function fetchEmployeeSuccess(employees){
    //get employees here

    return{
        type: CONST.EMPLOYEE_LIST_SUCCESS,
        payload: employees
    }
}

