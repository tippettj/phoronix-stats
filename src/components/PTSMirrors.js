import React from 'react';
import Failures from './PTSFailures';
import { JSON_FAILED } from '../Constants';


/**
 * Displays the data that falls under the mirror array. 
 * This data relates to how each mirror defined by 'url' peformed during the test.
 * @param props array The Mirror data
 * 
 * Mirror -> [{status, duplicate, url, failures {}, download-time}]
 */
const PTSMirrors = (props) => {
    const {status, url, failures} = props.data;

    return (
        <span>
            <li> Status {status}</li>
            <li> URL {url}</li>
            {(status === JSON_FAILED) ? <Failures failed={failures} /> : null}

        </span>
    )

}

export default PTSMirrors;