import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from "@material-ui/core/styles/index";
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import green from '@material-ui/core/colors/green';
import Config from '../config';

const styles = theme => ({
    appBarSpacer: theme.mixins.toolbar,
    title: {
        textAlign: 'left'
    },
    textField: {
        paddingBottom: 20
    },
    formControl: {
        margin: theme.spacing.unit,
        fullWidth: true,
        display: 'flex',
        textAlign: 'left',
        paddingBottom: 20
    },
    button: {
        marginTop: 20,
        textAlign: 'right'
    },
    success: {
        backgroundColor: green[600],
    }
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

class BattleAdd extends React.Component {
    state = {
        name: '',
        games: [],
        gamesLoaded: false,
        gameId: '',
        rules: '',
        competitors: [],
        competitorsLoaded: false,
        selectedCompetitors: [],
        error: null,
        saved: false
    };

    componentDidMount() {
        // games
        fetch(Config.host + '/game/findAll')
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        gamesLoaded: true,
                        games: result
                    });
                },
                (error) => {
                    this.setState({
                        gamesLoaded: true,
                        error
                    });
                }
            );

        // competitors
        fetch(Config.host + '/user/findAll')
            .then(res => res.json())
            .then(
                (result) => {
                    let sortedCompetitors = [];
                    result.forEach((item) => {
                        sortedCompetitors.push({
                            value: item.id,
                            name: item.firstname + ' ' + item.surname
                        });
                    });

                    this.setState({
                        competitorsLoaded: true,
                        competitors: sortedCompetitors
                    });
                },
                (error) => {
                    this.setState({
                        competitorsLoaded: true,
                        error
                    });
                }
            );
    };

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    save() {
        console.log(this.state.selectedCompetitors);
        // save battle
        fetch(Config.host + '/battle/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "game-id": this.state.gameId,
                "name": this.state.name,
                "rules": this.state.rules,
                "status": 0
            })
        })
        .then(res => res.json())
        .then(
            (battleId) => {
                // save competitors in for each
                console.log('battle saved', battleId);
                let promises = [];
                this.state.selectedCompetitors.forEach((competitorId) => {
                    promises.push(
                        fetch(Config.host + '/competitor/create', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                "battle-id": battleId,
                                "user-id": competitorId
                            })
                        })
                    );
                });

                Promise.all(promises).then(() => {
                    this.props.history.push("/battles/")
                });
            },
            (error) => {
                this.setState({
                    error
                });
            }
        );
    };

    render() {
        const {classes} = this.props;

        return (
            <form noValidate autoComplete="off">
                <div className={classes.appBarSpacer} />
                <Typography variant="h4" gutterBottom component="h2" className={classes.title}>
                    Let's battle
                </Typography>

                <TextField
                    id="name"
                    label="Name"
                    className={classes.textField}
                    value={this.state.name}
                    onChange={this.handleChange('name')}
                    fullWidth
                />

                <TextField
                    id="rules"
                    label="Spielregeln"
                    rows="6"
                    value={this.state.rules}
                    className={classes.textField}
                    onChange={this.handleChange('rules')}
                    fullWidth
                    multiline
                />

                <Grid container spacing={8}>
                    <Grid item xs={6}>
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="gameId">Spiel auswählen</InputLabel>
                            <Select
                                id="gameId"
                                value={this.state.gameId}
                                inputProps={{
                                    name: 'Spiel auswählen',
                                    id: 'gameId',
                                }}
                                onChange={this.handleChange('gameId')}
                                autoWidth
                            >
                                {this.state.games.map(game => {
                                    return (
                                        <MenuItem value={game.id} key={game.id}>
                                            <img width="24" src={'data:image/png;base64, ' + game.picture} alt={game.name} />&nbsp;
                                            {game.name}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="select-multiple">Teilnehmer</InputLabel>
                            <Select
                                id="competitors"
                                multiple
                                value={this.state.selectedCompetitors}
                                onChange={this.handleChange('selectedCompetitors')}
                                input={<Input id="select-multiple" />}
                                MenuProps={MenuProps}
                            >
                                {this.state.competitors.map(competitor => (
                                    <MenuItem key={competitor.value} value={competitor.value}>
                                        {competitor.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                <div className={classes.button}>
                    <Button variant="contained" color="primary" onClick={() => this.save()}>
                        Speichern
                    </Button>
                </div>
            </form>
        );
    }
}

BattleAdd.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BattleAdd);
