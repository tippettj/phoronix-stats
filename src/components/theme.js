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
            main: '#285F80', 
        },
        secondary: {
            main: '#d32f2f', 
        },
        error: {
            light: '#f00000',
            main: '#cc3300',
            dark: '	#a90000'
        },
        fatal : {
            main: '#000000',
        },
        warning: {
            dark: '#fa8c16',
            main: '#fa8c16',
        },
        pass: {
            main: '#339900',
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
        }
        },
    }
});

export default theme;