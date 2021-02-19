import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
   
    // Container
    root: {
      // flexGrow: 1,
      // alignItems: "center",
      // justifyContent: "center",
    },

    progressBar: {
      color: theme.palette.secondary.main,
      position: "relative",
      marginTop: "20%"
    },

    // Clear Button
    button: {
        background: 'linear-gradient(45deg, #285F80 29%, #333333 81% )',
        border: 0,
        borderRadius: 15,
        color: '#FFFFFF', // white
        padding: '5px 30px',
        // marginRight: '20px',
        fontSize: 12,
        marginTop: "0.5em"
    },
    
    toolbar: {
      //background: 'linear-gradient(45deg, #285F80 29%, rgba(51,51,51,95) 91% )',
      background: "#285F80",
      padding: '1em',
    },

    // keep for debugging
    borders: {
        // borderWidth: 1,
        // borderColor: "red",
        // borderStyle: "solid", 
    },

    // Rows containing the profile Name
    profileNameRow: {
      //backgroundColor: "#CCD1D1", //light grey
      backgroundImage: 'linear-gradient(90deg, rgba(227,224,224, 5) 0%, rgba(126,159,178,1) 98%)',
    },

    // Profile Name titles
    profileName:
    {
      padding: "0.5rem",
      fontWeight: theme.typography.fontWeightBold,
      '&:hover' : {
        fontWeight:theme.typography.fontWeightBold,
        cursor: "pointer",
      },
    },

    // Rows containing package Names title
    packageName: {
      marginLeft: "2em",
      fontWeight: theme.typography.fontWeightMedium,
      '&:hover' : {
        fontWeight: theme.typography.fontWeightBold,
        cursor: "pointer",
      },
      borderTopColor: "black",
      borderTopWidth: "2px",
      borderTopStyle: "solid",
    },

    // Rows containing package Names Details FileName/FileSize
    packageNameRow: {
      backgroundColor: "#d6dada",  
    },

    // Rows containing mirror details ie Status/Duplicate/Failures
    mirrorRow: {
      backgroundColor: "#d6dada",
    },

    // Rows containing failure details ie MD5/SHA246
    failureRow: {
      backgroundColor: "#d6dada",
    },

    // Heading throughout Table, usually keys in JSON File
    heading: {
         color: "#000000", //black
         fontWeight:theme.typography.fontWeightMedium,
         marginLeft: "3em"
    },

    // Headings throughout table, usually values from JSON file
    secondaryHeading: {
         color: theme.palette.text.secondary
    },

    // Heading under collapsed Mirror ie Mirror 1
    mirrorHeading: {
      marginLeft: "3em",
      '&:hover' : {
        fontWeight:theme.typography.fontWeightBold,
        cursor: "pointer",
      },
    },

    // Heading under collapsed Mirror ie the url reflecting the mirror
    mirrorSecondaryHeading: {
      '&:hover' : {
        fontWeight:theme.typography.fontWeightBold,
        cursor: "pointer",
      },
      // textAlign: "inherit", 
    },

    // Headings for the mirror data. Usually keys like Status/Duplicate/Failures
    mirrorDataHeading: {
      color: "#000000", //black
      fontWeight:theme.typography.fontWeightMedium,
      width: "130px",
    },

    //TextField details
    searchField: {
      //backgroundColor: "#d7d8da", // a bit darker then #d3d5d8
      backgroundColor: "#d3d5d8",
      marginTop:"0.5em",
    },

    // disable the circle that appears when hovering over a checkbox
    checkboxes: {
      '&:hover': {
        backgroundColor: "transparent"
      },  
    },
    
  }));

  export default useStyles;
