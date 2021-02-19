import React from 'react';
import Typography from '@material-ui/core/Typography';
import Collapse from "@material-ui/core/Collapse";
import TableRow from '@material-ui/core/TableRow';

import PTSPackages from './PTSPackages';
import StyledTableCell from './StyledTableCell';
import {notTestedPackage, hasFailedStatus} from "../processData";

import useStyles from "./styles";


const PTSProfile = props => {
    const profile=props.data;
    const [open, setOpen] = React.useState(false);  // hold state for the profile name collapse component 
    const classes = useStyles();

    // Get the data for each package. A package that is marked as Not Tested has no further
    // data to display.
    const getPackages = (packages) => {      
        if (packages && packages.length>0 ) {
          return packages.map((pack, pKey) =>  {
            if ( notTestedPackage(packages) )  // yes packages. 
                return (
                    <TableRow key={pKey}>
                        <StyledTableCell key={pKey} colSpan={4}>
                            <Typography key={pKey} 
                                className={classes.secondaryHeading} 
                                style={{marginLeft:"1.4em"}}>
                                Not Tested. download.xml file did not exist.
                            </Typography>
                        </StyledTableCell>
                    </TableRow>
                )
            else
                return (<PTSPackages key={pKey} data={pack}/> );
          })      
        }
      }

    return (
        <>
            <TableRow className={classes.profileNameRow}>
                <StyledTableCell colSpan={4}>
                    <Typography 
                        onClick={() => setOpen(!open)} 
                        className={classes.profileName}
                        color={hasFailedStatus(profile.packages)?'secondary':'primary'} 
                        >
                        {profile['profile-name']}
                    </Typography>
                </StyledTableCell>
            </TableRow> 
                  
            <Collapse 
                in={open} 
                timeout="auto" 
                component={() => getPackages(profile.packages)}
                unmountOnExit >    
            </Collapse> 
        </>               
     )
}

export default PTSProfile;