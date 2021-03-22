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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import 'fontsource-roboto';

import Checkboxes, {useCheckboxes} from './Checkboxes';
import PTSHelp from './PTSHelp';
import Legend from './Legend';
import PTSResults from './PTSResults';
import * as Constants from '../Constants';
import {theme} from './theme';
import "./styles.css";
import useStyles from "./styles";
import StyledTableCell from './StyledTableCell';



import { getSearchData } from '../processData';


export function FilterForm(props) {
    const { lastDownload } = props;
    const [searchValue, setSearchValue] = useState(""); // value in the profileName text field
    const checkboxes = useCheckboxes();                 // filter to determine which results to display
    const classes = useStyles();                        

    const [legend, setLegend] = React.useState(false);
    
    // Display/Hide Legend based on the legend checkbox value
    const handleLegend = (event) => {
        setLegend(event.target.checked);
    };

    // Clear the profile name text field
      const handleClearSearch = (event) => {
        setSearchValue("");
        event.preventDefault();
      };

    // display the results on the page
    const handleDisplay = (event) => {
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
        let {testProfile : data, dataMap}= allData.all;
        let {testProfile : latestData, dataMap : latestDataMap}= allData.latest;
        
        // determine which checkboxes have been selected as these will be the filters for the search
        const filters = checkboxes.checkboxes.filter((checks) => checks.checked === true).map((checkbox) => checkbox.name);
        
        // Set the default to display all results
        let results = data;

        // If no checkboxes have been selected, display 0 results
        if (filters && filters.length === 0 ) {
            results = null;
        }

        // Top Level Searches either ALL or LATEST versions of a test profile
        if (filters.includes(Constants.ALL.name)) 
            results = data;

        if (filters.includes(Constants.LATEST.name)) {
            results = latestData;
            dataMap = latestDataMap;
        }

        // Secondary Searches use the results from the top level search
        if (filters.includes(Constants.FAILED.name) && filters.includes(Constants.CHECKSUM.name)) {
            //let newFilter = getAllFilters(Constants.CHECKSUM, filters); //for future dev if want to drill down to either MD5 or SHA
            results = dataMap.checksum;
        } else if (filters.includes(Constants.FAILED.name) && filters.includes(Constants.DOWNLOAD.name)) {
            results = dataMap.download;
        } else if (filters.includes(Constants.FAILED.name) && filters.includes(Constants.REDIRECTS.name)) {
            results = dataMap.redirect;
        } else if (filters.includes(Constants.FAILED.name) && filters.includes(Constants.NONE.name)) {
            results = dataMap.failed;        
        } else if (filters.includes(Constants.NOT_TESTED.name)) {
            results = dataMap.notTested;
        } else if (filters.length <=2 && filters.includes(Constants.FAILED.name) ) {
            results = dataMap.failed;
        }

         // If a search value has been defined in the Test Profile text field, get the subset of data that matches the search criteria
        // and further reduce the data based on the filters selected.
        if ( searchValue !== "" ) {
            results = getSearchData(results, searchValue);
        }
        
        return results;
    }

    // **** Keep for future development if you want to add specific failed checkboxes ie MD5s or SHAs
    // function getAllFilters(parent, filters) {
    //     // if no children are in the filters then add all the children
    //     let children = getChildrensName(parent.children);
    //     let childFilters = children.some(child => filters.includes(child));

    //     // If a child filter has been selected limit search to selection, otherwise
    //     // search for all child criteria.
    //     if (!(childFilters))
    //         return [...filters, ...children];
    //     else
    //         return [...filters]
    // }


    let results = getData(props.data);

    return(
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg" className={classes.root}>
                <React.Fragment>
                    <form onSubmit={(e) => handleDisplay(e)}>
                        <div className={classes.root} >
                            <AppBar>
                                <Toolbar className={classes.toolbar}>
                                    <Grid justify="space-between"
                                        container>
                                        <Grid item>
                                            <Typography
                                                variant="h2"
                                            >Test Profile Download Status
                                            </Typography>
                                            {lastDownload ?
                                            <Typography
                                            >Last Download: {lastDownload}
                                            </Typography> : null}
                                        </Grid>
                                        <Grid item>
                                            <PTSHelp/>
                                        </Grid>
                                    </Grid>
                                </Toolbar>
                            </AppBar>
                        </div>
                        {/* <div className={classes.root}> */}
                        <Grid  container>
                            <Grid style={{marginTop:"4rem"}} item xs={12}>
                                
                                <Grid container item xs={12}>

                                    <Checkboxes {...checkboxes} displayLegend={legend} />

                                    <Grid item xs={3}>
                                        <TextField
                                            value={searchValue}
                                            label="Profile Name"
                                            variant="standard"
                                            size="small"
                                            color="primary"
                                            style={{marginTop:'0.5em'}}
                                            InputLabelProps={{shrink: true}}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                                                endAdornment: <InputAdornment position="end"><ClearIcon style={{cursor:'default'}} onClick={handleClearSearch}/></InputAdornment>,
                                                // disableUnderline: true,
                                                className: classes.searchField

                                            }}
                                            onChange={(e) => setSearchValue(e.target.value)}   
                                        />      
                                    </Grid>
                                    <Grid item xs={5}>
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
                                        <StyledTableCell colSpan={3}><Typography className={classes.resultsRow} color='primary'> Results: {results.length}</Typography></StyledTableCell>
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
