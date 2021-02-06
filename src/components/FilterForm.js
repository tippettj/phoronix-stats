import React, {useState} from 'react';
import Checkboxes, {useCheckboxes} from './Checkboxes';
import DisplayResults from './DisplayResults';
import * as Constants from '../Constants';
import {theme} from './theme';

import Button from '@material-ui/core/Button';
import ClearIcon from '@material-ui/icons/Clear';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container'; //Defines the size of page
import Toolbar from '@material-ui/core/Toolbar'; 
import AppBar from '@material-ui/core/AppBar'; 
import Divider from '@material-ui/core/Divider';


import {makeStyles, ThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import 'fontsource-roboto';

import Typography from '@material-ui/core/Typography';

import "./styles.css";

// when you want to set up a style for a component
//const useStyles = makeStyles((theme) => ({

 const useStyles = makeStyles ((theme) => ({
    button: {
        background: 'linear-gradient(45deg, #285F80 29%, #333333 81% )',
        border: 0,
        borderRadius: 15,
        color: '#FFFFFF', // white
        padding: '5px 30px',
        marginRight: '20px',
    },
    title: {
        marginBottom: '10px',
    },
    toolbar: {
        marginBottom: '1em',
    },
    

}))

// when you want to override a MUI default
// const theme = createMuiTheme({
//     typography: {
//         h2: {
//             fontSize:36,
//             marginBottom:15,
//         },
//     },
//     palette: {
//         primary: {
//             main: '#285F80', 
//         },
//         secondary: {
//             main: '#d32f2f', 
//         },

//     },
//     overrides: {
//         MuiContainer: {
//             root : {
//               marginLeft: "10px",
//             }
//         }
//     }
// })


export function FilterForm(props) {
    const [display, setDisplay] = useState(false);  // display the results of the search on the page
    const checkboxes = useCheckboxes();             // filter to determine which results to display
    const classes = useStyles();

    // display the results on the page
    const handleSubmit = (event) => {
        event.preventDefault();
        setDisplay(true);
    }

    // clear form of all data and reset checkboxes
    const clearForm = (event) => {
        checkboxes.checkboxes.map((box, idx) => checkboxes.setCheckbox(idx, false));
        setDisplay(false);
        event.preventDefault();
    }

    /**
     * When the user selects the Failed Checkbox, function returns records that file the failed criteria
     * @param {*} fData The mirror array containing the failed data
     * @param {*} searchFilters The filters to apply for one or more specific failures ie md5
     * @returns boolean true if a match fitting the search criteria has been found
     */
    function getSpecificFailures(fData, searchFilters) {
        let data = fData.failures;  // JSON failure details
        let failedData = null;      

        // if only the Failed Checkbox has been selected then return all records that failed, otherwise return
        // only those failed records that match the selected checkboxes. ie md5 or sha256
        if (searchFilters.length === 1 && searchFilters.includes(Constants.FAILED) ) 
            failedData = (fData.status === Constants.JSON_FAILED);
        else if (searchFilters.includes(Constants.MD5) && searchFilters.includes(Constants.SHA256))
            failedData = (data.md5 !== undefined || data.sha256 !== undefined)
        else if (searchFilters.includes(Constants.MD5) && !searchFilters.includes(Constants.SHA256))
            failedData = (data.md5 !== undefined )
        else if (searchFilters.includes(Constants.SHA256) && !searchFilters.includes(Constants.MD5)) 
            failedData= (data.sha256 !== undefined)

        return failedData;
    }

    /**
     * Get all data that failed the test
     * @param {*} data the complete set of data
     * @param {*} searchFilters the filters to apply to extract data that failed. ie all failures, all md5 failures... 
     */
    function getFailedData(data, searchFilters = null) {
        let testProfile = null;

        if (data && data.length>0 ) {
          testProfile = data.filter((profile) => {
              return profile.packages.some((packs) => {
                return packs.mirror.some(mirror => {
                   if (mirror.status === Constants.JSON_FAILED) {
                       if (!searchFilters) 
                            return true;
                        else 
                           return getSpecificFailures( mirror, searchFilters);
                    } else { 
                        return false;
                    }
                }  
            )})
        })
        return testProfile;
      } 
    }

   
    /**
     * Get the data to display
     * @param {*} data all the json results
     * 
     */
    const getData = (data) => {
        let results = data;
        const filters = checkboxes.checkboxes.filter((checks) => checks.checked === true).map((checkbox) => checkbox.name);
        console.log("Filters->", filters);
        if (filters.includes("All")) 
            results = data;

        if (filters.includes(Constants.FAILED) || filters.includes(Constants.MD5) || filters.includes(Constants.SHA256)) 
            results = getFailedData(data, filters);
      
        console.log("Results -->", results);
        return results;
    }

    return(
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg">
                <React.Fragment>
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <div className="App">
                            <AppBar>
                                <Toolbar className={classes.toolbar}>
                                    <Typography
                                        variant="h2"
                                    >Check Tests Results
                                    </Typography>
                                </Toolbar>
                            </AppBar>
                        </div>
                        <Checkboxes {...checkboxes}/>
                        <Button 
                            className={classes.button}
                            variant="contained" 
                            color="primary" 
                            size="small"
                            style={{
                                fontSize:12
                            }}
                            onClick={handleSubmit}>
                            Search
                        </Button>
                        <Button 
                            className={classes.button}
                            startIcon={<ClearIcon />}
                            variant="contained" 
                            color="primary" 
                            size="small"
                            style={{
                                fontSize:12
                            }}
                            onClick={(e) => clearForm(e)}>
                            Clear
                        </Button>
                        <TextField 
                            variant="outlined"
                            color="primary"
                            label="Test Profile"
                        />
                        <Divider />
                        {(display) ? <DisplayResults results={getData(props.data)}/> : null }
                    </form>
                </React.Fragment>
            </Container>
        </ThemeProvider>

    )
}
