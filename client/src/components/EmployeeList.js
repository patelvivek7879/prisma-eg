import { Table, Button, Spin, Modal, Menu, Dropdown, Input, Form, InputNumber } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined, DownOutlined } from '@ant-design/icons';
import { fetchEmployeeSuccess } from '../actions';
import axios from 'axios';



const { Column } = Table;
const { confirm } = Modal;

const sortByName = (left, right, order) => {
    if (order == 'asc') {
        return left.name.toLowerCase().localeCompare(right.name.toLowerCase());
    }
    if (order == 'desc') {
        return right.name.toLowerCase().localeCompare(left.name.toLowerCase());
    }
}

const sortEmployeesByName = (employees, order) => {
    employees.sort((left, right) => { return sortByName(left, right, order); });
}

const EmployeeListComponent = ({ employees, departments, loading }) => {

    const [page, setPage] = React.useState(1);
    const [sortingOrder, setSortingOrder] = React.useState("asc");
    const [departmentFilter, setDepartmentFilter] = React.useState("");
    const [filteredEmployees, setFilteredEmployees] = React.useState(employees);
    const [isEmployeeAdd, setIsEmployeeAdd] = React.useState(false);
    const [form] =Form.useForm();

    sortEmployeesByName(employees, "asc");
    const dispatch = useDispatch();

    const sortByNameToggler = () => {
        if (sortingOrder == 'asc') {
            setSortingOrder("desc")
            sortEmployeesByName(employees, "desc");
        } else {
            setSortingOrder("asc");
            sortEmployeesByName(employees, "asc");
        }
    }
    dispatch(fetchEmployeeSuccess(employees));

    const employeeUpdateHandler = (employee) => {
    }

    const deleteEmployee = (empId) =>{
        axios.delete(`/api/employee/deleteEmployee/${empId}`)
       .then(response => console.log(response))
       .catch(error => console.log(error))
    }

    const employeeDeleteHandler = (employee) => {
        const empId = employee.id;
        confirm({
            title: "Are you sure ?",
            icon: <ExclamationCircleOutlined />,
            content: <div>
                <b>Employee ID : </b>
                {employee.id}<br />
                <b>Employee Name : </b>
                {employee.name}</div>,
            okText: 'Delete',
            okType: 'danger',
            onOk() {
                deleteEmployee(empId);
            },
            onCancel() {
                console.log("cancel");
            },
        })
    }

    const filterByDepartment = (e) => {
        const deptKey = e.key;
        console.log("Department Key ", deptKey);
        departments.forEach((dept) => {
            if (dept.id == deptKey) {
                setDepartmentFilter(dept.name);
                console.log(dept);
            }
        });
        //      setFilteredEmployees(emps);
    }

    const departmentsMenu = (
        <Menu>
            {
                departments.map((department) => {
                    return (
                        <Menu.Item key={department.id} onClick={filterByDepartment}>
                            {department.name}
                        </Menu.Item>
                    )
                })
            }
        </Menu>
    )

    const addEmployee=()=>{
        setIsEmployeeAdd(true);
    }
    const addEmployeeCancle =() =>{
        setIsEmployeeAdd(false);
    }
    const headers = {
        "Accept-Type": "application/json",
        "Content-Type": "application/json"
    }
    const addEmployeeOk = (employee) =>{

        axios({
            method: 'POST',
            url: '/api/employee/addEmployee',
            data: employee,
            headers: headers
        })
//        axios.post("/api/employee/addEmployee", employee, headers)
        .then(response => console.log(response))
        .catch((response)=>{
            console.log(response);
        });
        setIsEmployeeAdd(false);
    }
    return (
        <React.Fragment >
            {
                loading ? (
                    <div className="App" style={{ marginTop: 40 }}> <Spin /> </div>) : (
                    <React.Fragment>
                        <div>
                             <Button type="primary" onClick={addEmployee}>+ Add </Button>
                        <span style={{float: 'right'}}>
                        <b>Filter By Department : </b>
                        <Dropdown overlay={departmentsMenu} >
                            <Button>
                                {departmentFilter === "" ? "Select Department" : departmentFilter}<DownOutlined />
                            </Button>
                        </Dropdown>
                        </span>
                        </div>
                        <Table dataSource={employees} style={{ marginTop: 20 }} bordered pagination={{ defaultPageSize: 10,showSizeChanger:true, onChange(current) { setPage(current)}}} rowKey={emp => emp.id}> 
                            <Column title="S.No." dataIndex="index" key="index" align="center" render={(text, record, index, key) => (page - 1) * 10 + (index + 1)} />
                            <Column title="Name" dataIndex="name" key="name" sorter={sortByNameToggler} />
                            <Column title="Email" dataIndex="email" key="email" sorter={(a, b) => a.email.localeCompare(b.email)} />
                            <Column title="Age" dataIndex="age" key="age" editable={true} align="center" />
                            <Column title="Edit" dataIndex="edit" key="edit" align="center" render={(text, record) => <Button onClick={() => { employeeUpdateHandler(record) }} icon={<EditOutlined />}>Edit</Button>} />
                            <Column title="Delete" dataIndex="delete" key="delete" align="center" render={(text, record, index) => <Button onClick={() => employeeDeleteHandler(record)} icon={<DeleteOutlined />}>Delete</Button>} />
                        </Table>
                        <Modal 
                        title="Add Employee" 
                        visible={isEmployeeAdd}
                        onOk={form.submit}
                        onCancel={addEmployeeCancle}
                        >
                            <Form form={form} onFinish={addEmployeeOk}>
                                <Form.Item 
                                label="Full Name"
                                name="name"
                                rules={[{require: true, message: "Please enter full name"}]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item label="Email" name="email" rules={[{require: true, message: "Email is required!"}]}>
                                    <Input/>
                                </Form.Item>
                                <Form.Item label="Age" name="age" >
                                    <InputNumber />
                                </Form.Item>
                                <Form.Item label="Department ID" name="deptId">
                                    <InputNumber />
                                </Form.Item>
                            </Form>
                        </Modal>
                    </React.Fragment>
                )
            }
        </React.Fragment>
    )
}

export default EmployeeListComponent;