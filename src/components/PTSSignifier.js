import React from 'react';

import { Icon } from '@iconify/react';
import TriangleIcon from '@iconify-icons/mdi/triangle';
import CircleIcon from '@iconify-icons/mdi/circle'
import SquareIcon from '@iconify-icons/mdi/square'
import StarIcon from '@iconify-icons/mdi/star';
import RhombusIcon from '@iconify-icons/mdi/rhombus';

import {theme} from './theme';
import * as Constants from "../Constants";

/** Determine the color of the signifier based on the nature of the error.
 * @param {Integer} color   The status color based on the severity of the error ie a 404 is error while a 302 is info
 * @returns {String}        A theme based color for the status color
 */
export function getStatusColor(color){
    let col;

    switch(color) {
        case Constants.COLOR_PASS :
        case Constants.COLOR_NOT_TESTED:
            col = theme.palette.primary.main;
            break;
        case Constants.COLOR_FAIL:
            col = theme.palette.secondary.main;
            break;
        case Constants.COLOR_404:
            col = theme.palette.error.main;
            break;
        case Constants.COLOR_HTTP:
        case Constants.COLOR_TIMEOUT:
            col = theme.palette.warning.main;
            break;
        case Constants.COLOR_HTTP_0:    
            col = theme.palette.error.main;
            break;
        case Constants.COLOR_MD5:
            col = theme.palette.error.light;
            break;
        case Constants.COLOR_CHECKSUM:
        case Constants.COLOR_REDIRECT:
        case Constants.COLOR_DOWNLOAD:
        case Constants.COLOR_NO_CATEGORY:
            col = theme.palette.primary.main;
            break;
        case Constants.COLOR_SHA:
            col = theme.palette.error.dark;
            break;
        case Constants.COLOR_301:
        case Constants.COLOR_WARNING:
            col = theme.palette.warning.main;
            break;
        case Constants.COLOR_302:
            col = theme.palette.pass.main;
            break;
        
        default:
            col = theme.palette.error.main;
    }

    return col;
}

/**
 * Determines the icon to display based on the nature of the error.
 * Error can be either: Checksum, Download, Redirect, Not Tested or Undefined ie a HTTP 226 error
 * @param {Integer} stat    The error as defined by Constants.COLOR_*
* @param {Integer}  col     The color of the icon based on the severity of the error type. See getStatusColour()
 * @param {Integer} key     Key required bt react map fn
 * @returns Icon Component representing error
 */
export function getIconShape(stat,col,key){
    let shape;

    switch(stat) {
        case Constants.COLOR_PASS :
        case Constants.COLOR_FAIL:
            shape = null;
            break;
        case Constants.COLOR_DOWNLOAD:
        case Constants.COLOR_404:
        case Constants.COLOR_HTTP: 
        case Constants.COLOR_TIMEOUT:
        case Constants.COLOR_HTTP_0:  
            shape = <Icon icon={CircleIcon} color={col} style={{marginLeft:"0.5em"}} key={key}/>          
            break;
        case Constants.COLOR_CHECKSUM:
        case Constants.COLOR_MD5:
        case Constants.COLOR_SHA:
            shape = <Icon icon={SquareIcon} color={col} style={{marginLeft:"0.5em"}} key={key}/>          
            break;
        case Constants.COLOR_REDIRECT:
        case Constants.COLOR_301:
        case Constants.COLOR_302:
            shape = <Icon icon={TriangleIcon} color={col} style={{marginLeft:"0.5em"}} key={key}/>
            break;
        case Constants.COLOR_NOT_TESTED:
            shape = <Icon icon={StarIcon} color={col} style={{marginLeft:"0.5em"}} key={key}/>
            break;
        case Constants.COLOR_NO_CATEGORY:
        default:
            shape = <Icon icon={RhombusIcon} color={col} style={{marginLeft:"0.5em"}} key={key}/>
    }

    return shape;
}

/** Color of the checkboxes and radio button
 *  These match the color category that will be used against each profile.
 * ie redirects are green so 301 and 302 will be based on green colors
 */
export function getCheckboxColor(index){
    let col;

    switch(index) {
        case Constants.ALL_IDX:
        case Constants.LATEST_IDX:
        case Constants.NOT_TESTED_IDX:
            col = theme.palette.primary.main;
            break;
        case Constants.NONE_IDX:
            col = theme.palette.primary.main;
            break;    
        case Constants.CHECKSUM_IDX:
            col = theme.palette.primary.main;
            break;
        case Constants.REDIRECTS_IDX:
            col = theme.palette.primary.main;
            break;
        case Constants.DOWNLOAD_IDX:
            col = theme.palette.primary.main;
            break;
        default:
            col = null;
    }
    return col;
}

/**
 * Iterates though each status and returns the appropriate Signifier
 * @param {Array} status Error Status ie Constants.COLOR_301
 * @returns Icon component with shape and color reflecting error status
 */
const getTestSignifiers = (status) => {
    let signifier = null;
    
    if (!status) {
        signifier = null;     
    } else {
        signifier = status.map((stat, key) => {
            // If the test passed or failed this is already indicated by the color of the text
            if (stat === Constants.COLOR_PASS || stat === Constants.COLOR_FAIL)
                return null;

            let col = getStatusColor(stat);
            return getIconShape(stat, col, key);
        })
    }
    
    return signifier;   
}

/**
 * 
 * @param {Object} props colorStatus an array or single index representing
 * @returns 
 */
export default function PTSSignifier(props) {
    const {colorStatus : status} = props;
    
    return (<>{getTestSignifiers(status)}</>);
}