import React, { useState } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import { FormControlLabel } from '@material-ui/core';

import * as Constants from "../Constants";
import useStyles from "./styles";

// List of checkboxes that can be applied to the JSON data to extract results
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
];

// Takes the filter list and sets default properties to create checkboxes
const getDefaultCheckboxes = () =>
  checkboxList.map((box, index) => { 
    //console.log(checkboxList);
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

export function getCheckboxName(index) {
  return checkboxList.filter(cb => cb.filter.idx === index)[0].filter.name;  
}
export function getCheckbox(index) {
  return checkboxList.filter(cb => cb.filter.idx === index)[0].filter;  
}

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

  function manageState(index, checked) {
      let currBox = checkboxes[index];
      currBox.checked = checked;
      checkboxes.map(box => {
        // if the current selection competes with any other checkbox then turn it off.
        // ie Latest Version and All Tests conflict
        if ( currBox.idx !== box.idx) {

          console.log("Competes", currBox.competes);
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
          //console.log("hide");
          if ("hide" in currBox && currBox.hide !== null) {
            //console.log("hide",  box);
            if (currBox.hide.includes(box.idx))
               box.disabled = currBox.checked;
          }
        }

        // if the box is a child of the current selection, match the parent state
        // ie disable and uncheck all children (MD5 and SHA) of the parent (Fails)
        if ("children" in currBox && currBox.children !== null){
          if (currBox.children.includes(box.idx)) {
            box.disabled = !currBox.checked;
            if (box.disabled) {
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
        }
        return box;
      });
  }

  /**
   * Determines the logic of the checkboxes
   * @param index   index of the checkbox as defined in the checkboxList
   * @param checked boolean
   */ 
  // function manageState(index,checked) {
  //   // All selected -> Turn off all other filters
  //   let x = getCheckbox(index);
  //   console.log("Got checkbox", x);
  //   displaySelection(index, checked);

    // if (index === Constants.ALL.idx) {
    //   displaySelection(index, checked, Constants.ALL);
    // }

    // if (index === Constants.LATEST.idx) {
    //   displaySelection(index, checked, Constants.LATEST);
    // }

    // if (index === Constants.FAILED.idx) {
    //   displaySelection(index, checked, Constants.FAILED);
    // }

    // if (index === Constants.REDIRECTS.idx) {
    //   displaySelection(index, checked, Constants.REDIRECTS);

    // }

    // if (index === Constants.NOT_TESTED.idx) {
    //   displaySelection(index, checked, Constants.NOT_TESTED);

    // }

    // if (index === Constants.TIMED_OUT.idx) {
    //   displaySelection(index, checked, Constants.TIMED_OUT);
    // }

    // // if (index === Constants.NOT_FOUND.idx) {
    // //   displaySelection(index, checked, Constants.NOT_FOUND);
    // // }

    // if (index === Constants.CHECKSUM.idx) {
    //   displaySelection(index, checked, Constants.CHECKSUM);
    // }

    // if (index === Constants.DOWNLOAD.idx) {
    //   displaySelection(index, checked, Constants.DOWNLOAD);
    // }
  //}

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
        {
          // <Tooltip arrow enterNextDelay={2000} className={classes.checkboxTip} title={checkboxes[index].desc}>
            <Checkbox
              className={classes.checkboxes}
              disabled={checkboxes[index].disabled}
              style={{'&:hover': {backgroundColor: "transparent"}}}
              checked={checkboxes[index].checked}
              onChange={e => {setCheckbox(checkboxes[index].idx, e.target.checked)}}
            /> 
          //  </Tooltip>
        }
      label={checkboxes[index].name}
      disabled={checkboxes[index].disabled}
    />
  )
}

function Checkboxes({ checkboxes, setCheckbox}) {
  const classes =useStyles();

  return (
    <React.Fragment>
        <Grid item xs={12} sm={3} md={2} lg={2}>
          <Grid container direction="column" >
            <Grid item>{createCheckbox(classes, checkboxes, setCheckbox, Constants.ALL.idx)}</Grid>
            <Grid item>{createCheckbox(classes, checkboxes, setCheckbox, Constants.LATEST.idx)}</Grid>
            <Grid item>{createCheckbox(classes, checkboxes, setCheckbox, Constants.FAILED.idx)}</Grid>
            <Grid item >{createCheckbox(classes, checkboxes, setCheckbox, Constants.NOT_TESTED.idx)}</Grid>

          </Grid>
        </Grid>

        {checkboxes[Constants.FAILED.idx].checked ?
          (<Grid item xs={12} sm={3} md={3} lg={2}>
            <Grid container direction="column" >
              <Grid item>{createCheckbox(classes, checkboxes, setCheckbox, Constants.CHECKSUM.idx)}</Grid>
              <Grid item>{createCheckbox(classes, checkboxes, setCheckbox, Constants.REDIRECTS.idx)}</Grid>
              <Grid item>{createCheckbox(classes, checkboxes, setCheckbox, Constants.DOWNLOAD.idx)}</Grid>
            </Grid>
          </Grid>) : null}

        {checkboxes[Constants.CHECKSUM.idx].checked ?
          (<Grid item xs={12} sm={3} md={3} lg={2}>
            <Grid container direction="column" >
              <Grid item>{createCheckbox(classes, checkboxes, setCheckbox, Constants.MD5.idx)}</Grid>
              <Grid item>{createCheckbox(classes, checkboxes, setCheckbox, Constants.SHA.idx)}</Grid>
            
            </Grid>
          </Grid>): null}

        {checkboxes[Constants.REDIRECTS.idx].checked ?
          (<Grid item xs={12} sm={3} md={3} lg={2}>
            <Grid container direction="column" >
              <Grid item >{createCheckbox(classes, checkboxes, setCheckbox, Constants.R301.idx)}</Grid>
              <Grid item >{createCheckbox(classes, checkboxes, setCheckbox, Constants.R302.idx)}</Grid>
            </Grid>
          </Grid>): null}

          {checkboxes[Constants.DOWNLOAD.idx].checked ?
          (<Grid item xs={12} sm={3} md={3} lg={2}>
            <Grid container direction="column" >
              <Grid item >{createCheckbox(classes, checkboxes, setCheckbox, Constants.TIMED_OUT.idx)}</Grid>
              <Grid item >{createCheckbox(classes, checkboxes, setCheckbox, Constants.NOT_FOUND.idx)}</Grid>
            </Grid>
          </Grid>): null}
    </React.Fragment>
  );
}

export default Checkboxes;

