import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import axios from 'axios';
import api from '../api';

const useStyles = makeStyles((theme) => ({
  root: {
      margin: theme.spacing(2),
  },
  button: {
      margin: theme.spacing(2),
      backgroundColor: theme.palette.grey[300]
  }
}));

const UploadFilePage = (props) => {
    const classes = useStyles();
    const hiddenFileInput = React.useRef(null);

    const handleFileUpload = (file) => {
        console.log(file)
        
        const postFile = async (file) => {
            try {
                if (file.type !== "text/csv") {
                    throw new Error("Wrong file type! Only CSV files are allowed!");
                }
                const formData = new FormData();
                formData.append('file', file)
                const res = await axios.post(api.uploadFile, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                });
                if (res.data.success === true) {
                    alert(`File uploaded: ${res.data.message}`);
                } else {
                    alert(`Unsuccessful at uploading file: ${res.data.message}`);
                }
            } catch(err) {
                alert(`Unexpected Error occured: ${err.message}`);
            }
        }
        postFile(file);
    }
  
    const handleClick = event => {
        hiddenFileInput.current.click();
    };
    const handleChange = event => {
        const fileUploaded = event.target.files[0];
        handleFileUpload(fileUploaded);
    };
    return (
        <>
            <Button className={classes.button} onClick={handleClick} size='large'>
                Upload your file here!
            </Button>
            <input
                type="file"
                ref={hiddenFileInput}
                onChange={handleChange}
                style={{display: 'none'}}
            />
        </>
    );   
}

export default UploadFilePage;