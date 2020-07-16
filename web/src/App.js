import React from 'react';
import './App.css';
import SideBar from './components/SideBar';
import { makeStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import EmployeeTable from './components/EmployeeTable';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

function App() {
  const classes = useStyles();

  return (
    <Router>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <SideBar/>
        </Grid>
      </Grid>
      <Switch>
        <Route exact path="/">
          <Container>
            <EmployeeTable/>
          </Container>
        </Route>
        <Route exact path="/upload">
          <Container>
            Upload CSV File Component
          </Container>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
