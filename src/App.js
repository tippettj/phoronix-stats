import './App.css';
import axios from 'axios';
import React,{useState, useEffect} from 'react';
import { FilterForm } from './components/FilterForm';
import { LinearProgress } from '@material-ui/core';
import useStyles from './components/styles';
import {mapData, getLatestVersion} from '../src/processData.js';

function App() {
  //const apiEndPoint = "check-tests-results.json";   
  const apiEndPoint = "check-tests-results.json";   


  const classes = useStyles();

  const [data,setData]=useState([]);
  const [loading, setLoading] = useState(true);

  // UseEffect runs when component mounts and also when it updates
  // Since we are changing the state of data, it will run again and again unless we set the second arg to [].
  // This tells the hook that we are not listening for any changes to data this preventing an infinite loop.
  useEffect(()=> {
     const getData = async () => {
        const result = await axios(apiEndPoint);
        // Map all versions of a profile
        let mappedData = mapData(result.data);

        // Map the latest version of each profile
        let latestVersion = getLatestVersion(result.data);
        let mappedLatestData = mapData(latestVersion);

        let map = {
          all : mappedData,
          latest : mappedLatestData
        };
        

        //console.log("!!!!UseEffect mappedData", map);
        setData(map);
        setLoading(false);
    }

    getData();

  },[])


  return (
    <div className={classes.root}>
      {loading ? <LinearProgress  className={classes.progressBar}/> : <FilterForm data={data}/> } 
    </div>
  );

}

export default App;
