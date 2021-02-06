import {createMuiTheme} from '@material-ui/core/styles';

export const theme = createMuiTheme({
    typography: {
        h2: {
            fontSize:36,
            marginBottom:15,
        },
    },
    palette: {
        primary: {
            main: '#285F80', 
        },
        secondary: {
            main: '#d32f2f', 
        },

    },
    overrides: {
        MuiContainer: {
            root : {
              marginLeft: "10px",
            }
        }
    }
});

export default theme;