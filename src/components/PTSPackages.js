import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Collapse from "@material-ui/core/Collapse";

import useStyles from "./styles";
import { withStyles } from '@material-ui/core/styles';

import * as Constants from "../Constants";
import PTSMirrors from './PTSMirrors';
import StyledTableCell from './StyledTableCell';

/**
 * Diplays the package details of the JSON results
 *  @param props array The Mirror data
 * 
 * Package -> [{identifier, pts-filename, pts-filesize, pts-sha256, pts-md5, mirror[]}]
 */
const PTSPackages = props => {
    const packages = props.data;
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);  // state of collapse component for displaying mirrors

    const {identifier, "pts-filename" : filename, "pts-filesize" : filesize, "pts-sha256" : sha256, "pts-md5" : md5, mirror} = props.data;
    const hasFailedStatus = (props) => {
        return props.mirror.some((mirror) => mirror.status === Constants.JSON_FAILED)
    }

    // Displays the Mirror portion for each package within the Profile
    // Flow: Profile --1:n--> Packages --1:m--> Mirrors 
    const getMirrors = (props) => {
        let status = "unknown";

        if (props.status) {
            status = (<span>{props.status}</span>);     
        } else {
            status = props.map((mir, key) => {
                //console.log("+++mir", mir);
                return <PTSMirrors  key={key} identifier={identifier} data={mir} idx={key}/>
            })
        }
        
        return status;   
    }

    const CollapsePackageComponent = (props) => {
        return (
           <React.Fragment >
                <TableRow className={classes.packageNameRow}>
                    <StyledTableCell  >
                        <Typography className={classes.heading}>File Name</Typography>
                    </StyledTableCell>
                    <StyledTableCell  colSpan={3} >
                        <Typography className={classes.secondaryHeading}>{filename}</Typography>
                    </StyledTableCell>  
                </TableRow>
                <TableRow className={classes.packageNameRow}>
                    <StyledTableCell  >
                        <Typography className={classes.heading}>File Size</Typography>
                    </StyledTableCell>
                    <StyledTableCell  colSpan={3} >
                        <Typography className={classes.secondaryHeading}>{filesize}</Typography>
                    </StyledTableCell>                              
                </TableRow>
                <TableRow className={classes.packageNameRow}>
                    <StyledTableCell  >
                        <Typography className={classes.heading}>SHA256</Typography>
                    </StyledTableCell>
                    <StyledTableCell  colSpan={3} >
                        <Typography className={classes.secondaryHeading}>{sha256}</Typography>
                    </StyledTableCell>                              
                </TableRow>
                <TableRow className={classes.packageNameRow}>
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

    return ( 
       <>
            <TableRow>
                <StyledTableCell colSpan={4} className={classes.packageNameRow}>
                    <Typography 
                        onClick={() => setOpen(!open)} 
                        color={hasFailedStatus(packages)?'secondary':'primary'} 
                        className={classes.packageName}>
                    {filename } 
                    {/* <PTSSignifier filename={filename} colorStatus={colorStatus}/> */}
                    </Typography>
                </StyledTableCell>
            </TableRow> 
 
            <Collapse 
                in={open} 
                timeout="auto" 
                component={() => CollapsePackageComponent(props)}
                unmountOnExit >
            </Collapse> 
        </>
       
    )
}

 const packageStyles = withStyles(useStyles)(PTSPackages);
 export { packageStyles };

export default PTSPackages;
