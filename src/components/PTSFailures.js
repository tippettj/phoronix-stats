import React from 'react';
import Typography from '@material-ui/core/Typography';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';

import TableRow from '@material-ui/core/TableRow';
import {StyledTableCell } from "./PTSPackages";

import startCase from 'lodash/startCase';

/**
 * Diplays the failure details of the JSON results. Not all results will have failures
 *  @param props array The Failure data
 * 
 * Package -> {md5, sha256, filesize}
 */
const PTSFailures = (props) => {
    const classes = props.classes;

    const getFailures = (props) => {

        return Object.entries(props.failed).map(([key,value], idx) => {
            const keyFormatted = key.replace(/^([A-Z]?[a-z]+)+/, startCase);

            return (
                <TableRow key={idx}>
                    <StyledTableCell />
                    <StyledTableCell  className={classes.cell_mirror_title}>
                        <Typography className={classes.heading}>{keyFormatted}</Typography>
                    </StyledTableCell>
                    <StyledTableCell  >
                        <Typography className={classes.heading}>{value}</Typography>
                    </StyledTableCell>
                </TableRow>
            )
        })
    }

    return (
        <React.Fragment>
        <TableRow>
            <StyledTableCell>
               <Typography className={classes.heading}>Failures</Typography>   
            </StyledTableCell>    
        </TableRow>
        
        <TableRow>
                <StyledTableCell />
                <StyledTableCell>
                    <Table size="small">
                        <TableBody>
                            {getFailures(props)}
                        </TableBody>
                    </Table>
                </StyledTableCell>
            </TableRow>
        </React.Fragment>

    )

}

export default PTSFailures;