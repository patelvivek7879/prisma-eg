import React from 'react';
import {Table} from 'antd';

const { Column } = Table;

const DepartmentListComponent = ({departments}) =>{
    return(
      <>
         <Table dataSource={departments} style={{ marginTop: 20 }} rowKey={ dept => dept.id}>
                        <Column title="S.No." dataIndex="index" key="index" render={(text, record, index, key) => index + 1} />
                        <Column title="Name" dataIndex="name" key="name" />
                        <Column title="Department ID" dataIndex="id" key="id" />
            </Table>
      </>
    )
  }

export default DepartmentListComponent;