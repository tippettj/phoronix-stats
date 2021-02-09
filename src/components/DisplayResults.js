import React from 'react';
import PTSPackages from './PTSPackages';

/**
 * Displays the results based on the filters(checkboxes) selected.
 * @param props the results to be displayed. Note the filters have already been applied.
 */
function DisplayResults(props) {
  const data = props.results;
  
  const getAllResults = (data) => {
    let testProfile = null;
  
    console.log(data);
    if (data && data.length>0 ) {
      testProfile = data.map((profile, tpKey) =>  
        profile.packages.map((packs, key) => 
        <PTSPackages key={key} data={packs} />     )
      )
  
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