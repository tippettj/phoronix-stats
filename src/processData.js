import * as Constants from './Constants';


// Determines if the test has failed. 
// A failure of JSON_NOT_TESTED means that no PTS Data is available to display so set the notTested flag.
const hasFailedStatus = (packages) => {
    return packages.some(pack => 
        pack.mirror.some(mirror => mirror.status === Constants.JSON_FAILED)   
)};

// In the case of no download.xml file, the test status will be NOT_TESTED.
// This does not consitute a failure and there is not point in getting child components.
function notTestedPackage(packages) {
    return packages.some(pack => 
        pack.mirror.some(mirror => 
                (mirror.status === Constants.JSON_NOT_TESTED)                            
        ) 
    
)};

// Returns an all profiles that have not been tested
function getNotTestedData(data) {
    if (data && data.length > 0 ) {
        return data.filter((profile) => {
            // return notTestedPackage(profile);
            return profile.packages.some((packs) => {
              return packs.mirror.some(mirror => (mirror.status === Constants.JSON_NOT_TESTED)    
          )})
      })
    } 
}

// Returns all profiles that have a redirection HTTP Status code of 301 or 302
function getRedirectData(data) {
    if (data && data.length > 0 ) {
      return data.filter((profile) => {
          return profile.packages.some((packs) => {
            return packs.mirror.some(mirror => {
                if (mirror.failures && mirror.failures.vendor)   
                    return (mirror.status === Constants.JSON_FAILED && (mirror.failures.vendor.includes('301') || mirror.failures.vendor.includes('302')))
                else
                    return false;     
            }  
        )})
    })
  } 
}  

// Returns subset of profiles that matches the searchCriteria defined by the ProfileName text field.
const getSearchData = (data, value) => {
    let results = null;

    if (data && data.length > 0) {
        results = data.filter(profile => {
            return (profile['profile-name'].includes(value));
        })
    }
    return results;
}

/**
 * Returns all profiles failed when the search filters (checkboxes) have been applied.
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
 * When the user selects the Failed Checkbox, function returns records that satusfy the failed criteria
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

export {getNotTestedData, getRedirectData, getSearchData, getFailedData, notTestedPackage, hasFailedStatus}

