import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Button, TextField, MenuItem } from '@material-ui/core';
import axios from 'axios';
import api from '../api';
import EmployeeTable from '../components/EmployeeTable';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(2),
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
        '& .MuiButton-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));

const EmployeePage = (props) => {
    const classes = useStyles();
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [salary, setSalary] = useState({
        min: 0,
        max: 100000,
    })
    const [order, setOrder] = useState({
        direction: '+',
        value: 'name',
    });

    const pageLimit = 30;

    const fetchData = async (page, salary, order) => {
        const offset = pageLimit * page;
        const sortString = order.direction + order.value;
        const minSalary = (salary.min >= 0) ? salary.min : 0
        const maxSalary = (salary.max >= 0) ? salary.max : 0

        const resp = await axios.get(api.getEmployeesList, {
            params: {
                minSalary: minSalary,
                maxSalary: maxSalary,
                offset: offset,
                limit: pageLimit,
                sort: sortString,
            }
        });
        setData([...resp.data.results]);
    }

    useEffect(() => {
        fetchData(page, salary, order);
    }, []);

    const handleSalaryFilter = (event) => {
        const newSalary = {...salary};
        if (event.target.id === 'min') {
            newSalary.min = Number(event.target.value);
        } else {
            newSalary.max = Number(event.target.value);
        }
        fetchData(page, newSalary, order);
        setSalary(newSalary)
    }

    const handleSortBy = (event) => {
        const newOrder = (event.target.value !== '+' && event.target.value !== '-') ? {
            ...order,
            value: event.target.value   
        } : {
            ...order,
            direction: event.target.value
        }
        fetchData(page, salary, newOrder);
        setOrder({...newOrder});
    }

    const handleNextPage = () => {
        fetchData(page+1, salary, order);
        setPage(page+1);
    }

    const handlePrevPage = () => {
        fetchData(page-1, salary, order);
        setPage(page-1);
    }

    return (
        <Grid className={classes.root} container spacing={2}>
            <Grid container xs={4}>
                <TextField 
                    id="min" 
                    label="Min Salary" 
                    variant="outlined" 
                    defaultValue={salary.min}
                    onChange={handleSalaryFilter}
                    error={(Number(salary.min) >= 0) ? false : true}
                />
            </Grid>
            <Grid container xs={4}>
                <TextField 
                    id="max" 
                    label="Max Salary" 
                    variant="outlined" 
                    defaultValue={salary.max} 
                    onChange={handleSalaryFilter}
                    error={(Number(salary.max) >= 0) ? false : true}
                />
            </Grid>
            <Grid container xs={4}>
                <TextField 
                    select 
                    id="column" 
                    label="Sort by column" 
                    variant="outlined"
                    value={order.value}
                    onChange={handleSortBy}
                >
                    {['id', 'name', 'login', 'salary'].map(item => (
                        <MenuItem key={item} value={item}>
                            {item}
                        </MenuItem>    
                    ))}
                </TextField>
            </Grid>
            <Grid container xs={4}>
                <TextField 
                    select 
                    id="direction" 
                    label="Sort by direction" 
                    variant="outlined"
                    value={order.direction}
                    onChange={handleSortBy}
                >
                    {['+', '-'].map(item => (
                        <MenuItem key={item} value={item}>
                            {item}
                        </MenuItem>    
                    ))}
                </TextField>
            </Grid>
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