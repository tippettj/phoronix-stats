// Checkbox Index
export const ALL_IDX = 0;
export const LATEST_IDX = 1;
export const FAILED_IDX = 2;
export const MD5_IDX = 3;
export const SHA_IDX = 4;
export const REDIRECTS_IDX = 5;
export const NOT_TESTED_IDX = 6;
export const TIMED_OUT_IDX = 7;
export const CHECKSUM_IDX = 8;
export const DOWNLOAD_IDX = 9;
export const NOT_FOUND_IDX = 10;
export const R301_IDX = 11;
export const R302_IDX = 12;
export const NONE_IDX = 13;

//Colors
export const COLOR_NEUTRAL=0
export const COLOR_PASS=1
export const COLOR_FAIL=2
export const COLOR_MD5=3
export const COLOR_SHA=4
export const COLOR_TIMEOUT=5
export const COLOR_HTTP_0=6
export const COLOR_HTTP_404=7
export const COLOR_301=8
export const COLOR_302=9
export const COLOR_404=10
export const COLOR_HTTP=11
export const COLOR_NOT_TESTED=12
export const COLOR_WARNING=13
export const COLOR_FATAL=14
export const COLOR_CHECKSUM=15
export const COLOR_REDIRECT=16
export const COLOR_DOWNLOAD=17
export const COLOR_NO_CATEGORY=18

/**
 * To enable a checkbox:
 * 1. Declare a constant IDX as above
 * 2. define the Checkbox conditions as per the following:
    export const <Filter assocated with CHECKBOX> = {
        <Label for check box, string>: "Failed",
        <index - must be declared as a contant, integer, defined as constant>: FAILED_IDX,
        <checked - initial state of checkbox, true|false>: false,
        <disabled - intial state of checkbox button, true|false: false,
        <children - checkboxes to be displayed when checked = true, array of integers, defined as constant>: [CHECKSUM_IDX, REDIRECTS_IDX, DOWNLOAD_IDX],
        <competes - checkboxes that cannot be selected at the same time as this checkbox, array of integers, : [ NOT_TESTED_IDX, TIMED_OUT_IDX],
        <desc - tooltip description if enabled>: "Displays all test profiles that failed",
    } 
 
    Modify other checkboxes
    - If this is a child, add it to the children array of the parent
    - If this checkbutton has competition, add it to the compete array of the competition

 * 3. Checkboxes.js
        1. Add the checkbox to the const checkboxList
        2. Add the checkbox as a GridItem in the function Checkboxes()
 * 4. When the checkbox is selected, it will automatically be added to the filter selection in FilterForm.getData()
 */


export const ALL = {
    name: "All Versions",
    idx: ALL_IDX,
    checked: false,
    disabled: false,
    competes:[LATEST_IDX],
    desc: "Displays all tests profiles",
}

export const LATEST = {
    name: "Latest Versions",
    idx: LATEST_IDX,
    checked: true,
    disabled: false,
    competes:[ALL_IDX],
    desc: "Displays latest version of each test profile",
}

export const FAILED = {
    name: "Failed",
    idx: FAILED_IDX,
    checked: false,
    disabled: false,
    children: [CHECKSUM_IDX, REDIRECTS_IDX, DOWNLOAD_IDX],
    competes: [ NOT_TESTED_IDX],
    //hide: [ NOT_TESTED_IDX, TIMED_OUT_IDX],
    desc: "Displays all test profiles that failed",
}

export const NONE = {
    name: "All",
    idx: NONE_IDX,
    checked: true,
    disabled: false,
    competes:[REDIRECTS_IDX, DOWNLOAD_IDX, CHECKSUM_IDX],
    children: [MD5_IDX, SHA_IDX, R301_IDX,R302_IDX],
    desc: "Displays all test profiles with an invalid checksum",
}

export const NOT_TESTED = {
    name: "Not Tested",
    idx: NOT_TESTED_IDX,
    checked: false,
    disabled: false,
    competes: [FAILED_IDX],
    desc: "Displays all tests profiles which were not tested",
}

export const MD5 = {
    name: "MD5 Failed",
    idx: MD5_IDX,
    checked: false,
    disabled: true,
    desc: "Displays all test profiles with an invalid MD5 checksum",
}

export const SHA = {
    name: "SHA256 Failed",
    idx: SHA_IDX,
    checked: false,
    disabled: true,
    desc: "Displays all test profiles with an invalid SHA256 checksum",
}

export const CHECKSUM = {
    name: "Checksums",
    idx: CHECKSUM_IDX,
    checked: false,
    disabled: true,
    competes:[REDIRECTS_IDX, DOWNLOAD_IDX, NONE_IDX],
    children: [MD5_IDX, SHA_IDX],
    desc: "Displays all test profiles with an invalid checksum",
}

export const DOWNLOAD = {
    name: "Downloads",
    idx: DOWNLOAD_IDX,
    checked: false,
    disabled: true,
    competes:[REDIRECTS_IDX, CHECKSUM_IDX, NONE_IDX],
    children: [TIMED_OUT_IDX, NOT_FOUND_IDX],
    //children: [TIMED_OUT_IDX],
    desc: "Displays all test profiles with download issues",
}

export const TIMED_OUT = {
    name: "Timed Out",
    idx: TIMED_OUT_IDX,
    checked: false,
    disabled: false,
    competes:[NOT_FOUND_IDX],
    desc: "Displays all tests profiles that timed out during the download",
}

export const NOT_FOUND = {
    name: "404 - Not Found",
    idx: NOT_FOUND_IDX,
    checked: false,
    disabled: false,
    competes:[TIMED_OUT_IDX],
    desc: "Displays all tests profiles that produced a HTTP 404",
}

export const REDIRECTS = {
    name: "Redirects",
    idx: REDIRECTS_IDX,
    checked: false,
    disabled: true,
    children: [R301_IDX, R302_IDX],
    competes:[CHECKSUM_IDX, DOWNLOAD_IDX, NONE_IDX],
    desc: "Displays all test profiles with A HTTP redirect status",
}

export const R301 = {
    name: "301 Error",
    idx: R301_IDX,
    checked: false,
    disabled: true,
    desc: "Displays all test profiles with a HTTP Status of 301",
}

export const R302 = {
    name: "302 Error",
    idx: R302_IDX,
    checked: false,
    disabled: true,
    desc: "Displays all test profiles with a HTTP Status of 302",
}

// JSON
export const JSON_FAILED = "Failed";    
export const JSON_FAILURES = "Failures"; 
export const JSON_PASSED = "Passed";
export const JSON_MD5 = "md5";
export const JSON_SHA256 = "sha256";
export const JSON_NOT_TESTED="Not Tested";
export const JSON_HTTP_CODE="httpStatus";
export const JSON_TIMED_OUT=0;
export const JSON_ERROR="error";
export const JSON_HTTP_301="301";
export const JSON_HTTP_302="302";
export const JSON_404="404";

// HTTP Code Errors that are being tracked
export const HTTP_0=0; // ftp download timeout
export const HTTP_301=301;
export const HTTP_302=302;










