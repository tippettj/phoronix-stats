import React from 'react';

/**
 * Diplays the failure details of the JSON results. Not all results will have failures
 *  @param props array The Failure data
 * 
 * Package -> {md5, sha256, filesize}
 */
const PTSFailures = (props) => {
    const {md5, sha256, filesize} = props.failed;

    return (
        <div>
            Failures
            {(md5) ? <li>MD5 {md5}</li> : null}
            {(sha256) ? <li>SHA256 {sha256}</li> : null}
           {(filesize) ? <li>filesize {filesize}</li> : null}
        </div>
    )

}

export default PTSFailures;