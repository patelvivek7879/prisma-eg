import './App.css';
import React from 'react';
import axios from 'axios';
import { Table, Input, Spin, Button, Tabs } from 'antd';
import { BrowserRouter as Router, Link, Switch, Route } from 'react-router-dom';

import DepartmentListComponent from './components/DepartmentList';
import EmployeeListComponent from './components/EmployeeList';
import SearchBox from './components/SearchBox';

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

const {TabPane} = Tabs;

const getEmployees = () => {
  return axios.get("/api/employee")
    .then((response) => {
      return response.data;
    })
}

const App = () => {
  const [employees, setEmployees] = React.useState([]);
  const [searchWhat, setSearchCriteria] = React.useState("None");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    const p = getEmployees();
    p.then((employees) => {
      console.log(employees);
      setEmployees(employees);
      setLoading(false);
    })
  }, []);

  const applyFilter = (ev) => {
    if (ev.currentTarget.value.length < 3) {
      setSearchCriteria("None");
      return;
    }
    setSearchCriteria(ev.currentTarget.value);
  }

  const filteredEmployees = employees.filter((employee) => {
    if (searchWhat === "None") return true;
    return employee.name.toLowerCase().includes(searchWhat.toLowerCase());
  });

  return (
  <><div  style={{marginTop: 20, marginLeft: 20 }}>
      <SearchBox onSearch={applyFilter}/>
      Filter Applied : {searchWhat}
       <Tabs defaultActiveKey="1">
    <TabPane tab="Employee" key="employees">
        <EmployeeListComponent employees={filteredEmployees} loading={loading} />
    </TabPane>
    <TabPane tab="Department" key="departments">
              <DepartmentListComponent />
    </TabPane>
    </Tabs>
    </div>
  </>
  );
}

export default App;