import React, { useState } from 'react';

import * as Constants from "../Constants";

import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import { FormControlLabel } from '@material-ui/core';

// List of checkboxes that can be applied to the JSON data to extract results
const checkboxList = [
    Constants.ALL,
    Constants.FAILED,
    Constants.MD5,
    Constants.SHA256,
    Constants.REDIRECT
  ];

// Takes the filter list and sets default properties to create checkboxes
const getDefaultCheckboxes = () =>
  checkboxList.map((box, idx) => ({
    name: box,
    checked: false,
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
    // All selected -> Turn off all other filters
    if (index === 0 && checked === true) {
      checkboxes.filter( i => i.name !== 'All' ? i : null ).map(t => t.checked = false);
    }
    // If Success or Failure Selected --> turn of all
    
    // If failure selected -> display md5, sha256, and redirects, turn of success and all
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


function Checkboxes({ checkboxes, setCheckbox }) {
  return (
    <React.Fragment>
      <Grid 
        container
        direction="column">
        {/* All Test */}
        <Grid item>
          <FormControlLabel 
            control={<Checkbox
              checked={checkboxes[0].checked}
                  onChange={e => {
                  setCheckbox(checkboxes[0].idx, e.target.checked);
                }}
            />}
            label={checkboxes[0].name}
          />
        </Grid>
        {/* All Failures */}
        <Grid item container>
          <Grid item>
            <FormControlLabel
              control={<Checkbox
                checked={checkboxes[1].checked}
                    onChange={e => {
                    setCheckbox(checkboxes[1].idx, e.target.checked);
                  }}
              />}
              label={checkboxes[1].name}
            />
          </Grid>
          {/* MD5 Failures */}
          <Grid item>
            <FormControlLabel
                control={<Checkbox
                  checked={checkboxes[2].checked}
                      onChange={e => {
                      setCheckbox(checkboxes[2].idx, e.target.checked);
                    }}
                />}
                label={checkboxes[2].name}
              />
          </Grid>
          {/* SHA256 Failures */}
          <Grid item>
            <FormControlLabel
                control={<Checkbox
                  checked={checkboxes[3].checked}
                      onChange={e => {
                      setCheckbox(checkboxes[3].idx, e.target.checked);
                    }}
                />}
              label={checkboxes[3].name}
            />
          </Grid>
        </Grid>
        {/* Redirects */}
        <Grid item>
          <FormControlLabel
                control={<Checkbox
                  checked={checkboxes[4].checked}
                      onChange={e => {
                      setCheckbox(checkboxes[4].idx, e.target.checked);
                    }}
                />}
                label={checkboxes[4].name}
              />
        </Grid>
      </Grid>
      {/* {checkboxes.map((checkbox, i) => (
        <FormControlLabel
          control={<Checkbox
            checked={checkbox.checked}
                onChange={e => {
                setCheckbox(i, e.target.checked);
              }}
          />}
          label={checkbox.name}
        />
        // <label key={i}>
        //   <input
        //     type="checkbox"
        //     checked={checkbox.checked}
        //     onChange={e => {
        //       setCheckbox(i, e.target.checked);
        //     }}
        //   />
        //   {checkbox.name}
        // </label>
      ))} */}
    </React.Fragment>
  );
}

export default Checkboxes;

