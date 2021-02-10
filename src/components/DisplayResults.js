import React from 'react';
import PTSProfile from './PTSProfile';


/**
 * Displays the results based on the filters(checkboxes) selected.
 * @param props the results to be displayed. Note the filters have already been applied.
 */
function DisplayResults(props) {
  const data = props.results;
  
  const getAllResults = (data) => {
    let testProfile = null;
  
    if (data && data.length>0 ) {
      testProfile = data.map((profile, tpKey) =>  {
        return (<PTSProfile key={tpKey} data={profile}/> );
      })
  
      return testProfile;
    }
  }

  return ( 
   <React.Fragment>
      {getAllResults(data)}
    </React.Fragment>
  );
}

export default DisplayResults;