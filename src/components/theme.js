import {createMuiTheme} from '@material-ui/core/styles';

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
        text: {
            secondary: "#424242",
        },
        grey: {
            // 100 : "#d6dada",
            100 : "#fafbfb",

        },
        background: {
            textfield : "fafbfb",
        },

    },
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