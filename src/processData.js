import * as Constants from './Constants';

const semver= require('semver'); // semantic versioner

function mapData(data) {
    let testProfile = null;
    let dataMap = {
        failed : [],
        checksum : [],
        redirect : [],
        download : [],
        timeOut : [],
        notTested : []
    };

    if (data && data.length>0 ) {
        testProfile = data.map((profile) => {
            let checksumError, redirectError, downloadError, timeError, failError, notTested=null;
            let profileColor = [];
                
            profile.packages.map((packs) => {
                let packageColor = [];
                
                packs.mirror.map(mirror => {
                    let mirrorColor = [];

                    if (mirror.status === Constants.JSON_FAILED) {
                        mirrorColor = [Constants.COLOR_FAIL];
                        failError = true;
                        let data = mirror.failures;
                        //console.log("+fail");

                        // If the download time is 0, the operation timed out. The checksums produced will be incorrect.
                         if ("download-time" in mirror &&
                             mirror['download-time'] === Constants.JSON_TIMED_OUT) {
                                //console.log("+to");
                                mirrorColor=[...mirrorColor, Constants.COLOR_TIMEOUT];
                                timeError = true;
                         } else {
                            // Map the Checksums Failures
                            if (data[Constants.JSON_MD5] !== undefined ) {
                                //console.log("+md5");
                                mirrorColor=[...mirrorColor, Constants.COLOR_MD5];
                                checksumError = true;
                            }
                            if (data[Constants.JSON_SHA256] !== undefined ) {
                                //console.log("+sha");
                                mirrorColor=[...mirrorColor, Constants.COLOR_SHA];
                                checksumError = true;
                            }

                            // Map the Redirects Failures
                            if (data[Constants.JSON_HTTP_CODE] !== undefined  && data[Constants.JSON_HTTP_CODE].toString() === "301") {
                                //console.log("+301");
                                mirrorColor=[...mirrorColor, Constants.COLOR_301];
                                redirectError = true;

                                // Ok - as per requirements, a 301 is not necessarily a failure so we will change the status
                                // from a failure to a pass however it will still be tagged with a 301 error.
                                //mirror.status = "Warning";
                                //console.log(packs['identifier'], " rewritten to be a pass");
                            }

                            if (data[Constants.JSON_HTTP_CODE] !== undefined  && data[Constants.JSON_HTTP_CODE].toString() === "302") {
                                //console.log("+302");
                                mirrorColor=[...mirrorColor, Constants.COLOR_302];
                                redirectError = true;
                            }
                            
                            //  HTTP 404 failure
                            if (data[Constants.JSON_HTTP_CODE] !== undefined  && data[Constants.JSON_HTTP_CODE].toString() === "404") {
                                //console.log("+404");
                                mirrorColor=[...mirrorColor, Constants.COLOR_404];
                                downloadError = true;
                            }

                            if (data[Constants.JSON_HTTP_CODE] !== undefined  && data[Constants.JSON_HTTP_CODE].toString() === "0") {
                                //console.log("+404");
                                mirrorColor=[...mirrorColor, Constants.COLOR_HTTP_0];
                                downloadError = true;
                            }

                            // Other HTTP failures
                            if (data[Constants.JSON_HTTP_CODE] !== undefined  && !(
                              data[Constants.JSON_HTTP_CODE].toString() === "0" ||
                              data[Constants.JSON_HTTP_CODE].toString() === "404" ||
                              data[Constants.JSON_HTTP_CODE].toString() === "301" ||
                              data[Constants.JSON_HTTP_CODE].toString() === "302")) {
                                //console.log("+http", data[Constants.JSON_HTTP_CODE]);
                                mirrorColor=[...mirrorColor, Constants.COLOR_HTTP];
                                downloadError = true;
                            }

                        }                                             
                    } else {

                        // Not Tested
                        if (mirror.status === Constants.JSON_NOT_TESTED) {
                            //console.log("+notTested");
                            mirrorColor = [Constants.COLOR_NOT_TESTED];
                            notTested = true;
                        } else {
                            mirrorColor = [Constants.COLOR_PASS];
                        }
                    }

                    mirror.colorStatus = mirrorColor;
                    //console.log("--------", mirror['url'], mirror.colorStatus);
                    packageColor = [...packageColor, ...mirrorColor]
                    return mirror;
                })

                packs.colorStatus = Array.from( new Set(packageColor) );
                //console.log("-----", packs['pts-filename'], packs.colorStatus);
                profileColor = [...profileColor, ...packageColor]
                return packs;   
            })

            //console.log("Profile color", profileColor);
            //let cleanProf = new Set(profileColor);
            profile.colorStatus = Array.from( new Set(profileColor) );
            //console.log(profile['profile-name'], profile.colorStatus);

            if (notTested)
                dataMap.notTested.push(profile);
            if (failError)
                dataMap.failed.push(profile);
            if (checksumError)
                dataMap.checksum.push(profile);
            if (redirectError)
                dataMap.redirect.push(profile);
            if (downloadError)
                dataMap.download.push(profile);
            if (timeError)
                dataMap.timeOut.push(profile);


            // if (failError || checksumError || redirectError || downloadError || timeError || notTested)
            //     console.log("data map", dataMap);

            return profile;
       
        })   
    } 
    //console.log("Test Profile", testProfile.colorStatus);
    //console.log("total fails", fails);
    //console.log("Returning dataMap", dataMap);
    return {testProfile, dataMap};
}

