import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import EditModal from './EditModal';
import DeleteModal from './DeleteModal';

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';

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
    }, 
}));

const EmployeeTable = (props) => {
    const classes = useStyles();

    const [rowData, setRowData] = useState({})
    const [isEditOpen, setEditOpen] = useState(false);
    const [isDelOpen, setDelOpen] = useState(false);

    const handleEditToggle = (item) => {
        setEditOpen(!isEditOpen);
        setRowData({...item});
        props.setModalOpen(!props.isModalOpen)
    }

    const handleDeleteToggle = (item) => {
        setDelOpen(!isDelOpen)
        setRowData({...item});
        props.setModalOpen(!props.isModalOpen)
    }

    const tableContent = (rows) => {
        if (rows.length !== 0) {
            return (
                <TableBody>
                    {rows.map(item => {
                        return (
                            <TableRow key={item.id} hover>
                                <TableCell align='center'>{item.id}</TableCell>
                                <TableCell align='center'>{item.login}</TableCell>
                                <TableCell align='center'>{item.name}</TableCell>
                                <TableCell align='center'>{item.salary}</TableCell>
                                <TableCell align='center'>
                                    <IconButton color='primary' aria-label="edit row" component="span">
                                        <EditIcon onClick={() => handleEditToggle(item)}/>
                                    </IconButton>
                                    <IconButton color='secondary' aria-label="delete row" component="span">
                                        <DeleteIcon onClick={() => handleDeleteToggle(item)}/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            )
        } else {
            return <Typography align='left' h3>No more items left to fetch</Typography>
        }
    }

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
                <TableHead>
                    <TableRow className={classes.header}>
                        {columns.map(item => {
                            return <TableCell align='center' key={item.id}>{item.label}</TableCell>
                        })}
                    </TableRow>
                </TableHead>
                {tableContent(props.rows)}
                <EditModal open={isEditOpen} closeModal={handleEditToggle} content={rowData}/>
                <DeleteModal open={isDelOpen} closeModal={handleDeleteToggle} content={rowData}/>
            </Table>
        </TableContainer>
    )
}

export default EmployeeTable;