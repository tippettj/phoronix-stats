import React from 'react';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';

// lodash functions (part of material UI)
import startCase from 'lodash/startCase';
import toUpper from 'lodash/toUpper';

import {StyledTableCell } from "./PTSPackages";

/**
 * Diplays the failure details of the JSON results. Not all results will have failures.
 *  @param props array The Failure data
 * 
 * Package -> {md5, sha256, filesize}
 */
// const PTSFailures = (props) => {
//     const classes = props.classes;

//     // Formats and displays the failures
//     const getFailures = (props) => {
//         return Object.entries(props.failed).map(([key,value], idx) => {

//             //converts fileSize to File Size; sha256 to SHA256 for display 
//             var keyFormatted = key.replace(/^([A-Z]?[a-z]+)+/, startCase);
//             if (keyFormatted.match(".*\\d.*")) 
//                 keyFormatted = toUpper(keyFormatted);

//             return (
//                 <TableRow key={idx}>
//                     <StyledTableCell />
//                     <StyledTableCell  className={classes.cell_title}>
//                         <Typography className={classes.heading} style={{marginLeft : "0px"}}>{keyFormatted}</Typography>
//                     </StyledTableCell>
//                     <StyledTableCell  >
//                         <Typography className={classes.secondaryHeading}>{value}</Typography>
//                     </StyledTableCell>
//                 </TableRow>
//             )
//         })
//     }

//     console.log("length",Object.entries(props.failed).length);
//     return (
//         <React.Fragment>
//             <TableRow>
//                 <StyledTableCell rowSpan={Object.entries(props.failed).length} style={{verticalAlign: "text-top"}}>
//                     <Typography className={classes.heading}>Failures</Typography>   
//                 </StyledTableCell> 

//                 <StyledTableCell>    
//                     <TableRow>
//                         <StyledTableCell />
//                         <StyledTableCell>
//                             {getFailures(props)}
//                         </StyledTableCell>
//                     </TableRow>               
//                 </StyledTableCell>   

//             </TableRow>
//         </React.Fragment> 
//     )
//}


const PTSFailures = (props) => {
        const classes = props.classes;
    
        // Formats and displays the failures
        const getFailures = (props) => {
            return Object.entries(props.failed).map(([key,value], idx) => {
    
                //converts fileSize to File Size; sha256 to SHA256 for display 
                var keyFormatted = key.replace(/^([A-Z]?[a-z]+)+/, startCase);
                if (keyFormatted.match(".*\\d.*")) 
                    keyFormatted = toUpper(keyFormatted);
    
                return (
                    <TableRow key={idx}>

                        { (idx == 0) && 
                        <>
                        <StyledTableCell rowSpan={Object.entries(props.failed).length} />
                        <StyledTableCell rowSpan={Object.entries(props.failed).length} style={{verticalAlign: "text-top"}}>
                             <Typography className={classes.heading}>Failures</Typography>   
                        </StyledTableCell> 
                        </>
                    
                        }

                        <StyledTableCell  className={classes.cell_title}>
                            <Typography className={classes.heading} style={{marginLeft : "0px"}}>{keyFormatted}</Typography>
                        </StyledTableCell>
                        <StyledTableCell  >
                            <Typography className={classes.secondaryHeading}>{value}</Typography>
                        </StyledTableCell>
                    </TableRow>
                )
            })
        }
    
        console.log("length",Object.entries(props.failed).length);
        return (
            <React.Fragment>
                
             {getFailures(props)}
                          
            </React.Fragment> 
        )
}

export default PTSFailures;