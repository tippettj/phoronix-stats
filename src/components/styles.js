import { makeStyles } from '@material-ui/core/styles';
import { theme } from './theme';

export const useStyles = makeStyles(() => ({
   
    // Container
    root: {
      background: "#fbfffc",
      marginBottom: "3em",
      flexGrow: 1,
    },

    // Displays before page loads
    progressBar: {
      color: theme.palette.secondary.main,
      position: "relative",
      marginTop: "20%"
    },

    // Clear Button
    button: {
        background: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        fontWeight: theme.typography.fontWeightBold,
        border: 0,
        borderRadius: theme.shape.borderRadius,
        padding: '5px 30px',
        fontSize: 12,
        marginTop: "0.5em"
    },
    toolbar: {
      background: theme.palette.primary.main,
      padding: '1em',
    },

    // Contains the Legend Details
    paper: {
      padding: theme.spacing(2),
      margin: "1rem 1rem 1rem 0rem",
      textAlign: "left",
      color: theme.palette.text.secondary,
      height: "240px",
    },

    // keep for debugging
    borders: {
        borderWidth: 1,
        borderColor: "black",
        borderStyle: "solid", 
    },

    // checkboxes tool tip
    checkboxTip: {
      color: theme.palette.common.black,
      fontSize: "48!important",
    },
    tableHeader: {
      backgroundColor: theme.palette.grey[200],
    },

    // Rows containing the profile Name
    profileNameRow: {
      backgroundColor: theme.palette.grey[200],
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.grey[100],
      },
    },

    // Cell which displays the number of results
    resultsRow:{
      padding: "0.5rem",
      fontWeight: theme.typography.fontWeightBold,
      backgroundColor: theme.palette.grey[300],
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
      backgroundColor: theme.palette.grey[100],

    },

    // Rows containing mirror details ie Status/Duplicate/Failures
    mirrorRow: {
      backgroundColor: theme.palette.grey[100],
    },

    // Rows containing failure details ie MD5/SHA246
    failureRow: {
      backgroundColor: theme.palette.grey[100],
    },

    // Heading throughout Table, usually keys in JSON File
    heading: {
         color: theme.palette.text.primary, //black
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
      color: theme.palette.text.primary, //black
      fontWeight:theme.typography.fontWeightMedium,
      width: "130px",
    },

    // Headings for the failures
    failureHeading: {
      color: theme.palette.text.primary, //black
      fontWeight:theme.typography.fontWeightMedium,
 },
    //TextField details
    searchField: {
      backgroundColor: theme.palette.background.textfield,
      marginTop:"0.5em",
    },

    // disable the circle that appears when hovering over a checkbox
    checkboxes: {
      '&:hover': {
        backgroundColor: "transparent"
      }, 
    },

    helpIcon: {
      color: theme.palette.secondary.light,
    }
    
  }));

  export default useStyles;
