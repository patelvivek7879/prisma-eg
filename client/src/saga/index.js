import { application } from 'express';
import { put, call, takeLatest } from 'redux-saga/effects';

import { fetchEmployeeSuccess } from "../actions";
import { api } from "../utils/fetch-data";

export function* fetchEmployeesList(action){
    try{
        const response = yield application.get('/api/employees');
        console.log(response);
    }catch(error){
        console.log("Saga error " , error);
    }
}