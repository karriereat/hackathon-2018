import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from "@material-ui/core/styles/index";
import UsersAPI from '../api';
import { Link } from 'react-router-dom';
import Card from '@material-ui/core/Card/Card';
import CardActionArea from '@material-ui/core/CardActionArea/CardActionArea';
import CardContent from '@material-ui/core/CardContent/CardContent';
import Button from '@material-ui/core/Button';
import Config from '../config';



const styles = theme => ({
  appBarSpacer: theme.mixins.toolbar,
  card: {
    minWidth: 275,
    marginBottom: 10
  },
  backButton: {
    textAlign: 'left',
    paddingTop: 20
  }
});

class Users extends React.Component {
  state = {
    error: null,
    isLoaded: false,
    item: {}
  };


  componentDidMount() {
    const userId = this.props.match.params.id;
    const apiUrl = Config.host + '/user/find/';

    fetch(apiUrl + userId)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            item: result
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  };


  render() {
    const { classes } = this.props;
    const { error, isLoaded, item } = this.state;

    if (error) {
      return <div>Sorry, but there was nofing found</div>;
    } else if (!isLoaded) {
      return <div>Loading ... </div>;
    }

    return (
      <div>
        <div className={classes.appBarSpacer} />
        <Typography variant="h4" gutterBottom component="h2">
          User
        </Typography>

        <Card className={classes.card}>
          <CardActionArea>
            <CardContent>
              <Typography variant="h5" component="h2">
                {item.firstname}
              </Typography>
              <Typography className={classes.pos} color="textSecondary">
                {item.surname}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>

        <div className={classes.backButton}>
          <Button variant="contained" color="light" component={Link} to="/users">
            Zurück
          </Button>
        </div>
      </div>
    );
  }
}

Users.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Users);
