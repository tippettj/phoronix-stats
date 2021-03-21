import React, { useState } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import Grid from '@material-ui/core/Grid';
import { FormControlLabel } from '@material-ui/core';
import {getCheckboxColor} from './PTSSignifier';




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
  {filter: Constants.NONE},  
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

// export function createLegend(classes) {
//     return (<>  
//       <Grid item container direction="column" >
//       {/* <Paper className={classes.paper}>item 0</Paper> */}

//           <Grid item >  
//             <Grid container>
//               <Grid item xs={12} sm={6} md={6} lg={6}>
//                   {/* <Paper className={classes.paper}>item 1</Paper> */}
//                   <Typography>Failed Errors</Typography>
//                   {getLegend([Constants.COLOR_MD5], 'MD5 Error')}
//                   {getLegend([Constants.COLOR_SHA], 'SHA256 Error')}
//                   {getLegend([Constants.COLOR_301], 'Redirect 301 Error')}
//                   {getLegend([Constants.COLOR_302], 'Redirect 302 Error')}
//                   {getLegend([Constants.COLOR_TIMEOUT], 'Download Timed Out')}
//                   {getLegend([Constants.COLOR_404], 'Not Found 404 Error')}
//                   {getLegend([Constants.COLOR_HTTP_0], 'HTTP 0 Error')}
//                </Grid>
//                <Grid item xs={12} sm={6} md={6} lg={6}>
//                   {/* <Paper className={classes.paper}>item 2</Paper> */}
//                   {/* Use Box element to make it bold */}
//                   <Typography fontWeight='fontWeightBold'>Profile Status</Typography> 
//                   <Typography className={classes.profileName} color={getProfileColor(Constants.COLOR_PASS,false)}>Profile Passed</Typography>
//                   <Typography className={classes.profileName} color={getProfileColor(Constants.COLOR_FAIL, false)}>Profile has failures</Typography>
//                   <Typography className={classes.profileName} color={getProfileColor(Constants.COLOR_WARNING, false)}>Profile has potential failures</Typography>
//                   <Typography className={classes.profileName} color={getProfileColor(Constants.COLOR_FATAL, false)}>All mirrors failed</Typography>
//               </Grid>
//             </Grid>
//           </Grid>
//       </Grid>
//     </>)
// }
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

/**
 * Radio works same as createCheckboxes, except from UI perspective it provide an OR functionality
 * @param {*} classes 
 * @param {*} checkboxes 
 * @param {*} setCheckbox 
 * @param {*} index 
 * @returns 
 */
