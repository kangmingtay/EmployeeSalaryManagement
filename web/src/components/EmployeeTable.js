import React, { useState, useEffect, forwardRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import {AddBox, Check, Clear, ChevronLeft, ChevronRight, DeleteOutline, Edit, FirstPage, LastPage, Search }from '@material-ui/icons';
import axios from 'axios';
import api from '../api';
import Container from '@material-ui/core/Container';


const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
}

const EmployeeTable = (props) => {
    const [columns, setColumns] = useState([
        {title: 'Employee ID', field: 'id', defaultSort: 'asc'},
        {title: 'Name', field: 'name', defaultSort: 'asc'},
        {title: 'Login', field: 'login', defaultSort: 'asc'},
        {
            title: 'Salary', 
            field: 'salary',
            defaultSort: 'asc',
            customSort: (a, b) => {
                return Number(a.salary) - Number(b.salary);
            }
        },
    ]);

    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async() => {
            const resp = await axios.get(api.getEmployeesList, {
                params: {
                    minSalary: 0,
                    maxSalary: 100000,
                    offset: 0,
                    limit: 30,
                    sort: "+name",
                }
            });
            console.log(resp.data.results)
            setData([...resp.data.results]);
        }
        fetchData();
    }, [])


    return (
        <MaterialTable
            style={{
                margin: "10px"
            }}
            title="Employees"
            columns={columns}
            data={data}
            icons={tableIcons}
            options={{
                pageSize: 5,
                pageSizeOptions: []
            }}
            editable={{
                onRowAdd: newData =>
                new Promise((resolve, reject) => {
                    setTimeout(() => {
                    setData([...data, newData]);
                    
                    resolve();
                    }, 1000)
                }),
                onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                    setTimeout(() => {
                    const dataUpdate = [...data];
                    const index = oldData.tableData.id;
                    dataUpdate[index] = newData;
                    setData([...dataUpdate]);

                    resolve();
                    }, 1000)
                }),
                onRowDelete: oldData =>
                new Promise((resolve, reject) => {
                    setTimeout(() => {
                    const dataDelete = [...data];
                    const index = oldData.tableData.id;
                    dataDelete.splice(index, 1);
                    setData([...dataDelete]);
                    
                    resolve()
                    }, 1000)
                }),
            }}
        />
    )
}

export default EmployeeTable;