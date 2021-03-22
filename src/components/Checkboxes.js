import React, { useState } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import Grid from '@material-ui/core/Grid';
import { FormControlLabel } from '@material-ui/core';

import {getCheckboxColor} from './PTSSignifier';
import * as Constants from "../Constants";
import useStyles from "./styles";
//import Checkboxes from './Checkboxes';

// Developer Note: Originally there were checkboxes. In the second iteration, radio buttons
// were introduced but referred to as checkboxes to reuse functionality.
// If reworked, this component should be renamed to Filters but for now interpret
// both checkboxes and radio buttons as filters.

// List of filters that can be applied to the JSON data to extract results
const checkboxList = [
  {filter: Constants.ALL}, 
  {filter: Constants.LATEST},
  {filter: Constants.FAILED},
  {filter: Constants.MD5},
  {filter: Constants.SHA},
  {filter: Constants.REDIRECTS}, 
  {filter: Constants.NOT_TESTED},
  {filter: Constants.TIMED_OUT},
  {filter: Constants.CHECKSUM}, 
  {filter: Constants.DOWNLOAD}, 
  {filter: Constants.NOT_FOUND}, 
  {filter: Constants.R301},  
  {filter: Constants.R302},  
  {filter: Constants.NONE},  
];

// Takes the filter list and sets default properties to create, name and set checkboxes
const getDefaultCheckboxes = () =>
  checkboxList.map((box, index) => { 
    const {idx, name, checked, desc, disabled} = box.filter;
    return ({
      idx, 
      name,
      checked,
      desc,
      disabled,
      children: ("children" in box.filter) ? box.filter.children : null,
      hide: ("hide" in box.filter) ? box.filter.hide : null,
      competes: ("competes" in box.filter) ? box.filter.competes : null,
})});

/**
 * Returns name of checkbox based on the checkbox index value
 * @param {} index  Checkbox index value ie Constants.ALL.idx
 * @returns Checkbox name defined by name key in Object ie Constants.ALL.name
 */
export function getCheckboxName(index) {
  return checkboxList.filter(cb => cb.filter.idx === index)[0].filter.name;  
}

/**
 * Determines the state of the various checkboxes defined in the filterList.
 * The combination of these checkboxes will be used to determine the filters to apply to the JSON values
 * @param defaultCheckboxes 
 * @return all the checkboxes and their current state
 * 
 */
