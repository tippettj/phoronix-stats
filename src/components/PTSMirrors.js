import React from 'react';
import { useTheme } from '@material-ui/core/styles';

import Failures from './PTSFailures';


import * as Constants from "../Constants";
import useStyles from "./styles";



import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

import Collapse from "@material-ui/core/Collapse";


import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';

import TableRow from '@material-ui/core/TableRow';
import IconButton from "@material-ui/core/IconButton";

import {StyledTableCell } from "./PTSPackages";

import startCase from 'lodash/startCase';

/**
 * Displays the data that falls under the mirror array. 
 * This data relates to how each mirror defined by 'url' peformed during the test.
 * @param props array The Mirror data
 * 
 * Mirror -> [{status, duplicate, url, failures {}, download-time}]
 */
const PTSMirrors = (props) => {
    console.log("PTSMirrors");
    //const {status, url, failures} = props.data;
    const [openMirror, setOpenMirror] = React.useState(false);
    //const classes = props.classes;
    const classes= useStyles();
    const theme = useTheme();
    const identifier = props.identifier;

    // open the url. Since most of the urls are downloadable in the JSON, downloads URL.
    const handleClick = (e) => {
        window.open(e.target.innerHTML, "_blank");
        e.preventDefault();
    }

    // Determines the type of data in the cell and returns text, or link
    const getFormattedCell = (key, value) => {
        var text = (<Typography className={classes.secondaryHeading}>{value}</Typography>);

        if (key.toLowerCase() === "duplicate") {
            var str = value.slice(0, value.indexOf(" "));
            text = (<Typography className={classes.secondaryHeading}>{str}</Typography>);
        } 

        if (key.toLowerCase() === "url") {
            var httpText = value.slice(value.indexOf("http"), value.length)
            text = (<Typography>
                        <Link
                            color="primary"
                            href="{n}"
                            rel="noopener"
                            onClick={(e) => handleClick(e)}>
                            {httpText}
                        </Link>
                    </Typography>);
        }

       return text;
    }
    
    // Mirror collapse component. Will display all the mirror data in collapsible format.
    const CollapseComponent = (props) => {
        var containsFailures = null;

        const result = Object.entries(props.data).map(([key, value], idx) => {
            if (key.toLowerCase() === Constants.JSON_FAILURES.toLowerCase()) {
                containsFailures = <Failures key={idx} classes={classes} failed={props.data.failures} />
                return null;
             } else 
                return (<TableRow key={idx}>
                    <StyledTableCell className={classes.cell_mirror_title} >
                        <Typography className={classes.heading}>{startCase(key)}</Typography>
                    </StyledTableCell>
                    <StyledTableCell  className={classes.cell_mirror} >
                        {getFormattedCell(key,value)}
                    </StyledTableCell>  
                </TableRow> );  
        });
        
        // Pushing failures to the end of the list for asthetic reasons
        if (containsFailures !==null) 
            result.push(containsFailures);

        return result;

    }

    return (
        <React.Fragment>
            <TableRow>
                <StyledTableCell  />
                    <StyledTableCell className={classes.cell_long} style={{verticalAlign: "text-top"}}>
                        <IconButton
                            key={identifier}
                            aria-label="expand row"
                            size="small"
                            style={{borderRadius:16}}
                            onClick={() => setOpenMirror(!openMirror)}>
                            <Typography 
                                className={classes.mirrorHeading} 
                                style={{marginLeft: "0px", color:(props.data.status !==Constants.JSON_PASSED) ? theme.palette.secondary.main: theme.palette.text.primary}}
                            >Mirror
                            </Typography>
                            <Typography 
                                style={{marginLeft: "20px"}}
                            >{props.data.url}
                            </Typography>
                        </IconButton>
                    </StyledTableCell>   
                           
            </TableRow>
        
            <TableRow>
                <StyledTableCell />
                <StyledTableCell>
                    <Table size="small">
                        <TableBody>
                            <Collapse
                                in={openMirror}
                                timeout='auto'
                                component={() => CollapseComponent(props)}
                                unmountOnExit>
                            </Collapse>
                        </TableBody>
                    </Table>
                </StyledTableCell>
            </TableRow>
        </React.Fragment>
    )

}

export default PTSMirrors;