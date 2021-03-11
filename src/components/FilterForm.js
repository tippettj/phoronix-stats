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
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';

import 'fontsource-roboto';

import Checkboxes, {useCheckboxes} from './Checkboxes';
import PTSHelp from './PTSHelp';
import PTSResults from './PTSResults';
import * as Constants from '../Constants';
import {theme} from './theme';
import "./styles.css";
import useStyles from "./styles";
import {getNotTestedData, getRedirectData, getSearchData, getFailedData, getTimedOutData, getLatestVersion} from '../processData';


export function FilterForm(props) {
    const [searchValue, setSearchValue] = useState(""); // value in the profileName text field
    const checkboxes = useCheckboxes();                 // filter to determine which results to display
    const classes = useStyles();                        

    // display the results on the page
    const handleDisplay = (event) => {
        event.preventDefault();
    }

    // clear form of all data and reset checkboxes
    const clearForm = (event) => {
        checkboxes.checkboxes.map((box, idx) => checkboxes.setCheckbox(idx, false));
        setSearchValue("");
        event.preventDefault();
    }

    /**
     * Get the data to display. 
     * The default is all data as per the  JSON file. This method filters and returns the subset of all data
     * based on the checkboxes selected.
     * The checkboxes work as an AND when the profile name has been populated.
     * @param {*} data all the json results
     * @return results all data that matches the filter AND profile name search criteria.
     * 
     */
    const getData = (allData) => {
        let data = [...allData];
        let results = data;

        // determine which checkboxes have been selected
        const filters = checkboxes.checkboxes.filter((checks) => checks.checked === true).map((checkbox) => checkbox.name);
        
        // If no checkboxes have been selected, display nothing
        if (filters && filters.length === 0 ) {
            results = null;
        }
        
        // If a search value has been defined, get the subset of data that matches the search criteria
        // and further reduce the data based on the filters selected.
        if ( searchValue !== "" ) {
            results = getSearchData(data, searchValue);
            
            if (filters && filters.length > 0) {
                data = results;
            }
        }

        console.log("Filters=", filters);
        // Top Level Searches
        if (filters.includes(Constants.ALL.name)) 
            results = data;

        if (filters.includes(Constants.LATEST.name))
            results = getLatestVersion(data);

        // Secondary Searches
        if (filters.includes(Constants.ALL.name) || filters.includes(Constants.LATEST.name) )
            data = results;

        if (filters.includes(Constants.FAILED.name) || filters.includes(Constants.MD5.name) || filters.includes(Constants.SHA.name)) {
            results = getFailedData(data, filters);
            console.log("results", results);
        }

        if (filters.includes(Constants.REDIRECTS.name))
            results = getRedirectData(data);
      
        if (filters.includes(Constants.NOT_TESTED.name))
            results = getNotTestedData(data);

        if (filters.includes(Constants.TIMED_OUT.name))
            results = getTimedOutData(data);

        // if all fails display all the data
        return results;
    }

    return(
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg" className={classes.root}>
                <React.Fragment>
                    <form onSubmit={(e) => handleDisplay(e)}>
                        <div className="App">
                            <AppBar>
                                <Toolbar className={classes.toolbar}>
                                    <Grid justify="space-between"
                                        container>
                                        <Grid item>
                                            <Typography
                                                variant="h2"
                                            >Check Tests Results
                                            </Typography>
                                            <Typography
                                                variant="h4"
                                            >A visual tool to display the current state of test profiles.
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <PTSHelp />
                                        </Grid>
                                    </Grid>
                                </Toolbar>
                            </AppBar>
                        </div>
                        <Grid container >
                            <Grid container item  
                                style={{marginTop:"2em"}}
                                justify="flex-start"
                                alignItems="flex-start"
                                spacing={1} 
                                direction="row">
                                <Checkboxes {...checkboxes}  />
                                    
                                <Grid item xs={12} sm={3}>

                                    <TextField
                                        value={searchValue}
                                        label="Profile Name"
                                        variant="filled"
                                        size="small"
                                        color="primary"
                                        InputLabelProps={{
                                            shrink: true,
                                            }}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                                            disableUnderline: true,
                                            className: classes.searchField

                                        }}
                                        onChange={(e) => setSearchValue(e.target.value)}   
                                    />                                 
                                </Grid>
                            </Grid>
                            <Grid container 
                                justify="flex-start"
                                alignItems="flex-start"
                                direction="row"> 
                                <Grid item sm={9} md={8} lg={6} ></Grid>
                                <Grid item>
                                    <Button 
                                        className={classes.button}
                                        startIcon={<ClearIcon />}
                                        onClick={(e) => clearForm(e)}>
                                        Clear
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                                    
                        <Divider style={{marginTop: "1em"}}/>
                    </form>

                    <TableContainer >
                        <Table className={classes.borders}>
                            <TableBody className={classes.borders}>
                                <PTSResults results={getData(props.data)} />
                            </TableBody>
                        </Table> 
                    </TableContainer>

                </React.Fragment>
            </Container>
        </ThemeProvider>
    )
}
