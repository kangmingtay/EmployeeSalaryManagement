import React, { useState, useEffect } from 'react';
import { Grid, Button } from '@material-ui/core';
import axios from 'axios';
import api from '../api';
import EmployeeTable from '../components/EmployeeTable';

const EmployeePage = (props) => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);

    const pageLimit = 5;

    const fetchData = async (page) => {
        
        const offset = pageLimit * page;
        const resp = await axios.get(api.getEmployeesList, {
            params: {
                minSalary: 0,
                maxSalary: 100000,
                offset: offset,
                limit: pageLimit,
                sort: "+name",
            }
        });
        setData([...resp.data.results]);
    }

    useEffect(() => {
        fetchData(page);
    }, []);

    const handleNextPage = () => {
        fetchData(page+1);
        setPage(page+1);
        console.log(data)
    }

    const handlePrevPage = () => {
        fetchData(page-1);
        setPage(page-1);
        console.log(data)
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <EmployeeTable rows={data}/>
            </Grid>
            <Grid container xs={6}>
                <Button disabled={(page === 0) ? true : false} onClick={handlePrevPage}>Previous Page</Button>
            </Grid>
            <Grid container xs={6} alignItems='flex-start' justify='flex-end' direction='row'>
                <Button disabled={(data.length === 0) ? true : false} onClick={handleNextPage}>Next Page</Button>
            </Grid>
        </Grid>
    )
}

export default EmployeePage;