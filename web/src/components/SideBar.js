import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';


const useStyles = makeStyles((theme) => ({
    drawerPaper: {
      width: 'inherit',
    },
    link: {
      textDecoration: 'none',
      color: theme.palette.text.primary,
    }
}));

const SideBar = () => {
    const classes = useStyles();
    return (
        <Drawer
            style={{width: '200px'}}
            variant='persistent'
            anchor='left'
            open={true}
            classes={{ paper: classes.drawerPaper }}
        >
            <List>
            <Link to="/" className={classes.link}>
                <ListItem button>
                <ListItemIcon>
                    <HomeIcon/>
                </ListItemIcon>
                <ListItemText primary={"Home"}/>
                </ListItem>
            </Link>
            <Link to="/upload" className={classes.link}>
                <ListItem button>
                <ListItemIcon>
                    <CloudUploadIcon/>
                </ListItemIcon>
                <ListItemText primary={"Upload File"}/>
                </ListItem>
            </Link>
            </List>
        </Drawer>
    )
};

export default SideBar;