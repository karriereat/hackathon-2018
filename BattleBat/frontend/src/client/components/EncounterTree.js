import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Encounter from './Encounter';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import green from "@material-ui/core/colors/green";
import Snackbar from '@material-ui/core/Snackbar';
import PlayIcon from '@material-ui/icons/PlayCircleFilled';
import Config from '../config';

const styles = theme => ({
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
    button: {
        marginBottom: 20
    },
    buttonWrapper: {
        textAlign: 'right'
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
    marginBottom: 20
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
    success: {
        backgroundColor: green[600],
    },
    title: {
      fontSize: 24,
      paddingBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        padding: 0,
        fontWeight: 600
    }
});

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

class EncounterTree extends React.Component {
  state = {
    encounters: [],
    error: null,
    isLoaded: false,
    saved: false,
    winnerName: '',
    competitors: []
  };

  componentDidMount() {
    const encounterId = this.props.encounter;
    const apiUrl = Config.host + '/encounter/find/battle-id/';
    const apiUrlBattle = Config.host + '/battle/find/';

      fetch(apiUrlBattle + this.props.battle.id)
          .then(res => res.json())
          .then(
              (result) => {
                  let winnerNameLong = '';
                  let resultCopy = result;

                  try {
                      winnerNameLong = resultCopy.winner.name + ' (' + resultCopy.winner.firstname + ' ' + resultCopy.winner.surname + ')';
                  } catch (e) {
                      console.log('ERROR! No winner set');
                  }

                  this.setState({
                      winnerName: winnerNameLong
                  });
              }
          );

    fetch(apiUrl + encounterId)
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result);
          this.setState({
            isLoaded: true,
            encounters: result
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );

    // competitors
      fetch(Config.host + '/competitor/find/battle-id/' + this.props.battle.id)
          .then(res => res.json())
          .then(
              (result) => {
                  result.forEach((user) => {
                      fetch(Config.host + '/user/find/' + user['user-id'])
                          .then(res => res.json())
                          .then(
                              (competitor) => {
                                  let comps = this.state.competitors;
                                  comps.push(competitor);
                                  this.setState({ competitors: comps });
                              },
                              (error) => {
                                  this.setState({ error });
                              }
                          );
                  });
              },
              (error) => {
                  this.setState({ error });
              }
          );
  };

    startBattle() {
        const battleId = this.props.battle.id;
        const apiUrl = Config.host + '/battle/start/';

        fetch(apiUrl + battleId, {
            method: 'GET'
        })
            .then(
                (success) => {
                    // save competitors in for each
                    console.log('battle started', success);
                    location.assign("http://localhost:3000/battles");
                    this.setState({
                        saved: true
                    });
                },
                (error) => {
                  console.log(error);
                }
            );
    };

  render() {
    const { classes } = this.props;
    const { error, isLoaded, encounters } = this.state;

    if (error) {
      return <div>Sorry, but there was nofing found</div>;
    } else if (!isLoaded) {
      return <div>Loading ... </div>;
    }

    return (
      <React.Fragment>
        <main>
            {(() => {
                switch (this.props.battle.status) {
                    case 0:
                        return (
                            <div className={classes.buttonWrapper}>
                                <Button variant="contained" color="primary" onClick={() => this.startBattle()} className={classes.button}>
                                    <PlayIcon/> &nbsp;Battle starten
                                </Button>
                            </div>
                        );
                }
            })()}

          <div className={classes.heroUnit}>
            <div className={classes.heroContent}>
                {(() => {
                    switch (this.props.battle.status) {
                        case 0:
                            return (
                                <div>
                                    <Typography variant="h4" gutterBottom component="h4" className={classes.title}>
                                        Teilnehmer
                                    </Typography>
                                    {this.state.competitors.map(competitor => {
                                        return (
                                            <Card className={classes.card} key={competitor.id}>
                                                <CardContent>
                                                    <Typography variant="h4" gutterBottom component="h4" className={classes.subtitle}>
                                                        {competitor.name}
                                                    </Typography>
                                                    <Typography variant="h6" gutterBottom component="h6">
                                                      {competitor.email}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            );

                        case 1:
                            return (
                                <div>
                                    <Typography variant="h4" gutterBottom component="h4"
                                                className={classes.title}>
                                        ... läuft gerade ...
                                    </Typography>
                                </div>
                            );

                    }
                })()}

                {(() => {
                    if (this.state.winnerName !== '') {
                          return (
                              <div>
                                  <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                                      Sieger:
                                  </Typography>
                                  <Typography variant="h3" align="center" color="textSecondary" paragraph>
                                      {this.state.winnerName}
                                  </Typography>
                              </div>
                          );
                    }
                })()}
            </div>
          </div>

          {encounters.map(round => {
            return (
               //übergibt eine runde
               <Encounter round={round} key={round.round} />
            );
          })}
        </main>

          <Snackbar
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              className={classes.success}
              open={this.state.saved}
              ContentProps={{
                  'aria-describedby': 'message-id',
              }}
              message={<span id="message-id">Battle wurde gestartet</span>}
          />
      </React.Fragment>
    );
  }
}

EncounterTree.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EncounterTree);
