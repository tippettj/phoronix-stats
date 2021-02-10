import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    // ...theme.spread,
    notchedOutline: {
        borderWidth: '2px',
        //borderColor: '#285F80 !important'
        borderColor: 'rgba(0,0,0,0.54)'
      },
    
    root: {
      flexGrow: '100%',
    },
    button: {
        background: 'linear-gradient(45deg, #285F80 29%, #333333 81% )',
        border: 0,
        borderRadius: 15,
        color: '#FFFFFF', // white
        padding: '5px 30px',
        marginRight: '20px',
        fontSize: 12,
        marginTop: "0.5em"
    },
    title: {
        marginBottom: '10px',
    },
    toolbar: {
        marginBottom: '1em',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        color: "#000000", //black
        fontWeight:theme.typography.fontWeightMedium,
        //flexBasis: "40%",
        //flexShrink: 0,
        marginLeft: "1.5em"
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: "33.33%",
        color: theme.palette.text.secondary
    },
    mirrorHeading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight:theme.typography.fontWeightBold,
        color: "#000000", //black
        //flexBasis: "90%",
        flexShrink: 0,
        marginLeft: "1.5em",
        maxWidth: theme.typography.pxToRem(800),
        textAlign: "inherit", 
    },
    failuresHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: "#000000", //black
        fontWeight:theme.typography.fontWeightMedium,
        //flexBasis: "40%",
        //flexShrink: 0,
        marginLeft: "1.5em"
    },

    cell_title: {
        fontSize: "10px",
        width: 100,
        minWidth: 1,
        color: "#000000",   //white
        backgroundColor: "#2Ecc71", //green
        //flexBasis: 'fit-content'
        verticalAlign: 'top',
  
      },
    cell_long: {
      fontSize: "10px",
      width: 400,
      minWidth: 1,
      backgroundColor: '#ee82ee'

    },
    cell_short: {
        fontSize: "10px",
        width: 100,
        backgroundColor: '#E74C3C', //red
        padding: "0px"
  
      },
      cell_mirror_title: {
        //fontSize: "10px",
        width: 160,
        backgroundColor: '#AE44AD',  //purple
        //padding: "0px",
        //flexBasis: 'fit-content'
      },
      cell_mirror: {
        //fontSize: "10px",
        //width: 1000,
        backgroundColor: '#3498DB', //blue
        //padding: "0px",
        //flexBasis: 'fit-content'
      },
  }));

  export default useStyles;
