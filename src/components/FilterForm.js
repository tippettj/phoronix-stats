import React, {useState} from 'react';
import {ThemeProvider} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ClearIcon from '@material-ui/icons/Clear';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container'; //Defines the size of page
import Toolbar from '@material-ui/core/Toolbar'; 
import AppBar from '@material-ui/core/AppBar'; 
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';


import 'fontsource-roboto';

import Checkboxes, {useCheckboxes} from './Checkboxes';
import DisplayResults from './DisplayResults';
import * as Constants from '../Constants';
import {theme} from './theme';
import "./styles.css";
import useStyles from "./styles";

function getSearchData(searchValue, data) {
    console.log("data=", data);
    console.log("search=", searchValue);

}

export function FilterForm(props) {
    const [display, setDisplay] = useState(false);  // display the results of the search on the page
    const [searchValue, setSearchValue] = useState(null);
    //const [currDataSet, setCurrDataSet] = useState(props.data);
    const checkboxes = useCheckboxes();             // filter to determine which results to display
    const classes = useStyles();

    console.log("Data", props.data);
    // display the results on the page
    const handleDisplay = (event) => {
        event.preventDefault();
        setDisplay(true);
        console.log("Display=", display);
    }

    // display the results on the page
    const handleSearch = (event, data) => {
        console.log(event.target.value);
        event.preventDefault();
        getSearchData(searchValue, data);
        console.log("Search Value=", searchValue);

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

    function getRedirectData(data) {
        if (data && data.length>0 ) {
          return data.filter((profile) => {
              return profile.packages.some((packs) => {
                return packs.mirror.some(mirror => {
                    if (mirror.failures && mirror.failures.vendor)   
                        return (mirror.status === Constants.JSON_FAILED && (mirror.failures.vendor.includes('301') || mirror.failures.vendor.includes('302')))
                    else
                        return false;     
                }  
            )})
        })
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
        
        if (filters.includes(Constants.ALL)) 
            results = data;

        if (filters.includes(Constants.FAILED) || filters.includes(Constants.MD5) || filters.includes(Constants.SHA256)) 
            results = getFailedData(data, filters);
    
        if (filters.includes(Constants.REDIRECT))
            results = getRedirectData(data);
      
        console.log("Results=", results);
        return results;
    }

    return(
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg">
                <React.Fragment>
                    <form onSubmit={(e) => handleDisplay(e)}>
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
                        <Grid container spacing={1} className={classes.container}>
                            <Grid item xs={6}>
                                <Checkboxes {...checkboxes}  />
                                <Button 
                                    className={classes.button}
                                    onClick={handleDisplay}>
                                    Display
                                </Button>
                                <Button 
                                    className={classes.button}
                                    startIcon={<ClearIcon />}
                                    onClick={(e) => clearForm(e)}>
                                    Clear
                                </Button>
                            </Grid>
                            <Grid item xs={6}  >
                                <Grid container spacing={1} style={{marginTop:"0.5em"}}>
                                    <Grid item xs={6}>
                                        <TextField
                                            id="outlined-helperText"
                                            label="Profile Name"
                                            defaultValue=""
                                            variant="outlined"
                                            size="small"
                                            color="primary"
                                            InputProps={{classes: {notchedOutline:classes.notchedOutline}}}
                                            onChange={(e) => setSearchValue(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Button 
                                            id="search"
                                            className={classes.button}
                                            style={{marginLeft: "-2em"}}
                                             onClick={(e)=>handleSearch(e)}
                                           > Search
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Divider style={{marginTop: "1em"}}/>
                        {(display) ? <DisplayResults results={getData(props.data)}/> : null }

                    </form>
                </React.Fragment>
            </Container>
        </ThemeProvider>

    )
}
