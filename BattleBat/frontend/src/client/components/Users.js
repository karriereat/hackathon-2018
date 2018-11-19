import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from "@material-ui/core/styles/index";
import UsersAPI from '../api';
import { Link } from 'react-router-dom';
import Card from '@material-ui/core/Card/Card';
import CardActionArea from '@material-ui/core/CardActionArea/CardActionArea';
import CardContent from '@material-ui/core/CardContent/CardContent';
import ListItem from '@material-ui/core/ListItem/ListItem';
import Config from '../config';


const styles = theme => ({
  appBarSpacer: theme.mixins.toolbar,
  title: {
    textAlign: 'left'
  }
});

class Users extends React.Component {
  state = {
    error: null,
    isLoaded: false,
    items: []
  };


  componentDidMount() {
    fetch(Config.host + '/user/findAll')
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result
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
      const { error, isLoaded, items } = this.state;

      if (error) {
        return <div>Sorry, but there was nofing found</div>;
      } else if (!isLoaded) {
        return <div>Loading ... </div>;
      }

      return (
          <div>
            <div className={classes.appBarSpacer} />
            <Typography variant="h4" gutterBottom component="h2" className={classes.title}>
              Users
            </Typography>
            {items.map(item => {
              return (
                <Card className={classes.card} key={item.id} component={Link} to={'/users/' + item.id }>
                  <CardActionArea>
                    <CardContent>
                      <Typography variant="h5" component="h2">
                        {item.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              );
            })}

          </div>
      );
    }
}

Users.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Users);
