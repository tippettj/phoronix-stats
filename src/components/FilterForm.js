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

import Checkboxes, {useCheckboxes, getCheckboxName} from './Checkboxes';
import PTSHelp from './PTSHelp';
import PTSResults from './PTSResults';
import * as Constants from '../Constants';
import {theme} from './theme';
import "./styles.css";
import useStyles from "./styles";
import PTSSignifier from './PTSSignifier';

import {getNotTestedData, getRedirectData, getSearchData, getFailedData, getLatestVersion, mapData} from '../processData';


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
        let data = mapData([...allData]);
        console.log("Mapped Data:", data);
        let results = data;

        // determine which checkboxes have been selected
        const filters = checkboxes.checkboxes.filter((checks) => checks.checked === true).map((checkbox) => checkbox.name);
        console.log("Filters", filters);
        
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

        // Top Level Searches
        if (filters.includes(Constants.ALL.name)) 
            results = data;

        if (filters.includes(Constants.LATEST.name))
            results = getLatestVersion(data);

        // Secondary Searches
        if (filters.includes(Constants.ALL.name) || filters.includes(Constants.LATEST.name) )
            data = results;

        //if (filters.includes(Constants.FAILED.name) || filters.includes(Constants.MD5.name) || filters.includes(Constants.SHA.name)) {
        console.log("filters", filters);
        if (filters.includes(Constants.FAILED.name) && filters.includes(Constants.CHECKSUM.name)) {
            let newFilter = getAllFilters(Constants.CHECKSUM, filters);
            //console.log("1 .....");
            console.log("new filters", newFilter);
            results = getFailedData(data, newFilter);
        } else if (filters.includes(Constants.FAILED.name) && filters.includes(Constants.DOWNLOAD.name)) {
            let newFilter = getAllFilters(Constants.DOWNLOAD, filters);
            //console.log("2 .....");
            console.log("new filters", newFilter);
            results = getFailedData(data, newFilter);
        }
            else if (filters.length <=2 && filters.includes(Constants.FAILED.name) ) {
            //console.log("3 .....");
            results = getFailedData(data, filters);
        }

        // if (filters.includes(Constants.FAILED.name) && filters.includes(Constants.DOWNLOAD.name)) {
        //     let newFilter = getAllFilters(Constants.DOWNLOAD, filters);
        //     console.log("3 .....");
        //     console.log("new filters", newFilter);
        //     results = getFailedData(data, newFilter);
        // } else if (filters.includes(Constants.FAILED.name) ) {
        //     console.log("4 .....");
        //     results = getFailedData(data, filters);
        // }

        if (filters.includes(Constants.REDIRECTS.name))
            results = getRedirectData(data);
      
        if (filters.includes(Constants.NOT_TESTED.name))
            results = getNotTestedData(data);

        // if (filters.includes(Constants.TIMED_OUT.name))
        //     results = getTimedOutData(data);

        // if all fails display all the data
        console.log("++Results", results);
        return results;
    }

    function getAllFilters(parent, filters) {
        // if no children are in the filters then add all the children
        let children = getChildrensName(parent.children);
        let childFilters = children.some(child => filters.includes(child));
        console.log("hasChildren", childFilters, "children", children);

        // If a child filter has been selected limit search to selection, otherwise
        // search for all child criteria.
        if (!(childFilters))
            return [...filters, ...children];
        else
            return [...filters]
    }

    // Convert the index into a checkbox name
    function getChildrensName(children) {
        let ch = [];
        children.map(child => ch.push(getCheckboxName(child)));
        return ch;
    }

    let results = getData(props.data);

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
                                <Grid item xs={12} sm={3} md={2} lg={2}>
                                    <Grid container direction="column" >
                                        <Grid container direction="row" >
                                            <Grid item><PTSSignifier colorStatus={[1]}/></Grid>
                                            <Typography>XXX</Typography>
                                        </Grid>
                                        <Grid container direction="row" >
                                            <Grid item><PTSSignifier colorStatus={[3]}/></Grid>
                                            <Typography>MD5</Typography>
                                        </Grid>
                                        <Grid container direction="row" >
                                            <Grid item><PTSSignifier colorStatus={[4]}/></Grid>
                                            <Typography>SHA</Typography>
                                        </Grid>

                                    </Grid>
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

                    {results ? 
                        (<TableContainer >
                            <Table className={classes.borders}>
                                <TableBody className={classes.borders}>
                                    <PTSResults results={results} />
                                </TableBody>
                            </Table> 
                        </TableContainer>) :
                        (<Typography>
                            No Test Profiles match the search criteria
                        </Typography>)
                    }

                </React.Fragment>
            </Container>
        </ThemeProvider>
    )
}
