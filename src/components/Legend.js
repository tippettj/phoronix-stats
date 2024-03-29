import React from 'react';
import Paper from '@material-ui/core/Paper';
import PTSSignifier from './PTSSignifier';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import useStyles from "./styles";
import * as Constants from "../Constants";
import {theme} from './theme';

/**
 * Create the signifier and description.
 * 
 * @param {*} colIdx Defines the shape of the signifier based on Constants.COLOR_*
 * @param {*} colName Description of the signifier
 * @returns Icon and Description of Icon
 */
const createLegend = (colIdx, colName) => {
  return (
    <Grid item container>
      <Grid item style={{marginTop:'0.25em'}}><PTSSignifier  colorStatus={colIdx}/></Grid>
      <Grid item style={{marginLeft:'1em'}}><Typography>{colName}</Typography></Grid>
    </Grid>
  );
}

/**
 * Create the legend which is displayed/hidden by the Legend Checkbox.
 * @returns Legend
 */
export default function Legend() {
    const classes =useStyles();

    return (
      <>  
        <Grid container>

          <Grid item xs={12} sm={6} md={6} lg={6}>
              <Box fontWeight="fontWeightMedium">Error Type</Box>
              <Paper className={classes.paper}>
                {createLegend([Constants.COLOR_MD5], 'MD5 Error')}
                {createLegend([Constants.COLOR_SHA], 'SHA256 Error')}
                {createLegend([Constants.COLOR_301], 'Redirect 301 Error')}
                {createLegend([Constants.COLOR_302], 'Redirect 302 Error')}
                {createLegend([Constants.COLOR_TIMEOUT], 'Download Timed Out')}
                {createLegend([Constants.COLOR_404], 'Not Found 404 Error')}
                {createLegend([Constants.COLOR_HTTP_0], 'HTTP 0 Error')}                
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={6}>
            <Box fontWeight="fontWeightMedium">Profile Status</Box>
              <Paper className={classes.paper}>
                <Typography style={{color:theme.palette.primary.main}}>Passed</Typography>
                <Typography style={{color:theme.palette.warning.dark}}>Contains Potential Failures</Typography>
                <Typography style={{color:theme.palette.secondary.main}}>Contains Failures</Typography>
                <Typography style={{color:theme.palette.fatal.main}}>All Mirrors Failed</Typography>
                {createLegend([Constants.COLOR_CHECKSUM], "Checksum Errors")}
                {createLegend([Constants.COLOR_REDIRECT], "Redirect Errors")}
                {createLegend([Constants.COLOR_DOWNLOAD], "Download Errors")}
                {createLegend([Constants.COLOR_NO_CATEGORY], "Other Errors")}  
                {createLegend([Constants.COLOR_NOT_TESTED], 'Not Tested')}
              
              </Paper>
          </Grid>

        </Grid>
      </>
    )
}