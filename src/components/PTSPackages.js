import React from 'react';

import * as Constants from "../Constants";
import useStyles from "./styles";

import { withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Collapse from "@material-ui/core/Collapse";


import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';

import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import IconButton from "@material-ui/core/IconButton";
//import Box from "@material-ui/core/Box";


import PTSMirrors from './PTSMirrors';

  // Lot of TableCells so styled instead of using className
  const StyledTableCell = withStyles((theme) => ({
    head: {
      //backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
      padding: "0px",
      backgroundColor: "#CCD1D1", //light grey

    },
    body: {
      fontSize: 14,
      padding:"0px",
      marginLeft:"20px",
      backgroundColor: "#dcdcdc",   //grey
    },
  }))(TableCell);

/**
 * Diplays the package details of the JSON results
 *  @param props array The Mirror data
 * 
 * Package -> [{identifier, pts-filename, pts-filesize, pts-sha256, pts-md5, mirror[]}]
 */
const PTSPackages = props => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const {identifier, "pts-filename" : filename, "pts-filesize" : filesize, "pts-sha256" : sha256, "pts-md5" : md5, mirror} = props.data;
    const hasFailedStatus = (props) => {
        return props.data.mirror.some((mirror) => mirror.status === Constants.JSON_FAILED)
    }

    const getMirrors = (props) => {
        let status = "unknown";
        if (props.status) {
            status = (<span>{props.status}</span>);     
        } else {
            status = props.map((mir, key) => {
                return <PTSMirrors  key={key} identifier={identifier} data={mir}/>
            })
        }
        
        return status;   
    }

    return (
            <TableContainer >
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell >
                                <IconButton
                                    aria-label="expand row"
                                    size="small"
                                    style={{borderRadius:16}}
                                    onClick={() => setOpen(!open)}
                                >
                                    {/* {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />} */}
                                    <Typography color={hasFailedStatus(props)?'secondary':'primary'} style={{fontWeight:600}} >{identifier}</Typography>
                                </IconButton>
                            </StyledTableCell>
                        </TableRow> 
                     
                        
                        <TableRow>
                            <StyledTableCell>
                            <Collapse in={open} timeout="auto" unmountOnExit >
                                {/* <Box margin={1}> */}
                                <Table size="small">
                                <TableBody>
                                <TableRow>
                                    <StyledTableCell className={classes.cell_title} >
                                        <Typography className={classes.heading}>File Name</Typography>
                                    </StyledTableCell>
                                    <StyledTableCell  className={classes.cell_long} >
                                        <Typography className={classes.secondaryHeading}>{filename}</Typography>
                                    </StyledTableCell>  
                                </TableRow>
                                <TableRow>
                                    <StyledTableCell  >
                                        <Typography className={classes.heading}>File Size</Typography>
                                    </StyledTableCell>
                                    <StyledTableCell >
                                        <Typography className={classes.secondaryHeading}>{filesize}</Typography>
                                    </StyledTableCell>                              
                                </TableRow>
                                <TableRow>
                                    <StyledTableCell  >
                                        <Typography className={classes.heading}>SHA256</Typography>
                                    </StyledTableCell>
                                    <StyledTableCell >
                                        <Typography className={classes.secondaryHeading}>{sha256}</Typography>
                                    </StyledTableCell>                              
                                </TableRow>
                                <TableRow>
                                    <StyledTableCell  >
                                        <Typography className={classes.heading}>MD5</Typography>
                                    </StyledTableCell>
                                    <StyledTableCell >
                                        <Typography className={classes.secondaryHeading}>{md5}</Typography>
                                    </StyledTableCell>                              
                                </TableRow>

                                {getMirrors(mirror)}
                                </TableBody>
                                </Table>
                                {/* </Box> */}
                            </Collapse> 
                            </StyledTableCell> 
                        </TableRow>

                    </TableHead>
                </Table> 
             </TableContainer>
    )
}

 //const STableCell= withStyles(StyledTableCell)(TableCell);
 const packageStyles = withStyles(useStyles)(PTSPackages);

 export { StyledTableCell, packageStyles };

export default PTSPackages;
