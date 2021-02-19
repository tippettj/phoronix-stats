import React, { useState } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import { FormControlLabel } from '@material-ui/core';

import * as Constants from "../Constants";
import useStyles from "./styles";

// List of checkboxes that can be applied to the JSON data to extract results
const checkboxList = [
    {name: Constants.ALL, checked: true}, 
    {name: Constants.FAILED, checked: false},
    {name: Constants.MD5, checked: false},
    {name: Constants.SHA256, checked: false},
    {name: Constants.REDIRECT, checked: false}, 
    {name: Constants.NOT_TESTED, checked: false}  
];

// Takes the filter list and sets default properties to create checkboxes
const getDefaultCheckboxes = () =>
  checkboxList.map((box, idx) => ({
    name: box.name,
    checked: box.checked,
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
    const allFailed = 1;
    const md5Failed = 2;
    const shaFailed = 3;
    const redirects = 4;
    const notTested = 5;


    // All selected -> Turn off all other filters
    if (index === all && checked === true) {
      checkboxes.filter( i => i.name !== Constants.ALL ? i : null ).map(t => t.checked = false);
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

    // md5 and sha256 can be selected at the same time --> adds up to all Failures
    if (index === md5Failed || index === shaFailed) {
      checkboxes[all].checked = false;
      checkboxes[allFailed].checked = false;
      checkboxes[redirects].checked = false;
      checkboxes[notTested].checked = false;

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
  return (
    <FormControlLabel 
      control=
        {<Checkbox
          className={classes.checkboxes}
          style={{'&:hover': {backgroundColor: "transparent"}}}
          checked={checkboxes[index].checked}
          onChange={e => {setCheckbox(checkboxes[index].idx, e.target.checked)}}
        />}
      label={checkboxes[index].name}
    />
  )
}

function Checkboxes({ checkboxes, setCheckbox}) {
  const classes =useStyles();
  return (
    <React.Fragment>
        <Grid item xs={12} sm={3} md={2} lg={2}>{createCheckbox(classes, checkboxes, setCheckbox, 0)}</Grid>
        <Grid item xs={12} sm={3} md={3} lg={2}>
          <Grid container direction="column" >
            <Grid item>{createCheckbox(classes, checkboxes, setCheckbox, 1)}</Grid>
            <Grid item>{createCheckbox(classes, checkboxes, setCheckbox, 2)}</Grid>
            <Grid item>{createCheckbox(classes, checkboxes, setCheckbox, 3)}</Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={3} md={3} lg={2}>
          <Grid container direction="column" >
            <Grid item >{createCheckbox(classes, checkboxes, setCheckbox, 4)}</Grid>
            <Grid item >{createCheckbox(classes, checkboxes, setCheckbox, 5)}</Grid>
          </Grid>
        </Grid>
    </React.Fragment>
  );
}

export default Checkboxes;

