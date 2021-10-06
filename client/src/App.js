import './App.css';
import React from 'react';
import axios from 'axios';
import { Tabs, Typography } from 'antd';

import DepartmentListComponent from './components/DepartmentList';
import EmployeeListComponent from './components/EmployeeList';
import SearchBox from './components/SearchBox';

import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import { employeeReducer } from "./reducers/index";

// const getEmployees = () => {
// const p = new Promise((resolve) => {
// fetch("/api/employee")
// .then((response) => {
//   return response.json();
// })
// .then((employees) => {
//  resolve(employees);
// })
// return p;
// })
// }

export const store = createStore(employeeReducer, applyMiddleware(logger));

const {TabPane} = Tabs;
const {Title} = Typography;

const getEmployees = () => {
  return axios.get("/api/employee")
    .then((response) => {
      return response.data;
    })
}

const getDepartments = () =>{
  return axios.get("/api/department/departments")
  .then((response)=>{
    return response.data;
  });
}

const App = () => {
  const [employees, setEmployees] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState("None");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    const emps = getEmployees();
    emps.then((employees) => {
      console.log(employees);
      setEmployees(employees);
      setLoading(false);
    });

    const depts = getDepartments();
    depts.then((departments)=>{
      console.log(departments);
      setDepartments(departments);
    }); 

  }, []);

  const applyFilter = (ev) => {
    if (ev.currentTarget.value.length < 3) {
      setSearchValue("None");
      return;
    }
    setSearchValue(ev.currentTarget.value);
  }

  const filteredEmployees = employees.filter((employee) => {
    if (searchValue === "None") return true;
    return employee.name.toLowerCase().includes(searchValue.toLowerCase());
  });

  const filteredDepartments = departments.filter((department)=>{
    if(searchValue === "None") return true;
    return department.name.toLowerCase().includes(searchValue.toLowerCase());
  })

  return (
  <><div  style={{marginTop: 20, marginLeft: 20 }}>
      <SearchBox onSearch={applyFilter} />
      Filter Applied : {searchValue}
    <Tabs defaultActiveKey="1">
    <TabPane tab="Employee" key="employees">
        <EmployeeListComponent employees={filteredEmployees} loading={loading} departments={departments} />
    </TabPane>
    <TabPane tab="Department" key="departments">
              <DepartmentListComponent departments={filteredDepartments} />
    </TabPane>
    </Tabs>
    </div>
  </>
  );
}

export default App;