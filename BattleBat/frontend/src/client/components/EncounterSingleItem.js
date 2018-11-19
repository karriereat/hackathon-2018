import React from 'react';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';

import green from '@material-ui/core/colors/green';
import CardActionArea from '@material-ui/core/CardActionArea/CardActionArea';
import CardContent from '@material-ui/core/CardContent/CardContent';
import Typography from '@material-ui/core/Typography/Typography';
import Chip from '@material-ui/core/Chip/Chip';
import Card from '@material-ui/core/Card/Card';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import List from '@material-ui/core/List/List';
import ListItem from '@material-ui/core/ListItem/ListItem';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import TextField from '@material-ui/core/TextField/TextField';
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
  },
    winnerButton: {
      marginBottom: 20
    },
    greenAccent: {
        backgroundColor: green[500]
    }
});



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
  };


  save(encounterID, winnerId) {
    // save battle
    fetch(Config.host + '/encounter/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "encounter-id": encounterID,
        "winner": winnerId
      })
    })
      .then(res => res.json())
      .then(
        (success) => {
          // save competitors in for each
          console.log('winner saved', success);
            // location.assign("http://localhost:3000/battles");
        },
        (error) => {
          console.log(error);
        }
      );
  };



  render() {
    const { classes, onClose, selectedValue, ...other } = this.props;
    console.log('Props');
    console.log(this.props);

    return (
      <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" {...other}>
        <DialogTitle id="simple-dialog-title">Wer hat das Spiel gewonnen?</DialogTitle>
        <form className={classes.container} noValidate autoComplete="off">
          <div>
            <List>

              <ListItem button onClick={() => this.save(this.props.encounter.id, this.props.encounter.competitor.id)} key={this.props.encounter.competitor.id}>
                <ListItemText primary={this.props.encounter.competitor.name} />
              </ListItem>

              <ListItem button onClick={() => this.save(this.props.encounter.id, this.props.encounter.opponent.id)} key={this.props.encounter.opponent.id}>
                <ListItemText primary={this.props.encounter.opponent.name} />
              </ListItem>

            </List>
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

const emails = ['username@gmail.com', 'user02@gmail.com'];

class EncounterSingleItem extends React.Component {
  state = {
    open: false,
    selectedValue: emails[1],
    winnerId: '',
    opponentId: '',
    competitorId: ''
  };

  componentDidMount() {

  }

  handleClickOpen = () => {
    this.setState({
      open: true,
    });
  };

  handleClose = value => {
    this.setState({ selectedValue: value, open: false });
  };

  render() {
    const { classes } = this.props;
    console.log(this.props);

    return (
      <Card className={classes.card}>
        <CardActionArea>
          <CardContent>
            <Typography variant="h5" component="h2">
              Spiel
            </Typography>
            <div>
                {console.log('YOLO', this.props.encounter)}
                {(() => {
                    if (this.props.encounter.competitor.id === this.props.encounter['winner-id']) {
                        return (
                            <Chip label={this.props.encounter.competitor.name} className={classes.greenAccent} />
                        );
                    } else {
                        return (
                            <Chip label={this.props.encounter.competitor.name} className={classes.greyAccent} />
                        );
                    }
                })()}

              &nbsp;:&nbsp;

                {(() => {
                    if (this.props.encounter.opponent.id === this.props.encounter['winner-id']) {
                        return (
                            <Chip label={this.props.encounter.opponent.name} className={classes.greenAccent} />
                        );
                    } else {
                        return (
                            <Chip label={this.props.encounter.opponent.name} className={classes.greyAccent} />
                        );
                    }
                })()}
            </div>
          </CardContent>
        </CardActionArea>
        <Button color="primary" className={classes.winnerButton} onClick={this.handleClickOpen}>set Winner</Button>
        <SimpleDialogWrapped
          selectedValue={this.state.selectedValue}
          encounter={this.props.encounter}
          open={this.state.open}
          onClose={this.handleClose}
        />
      </Card>
    );
  }
}

EncounterSingleItem.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EncounterSingleItem);
