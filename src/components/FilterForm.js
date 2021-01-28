import React, {useState} from 'react';
import Checkboxes, {useCheckboxes} from './Checkboxes';
import DisplayResults from './DisplayResults';
import * as Constants from '../Constants'


export function FilterForm(props) {
    const [display, setDisplay] = useState(false);  // display the results of the search on the page
    const checkboxes = useCheckboxes();             // filter to determine which results to display

    // display the results on the page
    const handleSubmit = (event) => {
        event.preventDefault();
        setDisplay(true);
    }

    // clear form of all data and reset checkboxes
    const clearForm = (event) => {
        checkboxes.checkboxes.map((box, idx) => checkboxes.setCheckbox(idx, false));
        setDisplay(false);
        event.preventDefault();
    }

    /**
     * When the user selects the Failed Checkbox, function returns records that file the failed criteria
     * @param {*} fData The mirror array containing the failed data
     * @param {*} searchFilters The filters to apply for one or more specific failures ie md5
     * @returns boolean true if a match fitting the search criteria has been found
     */
    function getSpecificFailures(fData, searchFilters) {
        let data = fData.failures;  // JSON failure details
        let failedData = null;      

        // if only the Failed Checkbox has been selected then return all records that failed, otherwise return
        // only those failed records that match the selected checkboxes. ie md5 or sha256
        if (searchFilters.length === 1 && searchFilters.includes(Constants.FAILED) ) 
            failedData = (fData.status === Constants.JSON_FAILED);
        else if (searchFilters.includes(Constants.MD5) && searchFilters.includes(Constants.SHA256))
            failedData = (data.md5 !== undefined || data.sha256 !== undefined)
        else if (searchFilters.includes(Constants.MD5) && !searchFilters.includes(Constants.SHA256))
            failedData = (data.md5 !== undefined )
        else if (searchFilters.includes(Constants.SHA256) && !searchFilters.includes(Constants.MD5)) 
            failedData= (data.sha256 !== undefined)

        return failedData;
    }

    /**
     * Get all data that failed the test
     * @param {*} data the complete set of data
     * @param {*} searchFilters the filters to apply to extract data that failed. ie all failures, all md5 failures... 
     */
    function getFailedData(data, searchFilters = null) {
        let testProfile = null;

        if (data && data.length>0 ) {
          testProfile = data.filter((profile) => {
              return profile.packages.some((packs) => {
                return packs.mirror.some(mirror => {
                   if (mirror.status === Constants.JSON_FAILED) {
                       if (!searchFilters) 
                            return true;
                        else 
                           return getSpecificFailures( mirror, searchFilters);
                    } else { 
                        return false;
                    }
                }  
            )})
        })
        return testProfile;
      } 
    }

   
    /**
     * Get the data to display
     * @param {*} data all the json results
     * 
     */
    const getData = (data) => {
        let results = data;
        const filters = checkboxes.checkboxes.filter((checks) => checks.checked === true).map((checkbox) => checkbox.name);

        if (filters.includes("All")) 
            results = data;

        if (filters.includes(Constants.FAILED)) 
            results = getFailedData(data, filters);
      
        console.log("Results -->", results);
        return results;
    }

    return(
        <React.Fragment>
            <form onSubmit={(e) => handleSubmit(e)}>
                <p>Select the results to display:</p>
                <Checkboxes {...checkboxes}/>
                <input type="submit" name="search" value="search"></input>
                <input type="submit" onClick={(e) => clearForm(e)} name="clear" value="clear" ></input>
                {(display) ? <DisplayResults results={getData(props.data)}/> : null }
            </form>
        </React.Fragment>
    )
}