/**
 * Determines if the test has failed. 
 * A failure of JSON_NOT_TESTED means that no PTS Data is available to display so set the notTested flag.
 * @param {*} packages all the data
 */
const getColor = (test) => {
    let col = Constants.COLOR_PASS;

    if (test.includes(Constants.COLOR_FAIL))
        col = Constants.COLOR_FAIL;
    if (!test.includes(Constants.COLOR_PASS) && !test.includes(Constants.COLOR_NOT_TESTED))
        col = Constants.COLOR_FATAL;

    // If the test is a 301 redirect, it's probably not a failure so mark as a warning
    // however is one of the mirrors contains another failure, mark it as a fail
    if (test.includes(Constants.COLOR_301) && test.length === 2) {
        console.log("!!returning warning");
        col =  Constants.COLOR_WARNING;
    } else if (test.includes(Constants.COLOR_301) && test.length > 2){
        let otherFails = false;
        if (test.includes(Constants.COLOR_PASS)) {  
            otherFails = test.some(c => {                
                if ( c > 2 && c !== Constants.COLOR_301)
                    return true;  
            })
            col = (otherFails) ? Constants.COLOR_FAIL : Constants.COLOR_PASS;
        } else {
            col = Constants.COLOR_WARNING;
        }
    }

    return col; 
};

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
            let profileColor = [];

            let z = profile.packages.filter((packs) => {
                //console.log("    **** filtering mirrors with errors",packs);
                let packageColor = [];
                let x = packs.mirror.filter(mirror => {

                    if (mirror.status === Constants.JSON_FAILED) {
                        let y = null;
                    //console.log(packs['identifier'], "httpCode", mirror.failures[Constants.JSON_HTTP_CODE]);
                    if (searchFilters.includes(Constants.CHECKSUM.name) && (searchFilters.includes(Constants.MD5.name) || searchFilters.includes(Constants.SHA.name))) {
                            let {failedData, colorStatus} = getChecksumFailures( mirror, searchFilters, packs);
                            y=failedData;
                            if ( y !== undefined) {
                                //console.log("!!!!", packs['identifier'], y, colorStatus);
                                packageColor = [...packageColor, ...colorStatus];
                            }
                    } else if (searchFilters.includes(Constants.DOWNLOAD.name) || searchFilters.includes(Constants.TIMED_OUT.name)) {
                            let {failedData, colorStatus}= getDownloadFailures(mirror, searchFilters, packs);
                            y=failedData;
                            if ( y !== undefined) {
                                //console.log("####", mirror['url'], y, colorStatus);
                                packageColor = [...packageColor, ...colorStatus];
                            }        
                    } else {
                            y= true;
                    }
                    //console.log(packs['identifier'], "mirror failed", y);
                    if (y) 
                        return mirror;
                    else 
                        return false;
                    //return y;
                    } else { 
                        //console.log(packs['identifier'], "mirror did not fail ", false);
                        return false;

                    }
                })
                //console.log("    **** filtered mirrors",packs.mirror,"to",x);

               // console.log(packs['identifier'], "package returning", x.length);
                if ( x.length === 0)
                    return false;
                else {
                    packs.colorStatus = packageColor;
                    //console.log("@@@@", "packs",...packs.colorStatus, "profile",...profileColor);
                    profileColor = [...profileColor, ...packageColor];
                    //profileColor = new Set([...profileColor, ...packageColor]); // set will not repeat a color
                    //console.log("returning ", packs.colorStatus);

                    return packs;
                }
            })
            //console.log("  **** filtered packages",profile.packages,"to",z);

            profile.colorStatus = profileColor;

        if ( z.length === 0)
            return false;
        else {
           // console.log("returning ", packs);
            return z;  /** MTP */
        }

        //console.log("profile returning", z);
        //return z;
    })

    //console.log("**** filtering profiles",data,"to",testProfile);

   
    console.log("Exiting getFailedData with ", testProfile);
    return testProfile;
  } // **MTP** Need an else to return something
}

/**
 * When the user selects the Failed Checkbox, function returns records that satisfy the failed criteria
 * @param {*} mirror The mirror array containing the failed data
 * @param {*} searchFilters The filters to apply for one or more specific failures ie md5
 * @returns boolean true if a match fitting the search criteria has been found
 */
