import './App.css';
import React from 'react';
import axios from 'axios';

//const getEmployees = () => {
  //const p = new Promise((resolve) => {
    // fetch("/api/employee",{
    // ).then((response) => {
    //   return response.json();
    // })
    // .then((employees) => {
    //  resolve(employees);
    // })
  //return p;
//}

const getEmployees = () =>{
   return axios.get("/api/employee")
    .then((response)=> {
      return response.data;
    })
  }

const App = () => {
  const [employees, setEmployees] = React.useState([]);

  React.useEffect(()=>{
    const p = getEmployees();
  p.then((employees) => {
    console.log(employees);
    setEmployees(employees);
  })   
  },[]);
  return ( 
  <div className = "App" >
    <h1>Employees</h1>
    <EmployeeListComponent employees={employees}/>
  </div>
  );
}

const EmployeeListComponent = ({employees}) => {
  return ( 
    <React.Fragment >
    <ul> 
    {
      employees.map((employee) => {
        return(
        <li key = {
            employee.id
          } > {
            employee.name
          } 
          </li>
        )
      })
    } 
    </ul>
    </React.Fragment>
  )
}

export default App;