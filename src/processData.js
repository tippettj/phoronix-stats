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

                        // If the download time is 0, the operation timed out. The checksums produced will be incorrect.
                         if ("download-time" in mirror &&
                             mirror['download-time'] === Constants.JSON_TIMED_OUT) {
                                mirrorColor=[...mirrorColor, Constants.COLOR_TIMEOUT];
                                timeError = true;
                         } else {
                            // Map the Checksums Failures
                            if (data[Constants.JSON_MD5] !== undefined ) {
                                mirrorColor=[...mirrorColor, Constants.COLOR_MD5];
                                checksumError = true;
                            }
                            if (data[Constants.JSON_SHA256] !== undefined ) {
                                mirrorColor=[...mirrorColor, Constants.COLOR_SHA];
                                checksumError = true;
                            }

                            // Map the Redirects Failures
                            if (data[Constants.JSON_HTTP_CODE] !== undefined  && data[Constants.JSON_HTTP_CODE].toString() === "301") {
                                mirrorColor=[...mirrorColor, Constants.COLOR_301];
                                redirectError = true;
                            }

                            if (data[Constants.JSON_HTTP_CODE] !== undefined  && data[Constants.JSON_HTTP_CODE].toString() === "302") {
                                mirrorColor=[...mirrorColor, Constants.COLOR_302];
                                redirectError = true;
                            }
                            
                            //  HTTP 404 failure
                            if (data[Constants.JSON_HTTP_CODE] !== undefined  && data[Constants.JSON_HTTP_CODE].toString() === "404") {
                                mirrorColor=[...mirrorColor, Constants.COLOR_404];
                                downloadError = true;
                            }

                            if (data[Constants.JSON_HTTP_CODE] !== undefined  && data[Constants.JSON_HTTP_CODE].toString() === "0") {
                                mirrorColor=[...mirrorColor, Constants.COLOR_HTTP_0];
                                downloadError = true;
                            }

                            // Other HTTP failures
                            if (data[Constants.JSON_HTTP_CODE] !== undefined  && !(
                              data[Constants.JSON_HTTP_CODE].toString() === "0" ||
                              data[Constants.JSON_HTTP_CODE].toString() === "404" ||
                              data[Constants.JSON_HTTP_CODE].toString() === "301" ||
                              data[Constants.JSON_HTTP_CODE].toString() === "302")) {
                                mirrorColor=[...mirrorColor, Constants.COLOR_HTTP];
                                downloadError = true;
                            }

                        }                                             
                    } else {

                        // Not Tested
                        if (mirror.status === Constants.JSON_NOT_TESTED) {
                            mirrorColor = [Constants.COLOR_NOT_TESTED];
                            notTested = true;
                        } else {
                            mirrorColor = [Constants.COLOR_PASS];
                        }
                    }

                    mirror.colorStatus = mirrorColor;
                    packageColor = [...packageColor, ...mirrorColor]
                    return mirror;
                })

                packs.colorStatus = Array.from( new Set(packageColor) );
                profileColor = [...profileColor, ...packageColor]
                return packs;   
            })

            profile.colorStatus = Array.from( new Set(profileColor) );

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
        col =  Constants.COLOR_WARNING;
    } else if (test.includes(Constants.COLOR_301) && test.length > 2){
        let otherFails = false;
        if (test.includes(Constants.COLOR_PASS)) {  
            otherFails = test.some(c => {                
                if ( c > 2 && c !== Constants.COLOR_301)
                    return true;  
                else
                    return false;
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
 * Splits the profile name into the test profile name
 * @param {*} profileName   profile name such as pts/apache-1.2.1
 * @return {name, version}  {pts/apache, 1.2.1}
 */
function getProfileNameAndVersion(profileName) {
    const version_regex = /-\d.\d.*/g;
    const name_regex = /.*-/g;

    let name_match = profileName.match(name_regex)[0];  //match returns array
    let name = name_match.slice(0, name_match.length-1);
    
    let version_match = profileName.match(version_regex)[0];
    let version = version_match.slice(1);

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

export {mapData, getColor, getSearchData,  notTestedPackage, hasFailedStatus, getLatestVersion}

