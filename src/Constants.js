// Checkbox names and filters
//import { REDIRECT } from './Constants';

export const ALL_IDX = 0;
export const LATEST_IDX = 1;
export const FAILED_IDX = 2;
export const MD5_IDX = 3;
export const SHA_IDX = 4;
export const REDIRECTS_IDX = 5;
export const NOT_TESTED_IDX = 6;
export const TIMED_OUT_IDX = 7;

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
    name: "Fails",
    idx: FAILED_IDX,
    checked: false,
    disabled: false,
    children: [MD5_IDX, SHA_IDX],
    competes: [REDIRECTS_IDX, NOT_TESTED_IDX, TIMED_OUT_IDX],
    hide: [REDIRECTS_IDX, NOT_TESTED_IDX, TIMED_OUT_IDX],
    desc: "Displays all test profiles that failed",
}

export const MD5 = {
    name: "MD5 Fails",
    idx: MD5_IDX,
    checked: false,
    disabled: true,
    desc: "Displays all test profiles with an invalid MD5 checksum",
}

export const SHA = {
    name: "SHA256 Fails",
    idx: SHA_IDX,
    checked: false,
    disabled: true,
    desc: "Displays all test profiles with an invalid SHA256 checksum",
}

export const REDIRECTS = {
    name: "Redirects",
    idx: REDIRECTS_IDX,
    checked: false,
    disabled: false,
    competes:[ALL_IDX],
    hide: [NOT_TESTED_IDX, TIMED_OUT_IDX],
    desc: "Displays all test profiles with a 301 or 302 HTTP status",
}

export const NOT_TESTED = {
    name: "Not Tested",
    idx: NOT_TESTED_IDX,
    checked: false,
    disabled: false,
    desc: "Displays all tests profiles which were not tested",
}

export const TIMED_OUT = {
    name: "Timed Out",
    idx: TIMED_OUT_IDX,
    checked: false,
    disabled: false,
    desc: "Displays all tests profiles that timed out during the download",
}

// JSON
export const JSON_FAILED = "Failed";    
export const JSON_FAILURES = "Failures"; 
export const JSON_PASSED = "Passed";
export const JSON_MD5 = "md5";
export const JSON_SHA256 = "sha256";
export const JSON_NOT_TESTED="Not Tested";
export const JSON_HTTP_CODE="HTTP Code";
export const JSON_TIMED_OUT=0;
export const JSON_ERROR="error";