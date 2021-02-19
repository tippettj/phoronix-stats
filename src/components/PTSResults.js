import React from 'react';
import PTSProfile from './PTSProfile';


/**
 * Displays the results based on the filters(checkboxes) selected.
 * @param props the results to be displayed. Note the filters have already been applied.
 */
function PTSResults(props) {
  const data = props.results;
  
  const getResults = (data) => {  
    if (data && data.length>0 ) {
      return data.map((profile, tpKey) =>  
         (<PTSProfile key={tpKey} data={profile}/> )
      )
    }
  }

  return ( 
    <React.Fragment>
      {getResults(data)}
    </React.Fragment>
  );
}

export default PTSResults;