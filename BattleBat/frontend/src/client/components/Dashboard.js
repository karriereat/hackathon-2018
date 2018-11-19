import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import SimpleLineChart from './SimpleLineChart';
import SimpleTable from './SimpleTable';

const styles = theme => ({
    appBarSpacer: theme.mixins.toolbar,
    chartContainer: {
        marginLeft: -22,
    },
    tableContainer: {
        height: 320,
    }
});

class Dashboard extends React.Component {
    render() {
        const { classes } = this.props;

        return (
          <div>
            <div className={classes.appBarSpacer} />
            <div className={classes.appBarSpacer} />
            <img src="/resources/battle_bat.png" />
            <div className={classes.appBarSpacer} />
            <Typography variant="h4" gutterBottom component="h2" className={classes.title}>
              Let the battle begin...
            </Typography>
          </div>
        );
    }
}

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dashboard);
