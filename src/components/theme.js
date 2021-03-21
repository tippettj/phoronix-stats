import {createMuiTheme} from '@material-ui/core/styles';

import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import orange from '@material-ui/core/colors/orange';
import yellow from '@material-ui/core/colors/yellow';
import purple from '@material-ui/core/colors/purple';

export const theme = createMuiTheme({
    typography: {
        h2: {
            fontSize:36,
            marginBottom:15,
        },
        h4: {
            fontSize:24,
        },
    },
    palette: {
        primary: {
            //main: '#d32f2f',
            main: '#285F80', 
        },
        secondary: {
            main: '#d32f2f', 
        },
        error : {
            light: '#f00000',
            main: '#cc3300',
            dark: '	#a90000'
        },
        severe_warning: {
            main: '#ff9966',
        },
        warning : {
            dark: '#fa8c16',
            main: '#fa8c16',
        },
        warning_info : {
            main: '#99cc33',
        },
        fatal : {
            main: '#000000',
        },
        grey: {
            100 : "#fafbfb",
        },
        background: {
            textfield : "fafbfb",
        },

    },
    spacing : 2,
    overrides: {
        MuiTooltip: {
            tooltip: {
            fontSize: "0.75em",
            color: "white",
            //backgroundColor: "#000000",
        }
        },
    }
    // overrides: {
    //     MuiContainer: {
    //         root : {
    //           marginLeft: "10px",
    //         }
    //     }
    // }
});

export default theme;