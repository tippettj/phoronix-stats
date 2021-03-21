import React, {useState} from 'react';
import {ThemeProvider} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container'; //Defines the size of page
import Toolbar from '@material-ui/core/Toolbar'; 
import AppBar from '@material-ui/core/AppBar'; 
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import 'fontsource-roboto';

import Checkboxes, {useCheckboxes, getCheckboxName} from './Checkboxes';
import PTSHelp from './PTSHelp';
import Legend from './Legend';
import PTSResults from './PTSResults';
import * as Constants from '../Constants';
import {theme} from './theme';
import "./styles.css";
import useStyles from "./styles";


import {getProfileColor, getSearchData} from '../processData';


export function FilterForm(props) {
    const [searchValue, setSearchValue] = useState(""); // value in the profileName text field
    const checkboxes = useCheckboxes();                 // filter to determine which results to display
    const classes = useStyles();                        


    const [legend, setLegend] = React.useState(false);
    
      const handleLegend = (event) => {
        //console.log("!!!!legend", legend);
        setLegend(event.target.checked);
      };

      const handleClearSearch = (event) => {
        //console.log("!!!!clear", searchValue);
        setSearchValue("");
        event.preventDefault();
      };

    // display the results on the page
    const handleDisplay = (event) => {
        event.preventDefault();
    }

    // clear form of all data and reset checkboxes
    // const clearForm = (event) => {
    //     checkboxes.checkboxes.map((box, idx) => checkboxes.setCheckbox(idx, false));
    //     setSearchValue("");
    //     event.preventDefault();
    // }

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
        //let {testProfile : data, dataMap}= mapData([...allData]);
        let {testProfile : data, dataMap}= allData.all;
        let {testProfile : latestData, dataMap : latestDataMap}= allData.latest;

        //console.log("Mapped Data:", data, dataMap);
        
        // determine which checkboxes have been selected
        const filters = checkboxes.checkboxes.filter((checks) => checks.checked === true).map((checkbox) => checkbox.name);
        //console.log("Filters", filters);
        
        // Set the default to display all results
        let results = data;

        // If no checkboxes have been selected, display 0 results
        if (filters && filters.length === 0 ) {
            results = null;
        }

        // Top Level Searches
        if (filters.includes(Constants.ALL.name)) 
            results = data;

        if (filters.includes(Constants.LATEST.name)) {
            results = latestData;
            dataMap = latestDataMap;
            //results = getLatestVersion(data);
        }

        // Secondary Searches
        //if (filters.includes(Constants.FAILED.name) || filters.includes(Constants.MD5.name) || filters.includes(Constants.SHA.name)) {
        //console.log("DataMap before secondary filters", dataMap);
        if (filters.includes(Constants.FAILED.name) && filters.includes(Constants.CHECKSUM.name)) {
            //let newFilter = getAllFilters(Constants.CHECKSUM, filters);
            results = dataMap.checksum;
        } else if (filters.includes(Constants.FAILED.name) && filters.includes(Constants.DOWNLOAD.name)) {
            //let newFilter = getAllFilters(Constants.DOWNLOAD, filters);
            results = dataMap.download;
        } else if (filters.includes(Constants.FAILED.name) && filters.includes(Constants.REDIRECTS.name)) {
            //let newFilter = getAllFilters(Constants.REDIRECTS, filters);
            results = dataMap.redirect;
        } else if (filters.includes(Constants.FAILED.name) && filters.includes(Constants.NONE.name)) {
            //let newFilter = getAllFilters(Constants.REDIRECTS, filters);
            results = dataMap.failed;        
        } else if (filters.includes(Constants.NOT_TESTED.name)) {
            results = dataMap.notTested;
        } else if (filters.length <=2 && filters.includes(Constants.FAILED.name) ) {
            results = dataMap.failed;
        }

         // If a search value has been defined, get the subset of data that matches the search criteria
        // and further reduce the data based on the filters selected.
        if ( searchValue !== "" ) {
            results = getSearchData(results, searchValue);
        }
        
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

    //console.log("!!!!!GETTING DATA");
    let results = getData(props.data);

    return(
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg" className={classes.root}>
                <React.Fragment>
                    <form onSubmit={(e) => handleDisplay(e)}>
                        <div className={classes.root} className="App">
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
                        {/* <div className={classes.root}> */}
                        <Grid  container>
                            <Grid style={{marginTop:"4rem"}} item xs={12}>
                                
                                <Grid container item xs={12}
                                    // style={{marginTop:"2em"}}
                                    // justify="flex-start"
                                    // alignItems="flex-start"
                                    // spacing={1} 
                                    // direction="row"
                                    >

                                    <Checkboxes {...checkboxes} displayLegend={legend} />
                                    <Grid item xs={3}>
                                        {/* <Paper style={{marginTop:"2em"}} className={classes.paper}>XXXGrid 4-1</Paper> */}
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
                                                endAdornment: <InputAdornment position="end"><ClearIcon style={{cursor:'default'}} onClick={handleClearSearch}/></InputAdornment>,
                                                disableUnderline: true,
                                                className: classes.searchField

                                            }}
                                           
                                            onChange={(e) => setSearchValue(e.target.value)}   
                                        />      
                                    </Grid>
                                    <Grid item xs={5}>
                                        {/* <Paper style={{marginTop:"2em"}} className={classes.paper}>XXXGrid 4-2</Paper> */}
                                        <FormControlLabel
                                                control={
                                                <Checkbox
                                                    checked={legend.checked}
                                                    onChange={handleLegend}
                                                    name="legend"
                                                    color="primary"
                                                />
                                                }
                                                label="Display Legend"
                                            />

                                             <Grid item container direction="column" >
                                                <Grid item >  
                                                    {(legend ? <Legend />: null)}
                                                </Grid>
                                            </Grid>
                                    </Grid>                          
                                </Grid>                       
                            </Grid>
                        </Grid>
                        <Divider style={{marginTop: "1em"}}/>
                    </form>

                    {results ? 
                        (<TableContainer style={{maxHeight:1000}}>
                            <Table stickyHeader className={classes.borders}>
                                <TableHead>
                                    <TableRow className={classes.tableHeader}>
                                        <TableCell><Typography className={classes.profileName} color='primary'> Results: {results.length}</Typography></TableCell>
                                    </TableRow>
                                </TableHead>
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
