import { Table, Button, Spin, Modal } from 'antd';
import React from 'react';
const { Column } = Table;

//{ employees, loading }
const EmployeeListComponent = ({employees, loading}) => {

    const [page, setPage] = React.useState(1);
    const employeeHandler = (e) => {
        let empId = e.currentTarget.getAttribute('id');
        employees.forEach((emp) => {
            if (empId == emp.id) {
                console.log(emp);
            }
        });
    }
    
    const employeeUpdateHandler = (employee) =>{

        console.log(employee);
    }
    
    const employeeDeleteHandler = (employee) => {
        const empId = employee.id;
        console.log(employee);
    }


    return (
        <React.Fragment >
            {
                loading ? (
                     <div className="App" style={{ marginTop: 40 }}> <Spin /> </div>) : (
                    <Table dataSource={employees} style={{ marginTop: 20 }} pagination={{ onChange(current) { setPage(current) } }} >
                        <Column title="S.No." dataIndex="index" key="index" render={(text, record, index, key) => (page - 1) * 10 + (index + 1)} />
                        <Column title="Name" dataIndex="name" key="name" />
                        <Column title="Email" dataIndex="email" key="email" />
                        <Column title="Age" dataIndex="age" key="age" />
                        <Column title="Edit" dataIndex="edit" key="edit" render={(text,record) => <Button onClick={()=>{employeeUpdateHandler(record)}}>Edit</Button>} />
                        <Column title="Delete" dataIndex="delete" key="delete" render={(text, record, index) => <Button onClick={()=>employeeDeleteHandler(record)}>Delete</Button>} />
                    </Table>
                    )
            }
         </React.Fragment>
    )
}

export default EmployeeListComponent;