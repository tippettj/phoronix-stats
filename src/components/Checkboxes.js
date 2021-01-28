import React, { useState } from 'react';
import * as Constants from "../Constants";

// List of checkboxes that can be applied to the JSON data to extract results
const checkboxList = [
    Constants.ALL,
    Constants.FAILED,
    Constants.REDIRECT,
    Constants.MD5,
    Constants.SHA256,
  ];

// Takes the filter list and sets default properties to create checkboxes
const getDefaultCheckboxes = () =>
  checkboxList.map(box => ({
    name: box,
    checked: false,
    visibility: true,
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
    <>
      {checkboxes.map((checkbox, i) => (
        <label key={i}>
          <input
            type="checkbox"
            checked={checkbox.checked}
            onChange={e => {
              setCheckbox(i, e.target.checked);
            }}
          />
          {checkbox.name}
        </label>
      ))}
    </>
  );
}

export default Checkboxes;

