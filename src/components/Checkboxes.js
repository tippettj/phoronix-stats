import React, { useState } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import { FormControlLabel } from '@material-ui/core';

import * as Constants from "../Constants";
import useStyles from "./styles";
import { Toolbar } from '@material-ui/core/Toolbar';

// List of checkboxes that can be applied to the JSON data to extract results
const checkboxList = [
    {name: Constants.ALL, checked: false, desc: "Displays all tests profiles"}, 
    {name: Constants.LATEST, checked: true, desc: "Displays latest version of each test profile"},
    {name: Constants.FAILED, checked: false, desc: "Displays test profiles that failed any test criteria"},
    {name: Constants.MD5, checked: false, desc: "Displays test profiles with failed MD5 checksum"},
    {name: Constants.SHA256, checked: false, desc: "Displays test profiles with failed SHA256 checksum"},
    {name: Constants.REDIRECT, checked: false, desc: "Displays test profiles which resulted in a 301 or 302 redirect"}, 
    {name: Constants.NOT_TESTED, checked: false, desc: "Displays test profiles which were not downloaded and tested"},
    {name: Constants.TIMED_OUT, checked: false, desc: "Displays test profiles that timeout during download and were not tested"}  
];

// Takes the filter list and sets default properties to create checkboxes
const getDefaultCheckboxes = () =>
  checkboxList.map((box, idx) => ({
    name: box.name,
    checked: box.checked,
    desc: box.desc,
    idx,
}));

/**
 * Determines the state of the various checkboxes defined in the filterList.
 *  The combination of these checkboxes will be used to determing the checkboxes to apply to the JSON values
 * @param defaultCheckboxes 
 * @return all the checkboxes and their current state
 */
export function useCheckboxes(defaultCheckboxes) {
  const [checkboxes, setCheckboxes] = useState(
    defaultCheckboxes || getDefaultCheckboxes(),
  );


  /**
   * Determines the logic of the checkboxes
   * @param index   index of the checkbox as defined in the checkboxList
   * @param checked boolean
   */ 
  function manageState(index,checked) {
    const all = 0;
    const latest = 1;
    const allFailed = 2;
    const md5Failed = 3;
    const shaFailed = 4;
    const redirects = 5;
    const notTested = 6;
    const timedOut = 7;


    // All selected -> Turn off all other filters
    if (index === all && checked === true) {
      checkboxes.filter( i => i.name !== Constants.ALL ? i : null ).map(t => t.checked = false);
    }

    if (index === latest) {
      checkboxes.filter( i => i.name !== Constants.LATEST ? i : null ).map(t => t.checked = false);
    }

    if (index === allFailed) {
      checkboxes.filter( i => i.name !== Constants.FAILED ? i : null ).map(t => t.checked = false);
    }

    if (index === redirects) {
      checkboxes.filter( i => i.name !== Constants.REDIRECT ? i : null ).map(t => t.checked = false);
    }

    if (index === notTested) {
      checkboxes.filter( i => i.name !== Constants.NOT_TESTED ? i : null ).map(t => t.checked = false);
    }

    if (index === timedOut) {
      checkboxes.filter( i => i.name !== Constants.TIMED_OUT ? i : null ).map(t => t.checked = false);
    }

    // md5 and sha256 can be selected at the same time --> adds up to all Failures
    if (index === md5Failed || index === shaFailed) {
      checkboxes[all].checked = false;
      checkboxes[latest].checked = false;
      checkboxes[allFailed].checked = false;
      checkboxes[redirects].checked = false;
      checkboxes[notTested].checked = false;
      checkboxes[timedOut].checked = false;
    }
  }

  // Sets the state of a specific checkbox
  function setCheckbox(index, checked) {
    manageState(index,checked);
    const newcheckboxes = [...checkboxes];
    newcheckboxes[index].checked = checked;
    setCheckboxes(newcheckboxes);
  }

  // same as a standard use hook
  return {
    checkboxes,
    setCheckbox,
  };
}

const createCheckbox = (classes, checkboxes, setCheckbox, index) => {
  console.log("description", checkboxes[index].desc);
  return (
    <FormControlLabel 
      control=
        {
         <Tooltip arrow className={classes.checkboxTip} title={checkboxes[index].desc}>
            <Checkbox
              className={classes.checkboxes}
              style={{'&:hover': {backgroundColor: "transparent"}}}
              checked={checkboxes[index].checked}
              onChange={e => {setCheckbox(checkboxes[index].idx, e.target.checked)}}
            /> 
          </Tooltip>}
      label={checkboxes[index].name}
    />
  )
}

function Checkboxes({ checkboxes, setCheckbox}) {
  const classes =useStyles();
  return (
    <React.Fragment>
        <Grid item xs={12} sm={3} md={2} lg={2}>
          <Grid container direction="column" >
            <Grid item>{createCheckbox(classes, checkboxes, setCheckbox, 0)}</Grid>
            <Grid item>{createCheckbox(classes, checkboxes, setCheckbox, 1)}</Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={3} md={3} lg={2}>
          <Grid container direction="column" >
            <Grid item>{createCheckbox(classes, checkboxes, setCheckbox, 2)}</Grid>
            <Grid item>{createCheckbox(classes, checkboxes, setCheckbox, 3)}</Grid>
            <Grid item>{createCheckbox(classes, checkboxes, setCheckbox, 4)}</Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={3} md={3} lg={2}>
          <Grid container direction="column" >
            <Grid item >{createCheckbox(classes, checkboxes, setCheckbox, 5)}</Grid>
            <Grid item >{createCheckbox(classes, checkboxes, setCheckbox, 6)}</Grid>
            <Grid item >{createCheckbox(classes, checkboxes, setCheckbox, 7)}</Grid>
          </Grid>
        </Grid>
    </React.Fragment>
  );
}

export default Checkboxes;

