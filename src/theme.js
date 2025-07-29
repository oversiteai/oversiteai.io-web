import { createTheme } from '@mui/material/styles';

// Get CSS variables from root
const getCSSVariable = (varName) => {
  if (typeof window !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  }
  return '';
};

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2bb4c6', // var(--Blue)
    },
    secondary: {
      main: '#4dffb0', // var(--Green)
    },
    error: {
      main: '#ff3d66', // var(--Red)
    },
    background: {
      default: '#0a0a0b', // var(--Dark-Base)
      paper: '#151517', // var(--Dark-Secondary)
    },
    text: {
      primary: '#e0e0e0', // var(--Text)
      secondary: '#949494', // var(--Gray)
    },
    divider: '#2a2a2c', // var(--Border)
  },
  typography: {
    fontFamily: 'inherit',
    fontSize: 14,
    button: {
      textTransform: 'none',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0a0a0b',
          color: '#e0e0e0',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0.3vw',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '0.3vw',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '0.5vw',
        },
      },
    },
  },
});

export default theme;