function getChecksumFailures(mirror, searchFilters,packs) {
    let data = mirror.failures;  // JSON failure details
    let failedData = null;   
    let colorStatus = [];   

    //console.log("Getting CheckSum Failures....");

    // If md5 and sha256 dne then this is not a checksum failure
    if (!data.md5 && !data.sha256) {
        //console.log(packs['identifier'], "returning false no checksum");
        return false;
    }

    // If the download time is 0, the operation timed out. The checksums produced will be incorrect.
    if ("download-time" in mirror) {
        if (mirror['download-time'] === Constants.JSON_TIMED_OUT) {
            //console.log(packs['identifier'], "returning false download 0");
            return false;
        }
    }
    //console.log(packs['identifier'], "md5", data.md5, "sha", data.sha256);

 
    // if only the Failed Checkbox has been selected then return all records that failed, otherwise return
    // only those failed records that match the selected checkboxes. ie md5 or sha256
    console.log(packs, mirror.status, "md5", data.md5, "sha", data.sha256);
    if (searchFilters.length <= 2 && searchFilters.includes(Constants.FAILED.name) ) {
        failedData = (mirror.status === Constants.JSON_FAILED);
        colorStatus = [Constants.COLOR_FAIL];
     } else if (searchFilters.includes(Constants.MD5.name) && searchFilters.includes(Constants.SHA.name)) {
        failedData = (data.md5 !== undefined || data.sha256 !== undefined);
        if (data.md5) {
            colorStatus=[...colorStatus, Constants.COLOR_MD5];
            //console.log("...setting md5 color");
        }
        if (data.sha256){ 
            colorStatus=[...colorStatus, Constants.COLOR_SHA] ;
           // console.log("...setting sha color");

        }       
     } else if (searchFilters.includes(Constants.MD5.name) && !searchFilters.includes(Constants.SHA.name)) {
        failedData = (data.md5 !== undefined )
        colorStatus = [Constants.COLOR_MD5];
    } else if (searchFilters.includes(Constants.SHA.name) && !searchFilters.includes(Constants.MD5.name)) {
        failedData= (data.sha256 !== undefined)
        colorStatus = [Constants.COLOR_SHA];
    }

    if (failedData !== false)
        console.log("^^^^", packs['identifier'], "returning ", failedData, "color", colorStatus);
    return {failedData, colorStatus};
}

function getDownloadFailures(mirror, searchFilters, packs) {
    let data = mirror.failures;  // JSON failure details
    let failedData = null;   
    let colorStatus = [];
    let searchTimeOut = searchFilters.includes(Constants.TIMED_OUT.name);
    let searchNotFound = searchFilters.includes(Constants.NOT_FOUND.name);
  
    console.log("Getting Download Failures....");

    //console.log(packs, "mirrorStatus", mirror.status,  "TimedOut", mirror['download-time'], "HTTP", mirror.failures[Constants.JSON_HTTP_CODE]);
    if ((searchFilters.length <= 2) && (searchFilters.includes(Constants.FAILED.name))) {
        failedData = (mirror.status === Constants.JSON_FAILED);
        if (failedData)
            colorStatus = [Constants.COLOR_FAIL];
    }
    
    if (searchTimeOut){
        failedData = (mirror['download-time'] === Constants.JSON_TIMED_OUT);
        if (failedData)
            colorStatus = [Constants.COLOR_TIMEOUT];

    }

    // if (searchNotFound) {
    //     failedData = (mirror.failures[Constants.JSON_HTTP_CODE] === Constants.HTTP_404);
    //     if (failedData)
    //         colorStatus = [Constants.COLOR_HTTP_404];
    // }
        // else if (searchFilters.includes(Constants.NOT_TESTED.name) && !searchFilters.includes(Constants.TIMED_OUT.name))
    //     failedData = (data.JSON_NOT_TESTED !== undefined );
    // else if (!searchFilters.includes(Constants.NOT_TESTED.name) && searchFilters.includes(Constants.TIMED_OUT.name)) 
    //     failedData= (mirror['download-time'] === Constants.JSON_TIMED_OUT);
    console.log(".........", packs['identifier'], failedData, colorStatus);
    return {failedData, colorStatus};
                  
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

// const getProfileColor = (profile, translate=true) => {
//     let color = profile;
//     if (translate)
//         color = getColor(profile);
//         console.log("getProfileColor", profile, color);

//     let returnCol;
//     switch (color) {
//         case Constants.COLOR_PASS:
//             returnCol = theme.palette.primary.main;
//             break;
//         case Constants.COLOR_WARNING:
//             returnCol = 'textSecondary';
//             break;
//         case Constants.COLOR_FAIL:
//             returnCol = 'secondary';
//             break;
//         case Constants.COLOR_FATAL:
//             returnCol = 'error';
//             break;
//         default:
//             returnCol = 'secondary';
//     }
//     console.log('#####',profile, returnCol);
//     return returnCol;
// }


export {mapData, getColor, getNotTestedData, getRedirectData, getSearchData, getFailedData, notTestedPackage, hasFailedStatus, timedOutPackage, getTimedOutData, getLatestVersion}