export function useCheckboxes(defaultCheckboxes) {
  const [checkboxes, setCheckboxes] = useState(
    defaultCheckboxes || getDefaultCheckboxes(),
  );

  function manageState(index, checked) {
      let currBox = checkboxes[index];
      currBox.checked = checked;
      checkboxes.map(box => {
        // if the current selection competes with any other checkbox then turn it off.
        // ie Latest Version and All Tests conflict
        if ( currBox.idx !== box.idx) {

          if (currBox.checked && "competes" in currBox && currBox.competes !==null) {
            if (currBox.competes.includes(box.idx)) {
               box.checked = false;
               // Check if the childbox has children also (only 3 layers, otherwise use recursion)
              if (box.children !== null) {
                box.children.forEach(index => {
                  checkboxes[index].checked = false;
                  checkboxes[index].disabled = true;         
                });
              }
            }
          }

          // Disable the fields that do not align with the current selection
          if ("hide" in currBox && currBox.hide !== null) {
            if (currBox.hide.includes(box.idx))
               box.disabled = currBox.checked;
          }
        }

        // if the box is a child of the current selection, match the parent state
        // ie disable and uncheck all children (MD5 and SHA) of the parent (Failed)
        if ("children" in currBox && currBox.children !== null){
          if (currBox.children.includes(box.idx)) {
            box.disabled = !currBox.checked;
            if (box.disabled) {
              box.checked = false;

              // Check if the parent has children also (only 2-3 layers, otherwise use recursion)
              if (box.children !== null) {
                box.children.forEach(index => {
                  checkboxes[index].checked = false;
                  checkboxes[index].disabled = true;         
                });
              }
            }
          }
        }
        return box;
      });
  }

  
  /**
   * Set and manage the state when a checkbox/filter is selected
   * 
   * @param {*} index   Index of the checkbox/filter selected ie Constants.ALL.idx
   * @param {*} checked Boolean, true if selected
   */
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

/**
 * Radio works same as createCheckboxes, except from UI perspective it provides an OR functionality
 * @param {*} classes     The styles to be applied
 * @param {*} checkboxes  The list of filters
 * @param {*} setCheckbox checkboxes state callback
 * @param {*} index       Index of the given checkbox ie Constants.ALL.idx
 */
const createRadio = (classes, checkboxes, setCheckbox, index) => {
  const chCol = getCheckboxColor(index);

  return (
    <>
      <FormControlLabel 
        control=
          {<>
            {/* // <Tooltip arrow enterNextDelay={2000} className={classes.checkboxTip} title={checkboxes[index].desc}> */}
              <Radio
                className={classes.checkboxes}
                disabled={checkboxes[index].disabled}
                style={{'&:hover': {backgroundColor: "transparent"}, color:chCol}}
                checked={checkboxes[index].checked}
                onChange={e => {setCheckbox(checkboxes[index].idx, e.target.checked)}}
              /> 
              </>
            //  </Tooltip>
          }
        label={checkboxes[index].name}
        disabled={checkboxes[index].disabled}
      />
      {/* <PTSSignifier colorStatus={index}/> */}

    </>
  )
}

/**
 * Create and display the checkboxes on the UI
 * @param {*} classes     The styles to be applied
 * @param {*} checkboxes  The list of filters
 * @param {*} setCheckbox checkboxes state callback
 * @param {*} index       Index of the given checkbox ie Constants.ALL.idx
 */
function createCheckbox(classes, checkboxes, setCheckbox, index) {
  const chCol = getCheckboxColor(index);
  return (
    <>
      <FormControlLabel
        control={<>
          {/* // <Tooltip arrow enterNextDelay={2000} className={classes.checkboxTip} title={checkboxes[index].desc}> */}
          <Checkbox
            className={classes.checkboxes}
            disabled={checkboxes[index].disabled}
            style={{ '&:hover': { backgroundColor: "transparent" }, color: chCol }}
            checked={checkboxes[index].checked}
            onChange={e => { setCheckbox(checkboxes[index].idx, e.target.checked); } } />
        </>
          //  </Tooltip>
        }
        label={checkboxes[index].name}
        disabled={checkboxes[index].disabled} />
      {/* <PTSSignifier colorStatus={index}/> */}

    </>
  );
}

/**
 * Create the filters to be displayed on the UI
 * @param {*} checkbox state hook
 * @returns Fragment detailing filters to be displayed on UI
 */
function Checkboxes({ checkboxes, setCheckbox}) {
  const classes =useStyles();

  return (
    <React.Fragment>

      <Grid item xs={12} sm={6} md={2} lg={2}>
          <Grid container direction="column" >
            <Grid item>{createCheckbox(classes, checkboxes, setCheckbox, Constants.ALL.idx)}</Grid>
            <Grid item>{createCheckbox(classes, checkboxes, setCheckbox, Constants.LATEST.idx)}</Grid>
            <Grid item>{createCheckbox(classes, checkboxes, setCheckbox, Constants.FAILED.idx)}</Grid>
            <Grid item >{createCheckbox(classes, checkboxes, setCheckbox, Constants.NOT_TESTED.idx)}</Grid>

          </Grid>
      </Grid>
      <Grid item xs={12} sm={6} md={2} lg={2}>
         {checkboxes[Constants.FAILED.idx].checked ?
            (<>
              <Grid container direction="column" >
                <Grid>{createRadio(classes, checkboxes, setCheckbox, Constants.CHECKSUM.idx)}</Grid>
                <Grid>{createRadio(classes, checkboxes, setCheckbox, Constants.REDIRECTS.idx)}</Grid>
                <Grid>{createRadio(classes, checkboxes, setCheckbox, Constants.DOWNLOAD.idx)}</Grid>
                <Grid>{createRadio(classes, checkboxes, setCheckbox, Constants.NONE.idx)}</Grid>
              </Grid></>
              ) : null}
      </Grid>
    </React.Fragment>
  );
}

export default Checkboxes;


