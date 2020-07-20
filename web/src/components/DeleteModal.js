import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import api from '../api';
import axios from 'axios';

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
  buttonYes: {
    backgroundColor: theme.palette.success.light,
    margin: theme.spacing(2),
  },
  buttonNo: {
    backgroundColor: theme.palette.error.light,
    margin: theme.spacing(2),
  }
}));

const DeleteModal = (props) => {
    const classes = useStyles();
    const [rowData, setRowData] = useState({});

    useEffect(() => {
        setRowData({...props.content});
    }, [props])

    const handleOnSubmit = (rowData) => {
        const deleteEmployee = async (id) => {
            try {
                const res = await axios.delete(api.deleteEmployee(id));
                console.log(res);
                if (res.data.message === `User ${id} has been deleted successfully!`) {
                    alert(res.data.message);
                }
            } catch(err) {
                alert(`User ${id} could not be deleted: ${err.message}`);
            }
        }
        deleteEmployee(rowData.id);
        return props.closeModal();
    }

    const handleOnClose = () => {
        props.closeModal();
    }
    
    const body = (
        <Grid container className={classes.paper} spacing={3}>
            <Grid xs={12}>
                <Typography variant='h6' align="center">
                    <Box fontWeight="fontWeightBold">
                        {`Are you sure you want to delete ${rowData.id}?`}
                    </Box>
                </Typography>
            </Grid>
            <Grid xs={4}>
                <Button className={classes.buttonYes} onClick={() => handleOnSubmit(rowData)}>Yes</Button>
            </Grid>
            <Grid xs={4}/>
            <Grid xs={4}>
                <Button className={classes.buttonNo} onClick={handleOnClose}>No</Button>
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

export default DeleteModal;