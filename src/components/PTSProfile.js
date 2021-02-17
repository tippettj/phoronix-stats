import React from 'react';
import PTSPackages from './PTSPackages';

import * as Constants from "../Constants";
import useStyles from "./styles";

import Typography from '@material-ui/core/Typography';
import Collapse from "@material-ui/core/Collapse";


import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';

import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import {StyledTableCell} from "./PTSPackages";


const PTSProfile = props => {
    const profile=props.data;
    const [open, setOpen] = React.useState(false);             // hold state for the collapse component holding the profile name
    const classes = useStyles();

    // Determines if the test has failed. 
    // A failure of JSON_NOT_TESTED means that no PTS Data is available to display so set the notTested flag.
    const hasFailedStatus = (packages) => {
        return packages.some(pack => 
            pack.mirror.some(mirror => mirror.status === Constants.JSON_FAILED)   
    )};

    // In the case of no download.xml file, the test status will be NOT_TESTED.
    // This does not consitute a failure and there is not point in getting child components.
    const notTested = (packages) => {
        return packages.some(pack => 
            pack.mirror.some(mirror => 
                 (mirror.status === Constants.JSON_NOT_TESTED)                            
            ) 
        
    )};

    // Get the data for each package
    const getPackages = (packages) => {
        let testProfile = null;
      
        if (packages && packages.length>0 ) {
          testProfile = packages.map((pack, pKey) =>  {
            if ( notTested(packages) )  // yes packages. 
                return (

                        <TableRow key={pKey}>
                            <StyledTableCell key={pKey} colSpan={4}>
                                <Typography key={pKey} className={classes.secondaryHeading} style={{marginLeft:"1.4em"}}>Not Tested. download.xml file did not exist.</Typography>
                            </StyledTableCell>
                        </TableRow>

                )
            else
                return (<PTSPackages key={pKey} data={pack}/> );
          })
      
          return testProfile;
        }
      }

    // const CollapseProfileComponent = (profile) => {
    //     return(        
    //                 getPackages(profile.packages)
    //     )
    // }

    // const CollapseProfile1Component = (profile) => {
    //     return(  
    //         <Table size="small">
    //             <TableBody>
    //                 <TableRow>
    //                     <StyledTableCell>
    //                         {getPackages(profile.packages)} 
    //                     </StyledTableCell>
    //                 </TableRow>
    //             </TableBody>
    //         </Table>
    //     )
    // }
    return (
        <>
                {/* <TableBody className={classes.borders}> */}
                    <TableRow className={classes.borders}>
                        <StyledTableCell colSpan={4}>
                            <Typography onClick={() => setOpen(!open)} color={hasFailedStatus(profile.packages)?'secondary':'primary'} style={{fontWeight:600}} >{profile['profile-name']}</Typography>
                        </StyledTableCell>
                    </TableRow> 
                {/* </TableBody > */}
                  
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