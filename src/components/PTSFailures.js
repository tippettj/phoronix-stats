import React from 'react';
import Typography from '@material-ui/core/Typography';
import TableRow from '@material-ui/core/TableRow';

// lodash functions (part of material UI)
import startCase from 'lodash/startCase';
import toUpper from 'lodash/toUpper';
import StyledTableCell from './StyledTableCell';


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

                    { (idx === 0) && 
                        <>
                            <StyledTableCell 
                                 className={classes.failureRow}
                                rowSpan={Object.entries(props.failed).length}
                             />
                            <StyledTableCell 
                                className={classes.failureRow}
                                rowSpan={Object.entries(props.failed).length} 
                                style={{verticalAlign: "text-top"}}>
                                    <Typography className={classes.mirrorDataHeading}>Failures</Typography>   
                            </StyledTableCell> 
                        </>  
                    }

                    <StyledTableCell className={classes.failureRow} >
                        <Typography className={classes.failureHeading} style={{marginLeft : "0px"}}>{keyFormatted}</Typography>
                    </StyledTableCell>
                    <StyledTableCell className={classes.failureRow}>
                        <Typography className={classes.secondaryHeading}>{value}</Typography>
                    </StyledTableCell>
                </TableRow>
            )
        })
    }
    
    return (
        <React.Fragment>
            {getFailures(props)}             
        </React.Fragment> 
    )
}

export default PTSFailures;