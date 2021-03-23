import TableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core/styles';

 const StyledTableCell = withStyles((theme) => ({
    head: {
      color: theme.palette.common.white,
      padding: "0px",
      backgroundColor: "#CCD1D1", //light grey
    },
    body: {
      fontSize: 14,
      padding:"2px",
      marginLeft:"1.5em",
      borderWidth: "2px",
      borderStyle: "dotted",
      borderColor: "#eff1f1",
    }
  }))(TableCell);

  export default StyledTableCell;

  