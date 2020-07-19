import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

const columns = [
    {id: 'id', label: 'Employee ID'},
    {id: 'login', label: 'Login'},
    {id: 'name', label: 'Name'},
    {id: 'salary', label: 'Salary'},
    {id: 'actions', label: 'Actions'}
];

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    header: {
        backgroundColor: theme.palette.grey[200],
    }
}));

const tableContent = (rows) => {
    if (rows.length !== 0) {
        return (
            <TableBody>
                {rows.map(item => {
                    return (
                        <TableRow key={item.id} hover>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>{item.login}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.salary}</TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        )
    } else {
        return <Typography align='left' h3>No more items left to fetch</Typography>
    }
}

const EmployeeTable = (props) => {
    const classes = useStyles();

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
                <TableHead>
                    <TableRow className={classes.header}>
                        {columns.map(item => {
                            return <TableCell key={item.id}>{item.label}</TableCell>
                        })}
                    </TableRow>
                </TableHead>
                {tableContent(props.rows)}
            </Table>
        </TableContainer>
    )
}

export default EmployeeTable;