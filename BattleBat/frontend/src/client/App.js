import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link
} from 'react-router-dom';
import './app.css';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import { withStyles } from "@material-ui/core/styles/index";
import Album from './components/Album';
import NotFound from './components/NotFound';
import BattleAdd from './components/BattleAdd';
import Battles from './components/Battles';
import Battle from './components/Battle';
import Users from './components/Users';
import User from './components/User';
import Encounter from './components/Encounter';

const styles = theme => ({
    root: {
        display: 'flex',
    },
    title: {
        flexGrow: 1,
    },
    h5: {
        marginBottom: theme.spacing.unit * 2,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
        height: '100vh',
        overflow: 'auto',
    }
});

class App extends Component {
  state = { username: null };

  componentDidMount() {
    fetch('/api/getUsername')
      .then(res => res.json())
      .then(user => this.setState({ username: user.username }));
  }

  render() {
    const { classes } = this.props;

    return (
      <Router>

        <div className={classes.root}>
            <Sidebar open={this.state.open} />
            <main className={classes.content}>
                <Switch>
                  <Route exact path="/" component={Dashboard} />
                  <Route exact path="/dashboard" component={Dashboard} />
                  <Route exact path="/battle-anlegen" component={BattleAdd} />
                  <Route exact path="/battles/" component={Battles} />
                  <Route path="/battles/:id/encounter" component={Encounter} />
                  <Route path="/battles/:id" component={Battle} />
                  <Route exact path="/users/" component={Users} />
                  <Route path="/users/:id" component={User} />
                  <Route component={NotFound} />
                </Switch>
            </main>
        </div>
      </Router>

    );
  }
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
