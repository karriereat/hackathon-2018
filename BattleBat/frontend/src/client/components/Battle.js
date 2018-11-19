import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from "@material-ui/core/styles/index";
import UsersAPI from '../api';
import { Link } from 'react-router-dom';
import EncounterTree from './EncounterTree';
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

class Battle extends React.Component {
    state = {
        error: null,
        isLoaded: false,
        item: {}
    };


    componentDidMount() {
        const battleId = this.props.match.params.id;
        const apiUrl = Config.host + '/battle/find/';

        fetch(apiUrl + battleId)
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.status > 0) {
                      console.log('BAUMANSICHT');
                    } else {
                      console.log('keine Baumansicht');
                      console.log('Spieler hinzufügen');
                    }

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
                  {item.name}
                </Typography>
                <EncounterTree encounter={ item.id } battle={item} />

                <div className={classes.backButton}>
                    <Button variant="contained" component={Link} to="/battles">
                        Zurück
                    </Button>
                </div>
            </div>
        );
    }
}

Battle.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Battle);
