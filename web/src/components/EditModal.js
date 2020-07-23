import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import api from '../api';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import { InputAdornment } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        outline: 'none',
        padding: theme.spacing(2, 4, 3),
        top: "50%",
        left: "50%",
        transform: `translate(-50%, -50%)`,
    },
    textField: {
        margin: theme.spacing(2),
        width: '25ch'
    }
}));

const EditModal = (props) => {
    const classes = useStyles();
    const [rowData, setRowData] = useState({});

    useEffect(() => {
        setRowData({...props.content});
    }, [props])

    const handleOnSubmit = (rowData) => {
        const updateEmployee = async (rowData) => {
            try {
                const res = await axios.patch(api.updateEmployee(rowData.id), rowData);
                console.log(res);
                if (res.data.results === "User updated successfully!") {
                    alert(res.data.results)                    
                }
            } catch(err) {
                alert(`Unsuccessful update of row: ${err.message}`);
            }
        }
        updateEmployee(rowData);
        props.closeModal();
        return
    }

    const handleOnChange = (event) => {
        const newRow = {...rowData};
        newRow[event.target.id] = event.target.value;
        setRowData({...newRow});
        return
    }

    const handleOnClose = () => {
        props.closeModal();
    }
    
    const body = (
        <Grid className={classes.paper} container spacing={2} alignItems='center'>
            <Grid item xs={12}>
                <Typography variant='h6' align="center">
                    <Box fontWeight="fontWeightBold">
                        {`Edit Employee ${rowData.id}`}
                    </Box>
                </Typography>
            </Grid>
            {Object.keys(rowData).map(key => {
                if (key === 'id') {
                    return
                }
                return (
                    <Grid item className={classes.textField} alignItems='center'>
                        <TextField
                            id={key}
                            onChange={handleOnChange}
                            fullWidth={true}
                            defaultValue={rowData[key]}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        {`${key.toUpperCase()}: `}
                                    </InputAdornment>
                                )
                            }}
                        />                        
                    </Grid>
                );
            })}
            <Grid item xs={4}>
                <Button variant="contained" color="primary" onClick={() => handleOnSubmit(rowData)}>Submit</Button>
            </Grid>
            <Grid item xs={4}/>
            <Grid item xs={4}>
                <Button variant="contained" color="secondary" onClick={handleOnClose}>Close</Button>
            </Grid>
        </Grid>
    );

    return (
        <Modal
            open={props.open}
            onClose={props.closeModal}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            {body}
        </Modal>
    );
}

export default EditModal;