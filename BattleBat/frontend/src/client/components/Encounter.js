import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';
import Config from '../config';


import blue from '@material-ui/core/colors/blue';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog/Dialog';
import List from '@material-ui/core/List/List';
import ListItem from '@material-ui/core/ListItem/ListItem';

import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import TextField from '@material-ui/core/TextField';

import EncounterSingleItem from './EncounterSingleItem';


const styles = theme => ({

  greenAccent: {
    backgroundColor: green[500],
    color: '#ffffff',
    fontSize: 20
  },

  greyAccent: {
    backgroundColor: grey[300],
    fontSize: 20
  },

  appBar: {
    position: 'relative',
  },
  icon: {
    marginRight: theme.spacing.unit * 2,
  },
  heroUnit: {
    backgroundColor: theme.palette.background.paper,
  },
  heroContent: {
    maxWidth: 600,
    margin: '0 auto',
    padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`,
  },
  heroButtons: {
    marginTop: theme.spacing.unit * 4,
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  cardGrid: {
    padding: `${theme.spacing.unit * 8}px 0`,
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing.unit * 6,
  },
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
});
const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const emails = ['username@gmail.com', 'user02@gmail.com'];


class SimpleDialog extends React.Component {
  state = {
    name: 'Cat in the Hat'
  };

  handleClose = () => {
    this.props.onClose(this.props.selectedValue);
  };

  handleListItemClick = value => {
    this.props.onClose(value);
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  }

  render() {
    const { classes, onClose, selectedValue, ...other } = this.props;

    return (
      <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" {...other}>
        <DialogTitle id="simple-dialog-title">Wer hat das Spiel gewonnen?</DialogTitle>
        <form className={classes.container} noValidate autoComplete="off">
          <div>
            <List>
              {emails.map(email => (
                <ListItem button onClick={() => this.handleListItemClick(email)} key={email}>
                  <ListItemText primary={email} />
                </ListItem>
              ))}
            </List>
              <TextField
                id="standard-name"
                label="Name"
                className={classes.textField}
                value={this.state.name}
                onChange={this.handleChange('name')}
                margin="normal"
              />
          </div>
        </form>
      </Dialog>
    );
  }
}

SimpleDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  selectedValue: PropTypes.string,
};

const SimpleDialogWrapped = withStyles(styles)(SimpleDialog);

class Encounter extends React.Component {
  state = {
    error: null,
    isLoaded: false,
    open: false,
    roundNr: null,
    encounters: [],
    selectedValue: emails[1]
  };

  handleClickOpen = () => {
    this.setState({
      open: true,
    });
  };

  handleClose = value => {
    this.setState({ selectedValue: value, open: false });
  };

  componentDidMount() {
    // const encountersRound = this.props.round;
    //const encounters = this.props.round.encounters;
    //const roundNr = this.props.round.round;
    console.log(this.props);
    // console.log(encountersRound);
    // console.log(encounters);


    //TODO eigene komponente
    //TODO const id = this.props.item['id'];
    // const competitorId = this.props.item['competitor-id'];
    // const opponentId = this.props.item['opponent-id'];
    // const winnerId = this.props.item['winner-id'];
    // const apiUrl = Config.host + '/user/find/';
    //
    // //Competitor
    // fetch(apiUrl + competitorId)
    //   .then(res => res.json())
    //   .then((result) => {
    //     console.log(result);
    //     this.setState({
    //       competitor: result.name
    //     });
    //   });
    //
    // //Opponent
    // fetch(apiUrl + opponentId)
    //   .then(res => res.json())
    //   .then((result) => {
    //     console.log(result);
    //     this.setState({
    //       opponent: result.name
    //     });
    //   });


    // if (winnerId === opponentId) {
    //   this.getWinnerLooser(opponentId, competitorId);
    // } else if (winnerId === competitorId) {
    //   this.getWinnerLooser(competitorId, opponentId);
    // }
    // if(winnerId) {
    //   fetch(apiUrl + winnerId)
    //     .then(res => res.json())
    //     .then(
    //       (result) => {
    //         console.log('And the winner is ' + result.name + result.id);
    //         this.setState({
    //           isLoaded: true,
    //           winner: result.name
    //         });
    //       },
    //       (error) => {
    //         this.setState({
    //           isLoaded: true,
    //           error
    //         });
    //       }
    //     )
    // }
  };

  save() {

  }

  getUserById(id) {
    fetch(apiUrl + competitorId)
      .then(res => res.json())
      .then((result) => {
        return result;
      });
  }

  getWinnerLooser(winnerId, looserId) {
    const apiUrl = Config.host + '/user/find/';

    fetch(apiUrl + winnerId)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            winner: result.name
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );

    fetch(apiUrl + looserId)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            looser: result.name
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  }

  render() {
    const { classes } = this.props;
    // const encounters = this.state.encounters;
    // const rounde = this.state.roundNr;
    // console.log(encounters);
    return (
      <div>
        <h1>Runde: { this.props.round.round } </h1>

        {this.props.round.encounters.map(item => {
            console.log('encounter item', item);
          return (
            <EncounterSingleItem encounter={item} key={item.id}/>
          );
        })}

      </div>
    );
  }
}

Encounter.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Encounter);
