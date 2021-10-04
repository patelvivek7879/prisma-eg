import { Table, Button, Spin, Modal } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

import { connect } from 'react-redux';
import { fetchEmployeeSuccess } from '../actions';


const { Column } = Table;
const { confirm } = Modal;



const EmployeeListComponent = ({employees, loading}) => {

    const [page, setPage] = React.useState(1);

    const dispatch = useDispatch();

    // const employeeHandler = (e) => {
    //     let empId = e.currentTarget.getAttribute('id');
    //     employees.forEach((emp) => {
    //         if (empId == emp.id) {
    //             console.log(emp);
    //         }
    //     });
    // }
    
    dispatch(fetchEmployeeSuccess(employees));

    const employeeUpdateHandler = (employee) =>{
    }
    
    const employeeDeleteHandler = (employee) => {
        const empId = employee.id;
        confirm({
            title: "Are you sure ?",
            icon: <ExclamationCircleOutlined />,
            content : <div>
                <b>Employee ID : </b>
                {employee.id}<br/>
                <b>Employee Name : </b>
                {employee.name}</div>,
            okText: 'Delete',
            okType: 'danger',
            onOk(){
                console.log(employee);
            },
            onCancel(){
                console.log("cancel");
            },
        })
    }


    return (
        <React.Fragment >
            {
                loading ? (
                     <div className="App" style={{ marginTop: 40 }}> <Spin /> </div>) : (
                    <Table dataSource={employees} style={{ marginTop: 20 }}  pagination={{ onChange(current) { setPage(current) } }}>
                        <Column title="S.No." dataIndex="index" key="index" align="center" render={(text, record, index, key) => (page - 1) * 10 + (index + 1)} />
                        <Column title="Name" dataIndex="name" key="name"  sorter={true}/>
                        <Column title="Email" dataIndex="email" key="email" />
                        <Column title="Age" dataIndex="age" key="age" align="center"/>
                        <Column title="Edit" dataIndex="edit" key="edit" align="center" render={(text,record) => <Button onClick={()=>{employeeUpdateHandler(record)}} icon={<EditOutlined/>}>Edit</Button>} />
                        <Column title="Delete" dataIndex="delete" key="delete" align="center" render={(text, record, index) => <Button onClick={()=>employeeDeleteHandler(record)} icon={<DeleteOutlined/>}>Delete</Button>} />
                    </Table>
                    )
            }
         </React.Fragment>
    )
}

export default EmployeeListComponent;