import './App.css';
import axios from 'axios';
import React,{useState, useEffect} from 'react';
import { FilterForm } from './components/FilterForm';

function App() {
  const apiEndPoint = "check-tests-results.json";

  const [data,setData]=useState([]);

  // UseEffect runs when component mounts and also when it updates
  // Since we are changing the state of data, it will run again and again unless we set the second arg to [].
  // This tells the hook that we are not listening for any changes to data this preventing an infinite loop.
  useEffect(()=> {
     const getData = async () => {
        const result = await axios(apiEndPoint);
        setData(result.data);
    }

    getData();

  },[])

  return (
    <div>
      <FilterForm data={data}/>  
    </div>
  );

}

export default App;
