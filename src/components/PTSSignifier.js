import React from 'react';

import WarningIcon from '@material-ui/icons/Warning';
import {theme} from './theme';
import * as Constants from "../Constants";

import useStyles from "./styles";

/** Determine the color of the signifier based on the nature of the error as defined in Constants
 */
export function getStatusColor(color){
    let col = "red";

    switch(color) {
        case Constants.COLOR_PASS :
        case Constants.COLOR_NOT_TESTED:
            col = theme.palette.primary.main;
            break;
        case Constants.COLOR_FAIL:
        case Constants.COLOR_HTTP_404:
        case Constants.COLOR_HTTP:
            col = theme.palette.error.main;
            break;
        case Constants.COLOR_MD5:
        case Constants.COLOR_SHA:
            col = 'green';
            break;
        case Constants.COLOR_301:
        case Constants.COLOR_302:
            col = 'purple';
            break;
        case Constants.COLOR_TIMEOUT:
        case Constants.COLOR_HTTP_0:    
            col = 'green';
            break;
        default:
            col = theme.palette.primary.main;
    }

    return col;
}

const getSignifiers = (status) => {
    let signs = null;
    
    if (!status) {
        signs = null;     
    } else {
        signs = status.map((sign, key) => {
            // If the test passed or failed this is already denoted by the color of the text
            if (sign === Constants.COLOR_PASS || sign === Constants.COLOR_FAIL)
                return null;

            let col = getStatusColor(sign);
            return <WarningIcon style={{fill:col, marginLeft:"0.2em"}} fontSize="small" key={key}/>
        })
    }
    
    return signs;   
}
export default function PTSSignifier(props) {
    const {filename : name, colorStatus : status} = props;
    const classes = useStyles(); 
             
  return (
    <>
        {getSignifiers(status)}   
    </>
  );
}