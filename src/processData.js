import * as Constants from './Constants';

const semver= require('semver'); // semantic versioner


/**
 * Determines if the test has failed. 
 * A failure of JSON_NOT_TESTED means that no PTS Data is available to display so set the notTested flag.
 * @param {*} packages all the data
 */
const hasFailedStatus = (packages) => {
    return packages.some(pack => 
        pack.mirror.some(mirror => mirror.status === Constants.JSON_FAILED)   
)};

/**
 * 
 * In the case of no download.xml file, the test status will be NOT_TESTED.
 * This does not consitute a failure and also there is not point in getting child components.
 * @param {*} packages all the data
 */
function notTestedPackage(packages) {
    return packages.some(pack => 
        pack.mirror.some(mirror => 
                (mirror.status === Constants.JSON_NOT_TESTED)                            
        ) 
    
)};

/**
 * Determines if the package has timeout during the curl download.
 * @param {*} packages all the data
 */
function timedOutPackage(packages) {
    return packages.some(pack => 
        pack.mirror.some(mirror => 
             (mirror.downloadTime === Constants.JSON_TIMED_OUT)                            
        ) 
    
)};

/**
 * Returns all profiles that have not been tested
 * @param {*} data all the data
 */
function getNotTestedData(data) {
    if (data && data.length > 0 ) {
        return data.filter((profile) => 
            profile.packages.some((packs) => 
              packs.mirror.some(mirror => (mirror.status === Constants.JSON_NOT_TESTED)    
          )))
    } 
}

/**
 * Returns all profiles that have timed out during the curl download.
 * @param {*} data all the data
 */
function getTimedOutData(data) {
    if (data && data.length > 0 )
        return data.filter((profile) => 
            profile.packages.some((packs) => 
               packs.mirror.some(mirror => {
                   if (mirror['download-time'] === Constants.JSON_TIMED_OUT) {
                        let mirrorFailure = false;
                        if ("failures" in mirror) {
                            if ((typeof mirror.failures !== "string") && (Constants.JSON_ERROR in mirror.failures)) {
                                mirrorFailure = true;
                            }
                        }
                        return (mirror.status === Constants.JSON_FAILED && mirrorFailure)
                    }
                    return false;
                })))
}

/**
 * Returns all profiles that have a redirection HTTP Status code of 301 or 302
 * @param {*} data all the data
 */
function getRedirectData(data) {
    if (data && data.length > 0 ) {
      return data.filter((profile) => {
          return profile.packages.some((packs) => {
            return packs.mirror.some(mirror => {
                if (mirror.failures && mirror.failures.httpCode)  
                    return (mirror.status === Constants.JSON_FAILED && 
                        (mirror.failures.httpCode.toString().includes('301') || mirror.failures.httpCode.toString().includes('302')))
                 else
                    return false;     
            }  
        )})
    })
  } 
}  

/**
 * Returns subset of profiles that matches the searchCriteria defined by the ProfileName text field.
 * @param {*} data all the data
 * @param {*} value the value to search for within @data
 */
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

/**
 * Splits the profile name into the test profile name
 * @param {*} profileName   profile name such as pts/apache-1.2.1
 * @return {name, version}  {pts/apache, 1.2.1}
 */
function getProfileNameAndVersion(profileName) {
    const vpattern = /-\d.*/g;
    const npattern = /.*-/g;

    let matched = profileName.match(npattern)[0];  //match returns array
    let name = matched.slice(0, matched.length-1);
    matched = profileName.match(vpattern)[0];
    let version = matched.slice(1);

    return {profileName, name, version};
}

/**
 * Returns the latest version of each test profile
 * @param {*} data All test profiles
 * @return array [{profileName, name, version}] {pts/apache-1.2.1, pts/apache, 1.2.1} latest version of each profile 
 */
function getLatestVersion(data) {
    let profiles = [];

    if (data && data.length>0 ) {
        data.forEach((profile) => {
            let profileName = profile['profile-name'];
            let profileDetails = getProfileNameAndVersion(profileName);
            profile.version=profileDetails.version;
            profile.name=profileDetails.name;

            // Get the index of the profile name
            let idx = profiles.findIndex((curr) => curr.name === profileDetails.name);

            // If the profile name d.n.e add it to the latest list
            if (idx === -1) {    
                profile.versions = [profile.version];
                profiles.push(profile);
            } else {
                // If the profile does exist, store the lastest version
                if (semver.gt(profileDetails.version, profiles[idx].version)) {
                    profile.versions = [...profiles[idx].versions, profile.version];
                    profiles[idx] = profile;
                } 
            }
         })
    }
    return profiles;
}


export {getNotTestedData, getRedirectData, getSearchData, getFailedData, notTestedPackage, hasFailedStatus, timedOutPackage, getTimedOutData, getLatestVersion}