const createRadio = (classes, checkboxes, setCheckbox, index) => {
  const chCol = getCheckboxColor(index);
  //console.log("!!!CreateRadio", index, checkboxes);
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

// const getLegend = (colIdx, colName) => {
//   //console.log("++++", colName);
//   return (
//     <Grid item container="row">
//       <Grid item><PTSSignifier colorStatus={colIdx}/></Grid>
//       <Grid item style={{marginLeft:'1em'}}><Typography>{colName}</Typography></Grid>
//     </Grid>
//   );
// }

function createCheckbox(classes, checkboxes, setCheckbox, index) {
  const chCol = getCheckboxColor(index);
  //console.log("!!!Loading", index, checkboxes[index]);
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

function Checkboxes({ checkboxes, setCheckbox, displayLegend}) {
  const classes =useStyles();
  //console.log("!!!!In Checkboxes, legend", displayLegend );

  return (
    <React.Fragment>

      <Grid item xs={12} sm={6} md={2} lg={2}>
          {/* <Paper style={{marginTop:"2em"}} className={classes.paper}>XXXGrid 3-21</Paper> */}
          <Grid container direction="column" >
            {/* <Paper style={{marginTop:"2em"}} className={classes.paper}>XXXGrid 3-22</Paper> */}
            <Grid item>{createCheckbox(classes, checkboxes, setCheckbox, Constants.ALL.idx)}</Grid>
            <Grid item>{createCheckbox(classes, checkboxes, setCheckbox, Constants.LATEST.idx)}</Grid>
            <Grid item>{createCheckbox(classes, checkboxes, setCheckbox, Constants.FAILED.idx)}</Grid>
            <Grid item >{createCheckbox(classes, checkboxes, setCheckbox, Constants.NOT_TESTED.idx)}</Grid>

          </Grid>
      </Grid>
      <Grid item xs={12} sm={6} md={2} lg={2}>
         {/* <Paper style={{marginTop:"2em"}} className={classes.paper}>XXXGrid 3-23</Paper> */}
         {checkboxes[Constants.FAILED.idx].checked ?
            (<>
              <Grid container direction="column" >
                {/* <Paper style={{marginTop:"2em"}} className={classes.paper}>XXXGrid 3-24</Paper> */}
                <Grid>{createRadio(classes, checkboxes, setCheckbox, Constants.CHECKSUM.idx)}</Grid>
                <Grid>{createRadio(classes, checkboxes, setCheckbox, Constants.REDIRECTS.idx)}</Grid>
                <Grid>{createRadio(classes, checkboxes, setCheckbox, Constants.DOWNLOAD.idx)}</Grid>
                <Grid>{createRadio(classes, checkboxes, setCheckbox, Constants.NONE.idx)}</Grid>
              </Grid></>
              ) : null}
      </Grid>
      {/* <Grid item xs={3}>
          <Paper style={{marginTop:"2em"}} className={classes.paper}>XXXGrid 4-1</Paper>
      </Grid>
      <Grid item xs={3}>
         <Paper style={{marginTop:"2em"}} className={classes.paper}>XXXGrid 4-2</Paper>
      </Grid> */}


        {/* <Grid item xs={12} sm={3} md={2} lg={2}>
          <Paper className={classes.paper}>item box 1</Paper>

          <Grid container direction="column" >
            <Grid item>{createCheckbox(classes, checkboxes, setCheckbox, Constants.ALL.idx)}</Grid>
            <Grid item>{createCheckbox(classes, checkboxes, setCheckbox, Constants.LATEST.idx)}</Grid>
            <Grid item>{createCheckbox(classes, checkboxes, setCheckbox, Constants.FAILED.idx)}</Grid>
            <Grid item >{createCheckbox(classes, checkboxes, setCheckbox, Constants.NOT_TESTED.idx)}</Grid>

          </Grid>
        </Grid> */}

        {/* {checkboxes[Constants.FAILED.idx].checked ?
          (<Grid item xs={12} sm={3} md={3} lg={2}>
           
            <Grid container direction="column" >
                <Grid item container="row" justify="center" alignItems="center" >
                  <Grid item xs={9}>{createRadio(classes, checkboxes, setCheckbox, Constants.CHECKSUM.idx)}</Grid>
                  <Grid item xs={9}>{createRadio(classes, checkboxes, setCheckbox, Constants.REDIRECTS.idx)}</Grid>
                  <Grid item xs={9}>{createRadio(classes, checkboxes, setCheckbox, Constants.DOWNLOAD.idx)}</Grid>
                  <Grid item xs={9}>{createRadio(classes, checkboxes, setCheckbox, Constants.NONE.idx)}</Grid>
                </Grid> */}

                  
             
              {/* <Grid item>{createCheckbox(classes, checkboxes, setCheckbox, Constants.CHECKSUM.idx)}</Grid> */}
              {/* <Grid item>{createCheckbox(classes, checkboxes, setCheckbox, Constants.REDIRECTS.idx)}</Grid> */}
              {/* <Grid item>{createCheckbox(classes, checkboxes, setCheckbox, Constants.DOWNLOAD.idx)}</Grid> */}
            {/* </Grid>
          </Grid>) : null} */}

        {/* {checkboxes[Constants.CHECKSUM.idx].checked ?
          (<Grid item xs={12} sm={3} md={3} lg={2}>
            <Grid container direction="column" style={{padding:'2px', marginTop:'0.5em'}}>
              {getLegend([Constants.COLOR_MD5], 'MD5 Error')}
              {getLegend([Constants.COLOR_SHA], 'SHA256 Error')} */}
             
              {/* <Grid item>{createCheckbox(classes, checkboxes, setCheckbox, Constants.MD5.idx)}</Grid> */}
              {/* <Grid item>{createCheckbox(classes, checkboxes, setCheckbox, Constants.SHA.idx)}</Grid> */}
            {/* </Grid>
          </Grid>): null} */}

        {/* {checkboxes[Constants.REDIRECTS.idx].checked ?
          (<Grid item xs={12} sm={3} md={3} lg={2}>
            <Grid container direction="column" >
              {getLegend([Constants.COLOR_301], 'HTTP 301 Error')}
              {getLegend([Constants.COLOR_302], 'HTTP 302 Error')} */}

              {/* <Grid item >{createCheckbox(classes, checkboxes, setCheckbox, Constants.R301.idx)}</Grid>
              // <Grid item >{createCheckbox(classes, checkboxes, setCheckbox, Constants.R302.idx)}</Grid> */}
            {/* </Grid>
          </Grid>): null} */}

          {/* {checkboxes[Constants.DOWNLOAD.idx].checked ?
          (<Grid item xs={12} sm={3} md={3} lg={2}>
            <Grid container direction="column" >
                {getLegend([Constants.COLOR_TIMEOUT], 'HTTP 0 or timeout')}
                {getLegend([Constants.COLOR_404], 'HTTP 404 Error')}
                {getLegend([Constants.COLOR_HTTP_0], 'HTTP 0 Error')} */}

              {/* <Grid item >{createCheckbox(classes, checkboxes, setCheckbox, Constants.TIMED_OUT.idx)}</Grid> */}
              {/* <Grid item >{createCheckbox(classes, checkboxes, setCheckbox, Constants.NOT_FOUND.idx)}</Grid> */}
            {/* </Grid>
          </Grid>): null} */}

          {/* {(checkboxes[Constants.FAILED.idx].checked && checkboxes[Constants.NONE.idx].checked )?
          (
          
            <Grid item xs={12} sm={3} md={3} lg={2}>
            <Grid container direction="column" >
                {getLegend([Constants.COLOR_MD5], 'MD5 Error')}
                {getLegend([Constants.COLOR_SHA], 'SHA256 Error')}
                {getLegend([Constants.COLOR_301], 'HTTP 301 Error')}
                {getLegend([Constants.COLOR_302], 'HTTP 302 Error')}
                {getLegend([Constants.COLOR_TIMEOUT], 'HTTP 0 or timeout')}
                {getLegend([Constants.COLOR_404], 'HTTP 404 Error')}
                {getLegend([Constants.COLOR_HTTP_0], 'HTTP 0 Error')} */}

              {/* <Grid item >{createCheckbox(classes, checkboxes, setCheckbox, Constants.TIMED_OUT.idx)}</Grid> */}
              {/* <Grid item >{createCheckbox(classes, checkboxes, setCheckbox, Constants.NOT_FOUND.idx)}</Grid> */}
            {/* </Grid>

          </Grid>): null} */}

          {/* {displayLegend ?
          (<>
            <Grid item xs={12} sm={3} md={3} lg={2}></Grid>
          
            <Grid item xs={12} sm={3} md={3} lg={2}>
            <Grid container direction="column" >
                {getLegend([Constants.COLOR_MD5], 'MD5 Error')}
                {getLegend([Constants.COLOR_SHA], 'SHA256 Error')}
                {getLegend([Constants.COLOR_301], 'HTTP 301 Error')}
                {getLegend([Constants.COLOR_302], 'HTTP 302 Error')}
                {getLegend([Constants.COLOR_TIMEOUT], 'HTTP 0 or timeout')}
                {getLegend([Constants.COLOR_404], 'HTTP 404 Error')}
                {getLegend([Constants.COLOR_HTTP_0], 'HTTP 0 Error')} */}

              {/* <Grid item >{createCheckbox(classes, checkboxes, setCheckbox, Constants.TIMED_OUT.idx)}</Grid> */}
              {/* <Grid item >{createCheckbox(classes, checkboxes, setCheckbox, Constants.NOT_FOUND.idx)}</Grid> */}
            {/* </Grid>

          </Grid></>): null} */}


    </React.Fragment>
  );
}

export default Checkboxes;


