import React from 'react';
import { withStyles, makeStyles, useTheme } from '@material-ui/core/styles';

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
import {StyledTableCell, packageStyles } from "./PTSPackages";

import startCase from 'lodash/startCase';

// const useStyles = makeStyles((theme) => ({
//     cell_mirror_title: {
//         fontSize: "10px",
//         width: 150,
//         backgroundColor: '#AE44AD',  //purple
//         padding: "0px",
//         //flexBasis: 'fit-content'
//       },
//       cell_mirror: {
//         fontSize: "10px",
//         //width: 1000,
//         backgroundColor: '#3498DB', //blue
//         padding: "0px",
//         flexBasis: 'fit-content'
//       },
// }));

// }));
/**
 * Displays the data that falls under the mirror array. 
 * This data relates to how each mirror defined by 'url' peformed during the test.
 * @param props array The Mirror data
 * 
 * Mirror -> [{status, duplicate, url, failures {}, download-time}]
 */
const PTSMirrors = (props) => {
    //const {status, url, failures} = props.data;
    const [openMirror, setOpenMirror] = React.useState(false);
   //const classes = props.classes;
   const classes= useStyles();
   const theme = useTheme();
   console.log("Theme=", theme);
    const identifier = props.identifier;
   console.log("classes ......", classes);
    // open the url. Since most of the urls are downloadable in the JSON, downloads URL.
    const handleClick = (e) => {
        window.open(e.target.innerHTML, "_blank");
        e.preventDefault();
    }

    // Determines the type of data in the cell and returns text, or link
    const getFormattedCell = (value) => {
        if (value.toString().includes("http")) {
            var n = value.indexOf("http");
            var text = value.slice(0, n);
            var httpText = value.slice(n, value.length)
            return (<Typography>{text}
                        <Link
                            color="primary"
                            href="{n}"
                            rel="noopener"
                            onClick={(e) => handleClick(e)}>
                            {httpText}
                        </Link>
                    </Typography>);
        }

       return (<Typography className={classes.secondaryHeading}>{value}</Typography>);
    }
    
    // Mirror collapse component. Will display all the mirror data in collapsible format.
    const CollapseComponent = (props) => {
        console.log("theme", props.theme, props);
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
                        {getFormattedCell(value)}
                    </StyledTableCell>  
                </TableRow> );  
        });
        
        // Pushing failures to the end of the list for asthetic reasons
        if (containsFailures !==null) 
            result.push(containsFailures);

        return result;

    }

    const hasFailedStatus = (props) => {
        console.log("status=", props.data.status !==Constants.JSON_PASSED);
        return (props.data.status !== Constants.JSON_PASSED)
    }

    return (
        <React.Fragment>
            <TableRow>
                <StyledTableCell  />
                    <StyledTableCell >
                        <IconButton
                            key={identifier}
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpenMirror(!openMirror)}>
                            <Typography 
                                className={classes.heading} 
                                style={{marginLeft: "0px", color:(props.data.status !==Constants.JSON_PASSED) ? theme.palette.secondary.main: theme.palette.text.primary}}
                            >Mirror
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