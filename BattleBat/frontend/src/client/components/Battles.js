import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import grey from '@material-ui/core/colors/grey';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';
import GamesIcon from '@material-ui/icons/Games';
import CheckIcon from '@material-ui/icons/CheckCircle';
import HourGlassIcon from '@material-ui/icons/HourglassEmpty';
import AddIcon from '@material-ui/icons/Add';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { withStyles } from "@material-ui/core/styles/index";
import Config from '../config';

const styles = theme => ({
    appBarSpacer: theme.mixins.toolbar,
    card: {
        minWidth: 275,
        marginBottom: 10,
        textAlign: 'left'
    },
    title: {
        textAlign: 'left'
    },
    pos: {
        marginBottom: 12,
    },
    avatarCreated: {
        margin: 10,
        color: '#fff',
        backgroundColor: grey[500]
    },
    avatarRunning: {
        margin: 10,
        color: '#fff',
        backgroundColor: blue[500]
    },
    avatarFinished: {
        margin: 10,
        color: '#fff',
        backgroundColor: green[500]
    },
    row: {
        display: 'flex',
        justifyContent: 'center',
    },
    button: {
        textAlign: 'right',
        marginBottom: 20
    }
});

class Battles extends React.Component {
    state = {
        error: null,
        isLoaded: false,
        items: []
    };

    componentDidMount() {
        fetch(Config.host + '/battle/findAll')
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
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div>
                    <div className={classes.appBarSpacer} />
                    <Typography variant="h4" gutterBottom component="h2" className={classes.title}>
                        Battles
                    </Typography>
                    <div className={classes.button}>
                        <Button variant="contained" color="primary" component={Link} to="/battle-anlegen">
                            <AddIcon/>&nbsp; Battle erstellen
                        </Button>
                    </div>
                    {items.map(item => {
                        return (
                            <Card className={classes.card} key={item.id}>
                                <CardActionArea component={Link} to={ '/battles/' + item.id }>
                                    <CardContent>
                                        <Grid container spacing={24}>
                                            <Grid item xs={1}>
                                                {(() => {
                                                    switch (item.status) {
                                                        case 0:
                                                            return (
                                                                <Avatar className={classes.avatarCreated}>
                                                                    <HourGlassIcon />
                                                                </Avatar>
                                                            );
                                                        case 1:
                                                            return (
                                                                <Avatar className={classes.avatarRunning}>
                                                                    <GamesIcon />
                                                                </Avatar>
                                                            );
                                                        case 2:
                                                            return (
                                                                <Avatar className={classes.avatarFinished}>
                                                                    <CheckIcon />
                                                                </Avatar>
                                                            );
                                                    }
                                                })()}
                                            </Grid>
                                            <Grid item xs={11}>
                                                <Typography variant="h5" component="h2">
                                                    {item.name}
                                                </Typography>
                                                <Typography className={classes.pos} color="textSecondary">
                                                    {item.rules}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        );
                    })}
                </div>
            );
        }
    }
}

Battles.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Battles);
