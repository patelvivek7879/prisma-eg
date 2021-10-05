import { Table, Button, Spin, Modal, Menu, Dropdown } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined, DownOutlined } from '@ant-design/icons';
import { fetchEmployeeSuccess } from '../actions';


const { Column } = Table;
const { confirm } = Modal;

const sortByName = (left, right, order)=>{
    if(order=='asc'){
        return left.name.toLowerCase().localeCompare(right.name.toLowerCase());
    }
    if(order=='desc'){
        return right.name.toLowerCase().localeCompare(left.name.toLowerCase());
    }
}

const sortEmployeesByName = (employees, order) => {
        employees.sort((left,right)=>{ return sortByName(left, right, order);});
}

const EmployeeListComponent = ({employees, departments, loading}) => {

    const [page, setPage] = React.useState(1);
    const [sortingOrder, setSortingOrder] = React.useState("asc");
    const [departmentFilter, setDepartmentFilter] = React.useState("");
    const [ filteredEmployees, setFilteredEmployees] = React.useState(employees);


    sortEmployeesByName(employees,"asc");
    const dispatch = useDispatch();

    const sortByNameToggler = () =>{
        if(sortingOrder=='asc'){
            setSortingOrder("desc")
            sortEmployeesByName(employees,"desc");
        }else{
            setSortingOrder("asc");
            sortEmployeesByName(employees,"asc");
        }
    }
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

    const filterByDepartment = (e) =>{
        const deptKey = e.key;
        console.log("Department Key ", deptKey);
        departments.forEach((dept)=>{
            if(dept.id == deptKey){
                setDepartmentFilter(dept.name);
                console.log(dept);
            }
        });
//      setFilteredEmployees(emps);
    } 

    const departmentsMenu = (
        <Menu>
        {
            departments.map((department)=>{
                return(
                <Menu.Item key={department.id} onClick={filterByDepartment}>
                    {department.name}
                </Menu.Item>
                )
            })
        }
    </Menu>
    )
    return (
        <React.Fragment >
            {
                loading ? (
                     <div className="App" style={{ marginTop: 40 }}> <Spin /> </div>) : (
                        <React.Fragment>
                            <b>Filter By Department : </b>
                            <Dropdown overlay={departmentsMenu} >
                                    <Button>
                                         { departmentFilter==="" ? "Select Department" : departmentFilter  }<DownOutlined/>
                                    </Button>
                            </Dropdown>
                    <Table dataSource={employees} style={{ marginTop: 20 }}  pagination={{ onChange(current) { setPage(current) } }}>
                        <Column title="S.No." dataIndex="index" key="index" align="center" render={(text, record, index, key) => (page - 1) * 10 + (index + 1)} />
                        <Column title="Name" dataIndex="name" key="name"  sorter={sortByNameToggler}/>
                        <Column title="Email" dataIndex="email" key="email" sorter={(a,b)=> a.email.localeCompare(b.email)}/>
                        <Column title="Age" dataIndex="age" key="age" align="center"/>
                        <Column title="Edit" dataIndex="edit" key="edit" align="center" render={(text,record) => <Button onClick={()=>{employeeUpdateHandler(record)}} icon={<EditOutlined/>}>Edit</Button>} />
                        <Column title="Delete" dataIndex="delete" key="delete" align="center" render={(text, record, index) => <Button onClick={()=>employeeDeleteHandler(record)} icon={<DeleteOutlined/>}>Delete</Button>} />
                    </Table>
                    </React.Fragment>
                    )
            }
         </React.Fragment>
    )
}

export default EmployeeListComponent;