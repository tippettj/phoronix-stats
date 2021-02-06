import { withStyles, makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    // ...theme.spread,
    root: {
      flexGrow: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        color: "#000000", //black
        flexBasis: "20%",
        flexShrink: 0,
        marginLeft: "1.5em"
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: "33.33%",
        color: theme.palette.text.secondary
    },
    cell_title: {
        fontSize: "10px",
        width: 100,
        minWidth: 1,
        color: "#000000",   //white
        backgroundColor: "#2Ecc71", //green
        //flexBasis: 'fit-content'
  
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
    //   cell_mirror_title: {
    //     fontSize: "10px",
    //     width: 150,
    //     backgroundColor: '#AE44AD',  //purple
    //     padding: "0px",
    //     //flexBasis: 'fit-content'
    //   },
    //   cell_mirror: {
    //     fontSize: "10px",
    //     //width: 1000,
    //     backgroundColor: '#3498DB', //blue
    //     padding: "0px",
    //     flexBasis: 'fit-content'
    //   },
  }));

  export default useStyles;
