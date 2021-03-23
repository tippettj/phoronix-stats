import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Collapse from "@material-ui/core/Collapse";
import TableRow from '@material-ui/core/TableRow';

import startCase from 'lodash/startCase';

import Failures from './PTSFailures';
import * as Constants from "../Constants";
import StyledTableCell from './StyledTableCell';
import useStyles from "./styles";
import PTSSignifier from './PTSSignifier';

/**
 * Displays the data that falls under the mirror array. 
 * This data relates to how each mirror defined by 'url' peformed during the test.
 * @param props array The Mirror data
 * 
 * Mirror -> [{status, duplicate, url, failures {}, download-time}]
 */
const PTSMirrors = (props) => {
    const [openMirror, setOpenMirror] = React.useState(false);
    const classes= useStyles();
    const theme = useTheme();

    // open the url. Since most of the urls are downloadable in the JSON, downloads URL.
    const handleClick = (e) => {
        window.open(e.target.innerHTML, "_blank");
        e.preventDefault();
    }

    // Determines the type of data in the cell and returns text, or link
    const getFormattedCell = (key, value) => {
        var text = (<Typography className={classes.secondaryHeading}>{value}</Typography>);

        if (key.toLowerCase() === "duplicate") {
            var str = value.slice(value.lastIndexOf(" "), value.length);
            text = (<Typography className={classes.secondaryHeading}>{str}</Typography>);
        } 

        if (key.toLowerCase() === "url" || key.toLowerCase() === "redirectto") {
            text = (<Typography>
                        <Link
                            color="primary"
                            href="{n}"
                            rel="noopener"
                            onClick={(e) => handleClick(e)}>
                            {value}
                        </Link>
                    </Typography>);
        }

       return text;
    }
    
    // Mirror collapse component. Will display all the mirror data in collapsible format.
    const CollapseMirrorComponent = (props) => {
        var containsFailures = null; 

        const result = Object.entries(props.data).map(([key, value], idx) => {
            if (key.toLowerCase() === "colorstatus")
                return null;

            if (key.toLowerCase() === Constants.JSON_FAILURES.toLowerCase()) {
                containsFailures = <Failures key={idx} classes={classes} failed={props.data.failures} />
                return null;
             } else 
                return (
                   <TableRow key={idx} >
                        <StyledTableCell className={classes.mirrorRow}/>   
                        <StyledTableCell className={classes.mirrorRow}>
                            <Typography className={classes.mirrorDataHeading}>{startCase(key)}</Typography>
                        </StyledTableCell>
                        <StyledTableCell  colSpan={2} className={classes.mirrorRow} >
                            {getFormattedCell(key,value)}
                        </StyledTableCell>  
                    </TableRow>

             );  
        });
        
        // Pushing failures to the end of the list for aesthetics
        if (containsFailures !==null) 
            result.push(containsFailures);
        
        return result;
    }

    return (
        <React.Fragment>
            <TableRow className={classes.packageNameRow}>
                <StyledTableCell>
                    <Typography 
                        onClick={() => setOpenMirror(!openMirror)} 
                        className={classes.mirrorHeading}  
                        style={{ color:(props.data.status !==Constants.JSON_PASSED) ? theme.palette.secondary.main: theme.palette.primary.main}}
                        >Mirror {props.idx + 1}
                        <PTSSignifier colorStatus={props.data.colorStatus}/>
                    </Typography>
                </StyledTableCell>
                <StyledTableCell colSpan={3} style={{verticalAlign: "text-top"}}>
                        <Typography 
                            onClick={() => setOpenMirror(!openMirror)} 
                            className={classes.mirrorSecondaryHeading} 
                            style={{ color:(props.data.status !==Constants.JSON_PASSED) ? theme.palette.secondary.main: theme.palette.primary.main}}
                        >{props.data.url}
                        </Typography>      
                </StyledTableCell>               
            </TableRow>

            <Collapse
                in={openMirror}
                timeout='auto'
                component={() => CollapseMirrorComponent(props)}
                unmountOnExit>
            </Collapse>  
        </React.Fragment>
    )
}

export default PTSMirrors;