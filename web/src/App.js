import React from 'react';
import './App.css';
import SideBar from './components/SideBar';
import { makeStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import EmployeePage from './pages/EmployeePage';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  toolbar: theme.mixins.toolbar,
}));

function App() {
  const classes = useStyles();

  return (
    <Router>
      <Grid container spacing={2} >
        <Grid item>
          <SideBar/>
        </Grid>
        <Grid item lg={9} md={8} sm={6}>
          <div className={classes.toolbar}/>
          <Switch>
              <Route exact path="/">
                  <EmployeePage/>
              </Route>
              <Route exact path="/upload">
                  Upload CSV File Component
              </Route>
            </Switch>
        </Grid>
        
      </Grid>
    </Router>
  );
}

export default App;
