import React from 'react';

import * as Constants from "../Constants";
import useStyles from "./styles";

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Collapse from "@material-ui/core/Collapse";


import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import IconButton from "@material-ui/core/IconButton";

//import blueGrey from '@material-ui/core/colors/blueGrey';


import PTSMirrors from './PTSMirrors';
    //const lightGrey = blueGrey[50];

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
      //backgroundColor: lightGrey,
      backgroundColor: "#dbdede",   //grey
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "red",
    }
  }))(TableCell);

/**
 * Diplays the package details of the JSON results
 *  @param props array The Mirror data
 * 
 * Package -> [{identifier, pts-filename, pts-filesize, pts-sha256, pts-md5, mirror[]}]
 */
const PTSPackages = props => {
    const packages = props.data;

    const classes = useStyles();
    //const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const {identifier, "pts-filename" : filename, "pts-filesize" : filesize, "pts-sha256" : sha256, "pts-md5" : md5, mirror} = props.data;

    const hasFailedStatus = (props) => {
        return props.mirror.some((mirror) => mirror.status === Constants.JSON_FAILED)
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

    const CollapsePackage1Component = (props) => {
        return (
            <Table size="small">
                <TableBody>
                    <TableRow>
                        <StyledTableCell className={classes.cell_title} >
                            <Typography className={classes.heading}>File Name</Typography>
                        </StyledTableCell>
                        <StyledTableCell  colSpan={3} className={classes.cell_long} >
                            <Typography className={classes.secondaryHeading}>{filename}</Typography>
                        </StyledTableCell>  
                    </TableRow>
                    <TableRow>
                        <StyledTableCell  >
                            <Typography className={classes.heading}>File Size</Typography>
                        </StyledTableCell>
                        <StyledTableCell  colSpan={3} >
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

                    {/* {getMirrors(mirror)} */}
                </TableBody>
                </Table>
        )
    }
    const CollapsePackageComponent = (props) => {
        return (
           <React.Fragment>
                    <TableRow>
                        <StyledTableCell  >
                            <Typography className={classes.heading}>File Name</Typography>
                        </StyledTableCell>
                        <StyledTableCell  colSpan={3} >
                            <Typography className={classes.secondaryHeading}>{filename}</Typography>
                        </StyledTableCell>  
                    </TableRow>
                    <TableRow>
                        <StyledTableCell  >
                            <Typography className={classes.heading}>File Size</Typography>
                        </StyledTableCell>
                        <StyledTableCell  colSpan={3} >
                            <Typography className={classes.secondaryHeading}>{filesize}</Typography>
                        </StyledTableCell>                              
                    </TableRow>
                    <TableRow>
                        <StyledTableCell  >
                            <Typography className={classes.heading}>SHA256</Typography>
                        </StyledTableCell>
                        <StyledTableCell  colSpan={3} >
                            <Typography className={classes.secondaryHeading}>{sha256}</Typography>
                        </StyledTableCell>                              
                    </TableRow>
                    <TableRow>
                        <StyledTableCell  >
                            <Typography className={classes.heading}>MD5</Typography>
                        </StyledTableCell>
                        <StyledTableCell  colSpan={3} >
                            <Typography className={classes.secondaryHeading}>{md5}</Typography>
                        </StyledTableCell>                              
                    </TableRow>

                    {getMirrors(mirror)}
            </React.Fragment>    
        )
    }

    const getFilenameComponent = (filename) => {
        return (
            <StyledTableCell style={{background:"#d6dada"}}>
                <Typography onClick={() => setOpen(!open)} color={hasFailedStatus(packages)?'secondary':'primary'} style={{fontWeight:400, marginLeft:"20px"}} >{filename}</Typography>
            </StyledTableCell>
        )}

    return ( 
       <>
       {/* <TableBody className={classes.borders}> */}
            <TableRow>
                <StyledTableCell colSpan={4} style={{background:"#d6dada"}}>
                    <Typography onClick={() => setOpen(!open)} color={hasFailedStatus(packages)?'secondary':'primary'} style={{fontWeight:400, marginLeft:"20px"}} >{filename}</Typography>
                </StyledTableCell>
            </TableRow> 
                
                
            {/* <TableRow>
                <StyledTableCell colSpan={4}> */}
                    <Collapse 
                        in={open} 
                        timeout="auto" 
                        component={() => CollapsePackageComponent(props)}
                        unmountOnExit >
                    </Collapse> 
                {/* </StyledTableCell> 
            </TableRow> */}
        {/* </TableBody> */}
        </>
        //     {/* <StyledTableCell> */}
        //         <Collapse 
        //         in={open} 
        //         timeout="auto" 
        //         component={() => getFilenameComponent(filename)}
        //         unmountOnExit >    
        //         </Collapse> 
        //     {/* </StyledTableCell>  */}
        // </TableRow> 

        // <React.Fragment>
        //         <TableRow>
        //             <StyledTableCell style={{background:"#d6dada"}}>
        //                 <Typography onClick={() => setOpen(!open)} color={hasFailedStatus(packages)?'secondary':'primary'} style={{fontWeight:400, marginLeft:"20px"}} >{filename}</Typography>
        //             </StyledTableCell>
        //         </TableRow> 
                
                
        //         <TableRow>
        //             <StyledTableCell colspan={2}>
        //                 <Collapse 
        //                     in={open} 
        //                     timeout="auto" 
        //                     component={() => CollapsePackageComponent(props)}
        //                     unmountOnExit >
        //                 </Collapse> 
        //             </StyledTableCell> 
        //         </TableRow>
        //     </React.Fragment>
    )
}

 const packageStyles = withStyles(useStyles)(PTSPackages);
 export { StyledTableCell, packageStyles };

export default PTSPackages;
