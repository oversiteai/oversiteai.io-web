import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Create a custom theme for the admin panel
let adminTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    // Tell MUI what 1rem is (base font size)
    htmlFontSize: 16,
    fontSize: 14,
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      '@media (min-width:600px)': {
        fontSize: '3rem',
      },
      '@media (min-width:960px)': {
        fontSize: '3.5rem',
      },
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      '@media (min-width:600px)': {
        fontSize: '2.5rem',
      },
      '@media (min-width:960px)': {
        fontSize: '3rem',
      },
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      '@media (min-width:600px)': {
        fontSize: '2rem',
      },
      '@media (min-width:960px)': {
        fontSize: '2.5rem',
      },
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      '@media (min-width:600px)': {
        fontSize: '1.75rem',
      },
      '@media (min-width:960px)': {
        fontSize: '2rem',
      },
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      '@media (min-width:600px)': {
        fontSize: '1.5rem',
      },
      '@media (min-width:960px)': {
        fontSize: '1.75rem',
      },
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 500,
      '@media (min-width:600px)': {
        fontSize: '1.25rem',
      },
      '@media (min-width:960px)': {
        fontSize: '1.5rem',
      },
    },
    subtitle1: {
      fontSize: '0.875rem',
      fontWeight: 500,
      '@media (min-width:600px)': {
        fontSize: '1rem',
      },
      '@media (min-width:960px)': {
        fontSize: '1.125rem',
      },
    },
    subtitle2: {
      fontSize: '0.75rem',
      fontWeight: 500,
      '@media (min-width:600px)': {
        fontSize: '0.875rem',
      },
      '@media (min-width:960px)': {
        fontSize: '1rem',
      },
    },
    body1: {
      fontSize: '0.875rem',
      '@media (min-width:600px)': {
        fontSize: '1rem',
      },
      '@media (min-width:960px)': {
        fontSize: '1.125rem',
      },
    },
    body2: {
      fontSize: '0.75rem',
      '@media (min-width:600px)': {
        fontSize: '0.875rem',
      },
      '@media (min-width:960px)': {
        fontSize: '1rem',
      },
    },
    button: {
      fontSize: '0.75rem',
      textTransform: 'none',
      '@media (min-width:600px)': {
        fontSize: '0.875rem',
      },
      '@media (min-width:960px)': {
        fontSize: '1rem',
      },
    },
    caption: {
      fontSize: '0.625rem',
      '@media (min-width:600px)': {
        fontSize: '0.75rem',
      },
      '@media (min-width:960px)': {
        fontSize: '0.875rem',
      },
    },
    overline: {
      fontSize: '0.625rem',
      textTransform: 'uppercase',
      '@media (min-width:600px)': {
        fontSize: '0.75rem',
      },
      '@media (min-width:960px)': {
        fontSize: '0.875rem',
      },
    },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#2BB4C6',
      light: '#5CC5D3',
      dark: '#1E7D8A',
    },
    secondary: {
      main: '#4DFFB0',
      light: '#7AFFC6',
      dark: '#2FB270',
    },
    error: {
      main: '#FF3D66',
      light: '#FF7091',
      dark: '#B22A47',
    },
    warning: {
      main: '#FFA726',
      light: '#FFB74D',
      dark: '#F57C00',
    },
    info: {
      main: '#29B6F6',
      light: '#4FC3F7',
      dark: '#0288D1',
    },
    success: {
      main: '#4DFFB0',
      light: '#7AFFC6',
      dark: '#2FB270',
    },
    background: {
      default: '#1B1F23', // Dark-BG from main site
      paper: '#131619', // Dark-Secondary from main site
    },
    text: {
      primary: '#FFF', // White from main site
      secondary: '#D1D5DC', // Text from main site
    },
    divider: '#202328',
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        // Force override all global styles for admin panel
        '.admin-panel': {
          // Reset all CSS variables to fixed values
          '--fs-hero': '48px !important',
          '--fs-h1': '42px !important',
          '--fs-h2': '32px !important',
          '--fs-h3': '28px !important',
          '--fs-body-lg': '18px !important',
          '--fs-body': '16px !important',
          '--fs-small': '14px !important',
          '--fs-tiny': '12px !important',
          
          // Reset spacing to fixed values
          '--space-xs': '4px !important',
          '--space-sm': '8px !important',
          '--space-md': '16px !important',
          '--space-lg': '24px !important',
          '--space-xl': '32px !important',
          '--space-2xl': '48px !important',
          '--space-3xl': '64px !important',
          
          // Force base font size
          fontSize: '16px !important',
          
          // Reset all children
          '& *': {
            // Force all elements to use inherit or their component-specific sizes
            fontSize: 'inherit',
          },
          
          // Force MUI components to use larger sizes on large screens
          '@media (min-width:1920px)': {
            fontSize: '18px !important',
            '& .MuiTypography-h1': { fontSize: '4rem !important' },
            '& .MuiTypography-h2': { fontSize: '3.5rem !important' },
            '& .MuiTypography-h3': { fontSize: '3rem !important' },
            '& .MuiTypography-h4': { fontSize: '2.5rem !important' },
            '& .MuiTypography-h5': { fontSize: '2rem !important' },
            '& .MuiTypography-h6': { fontSize: '1.75rem !important' },
            '& .MuiTypography-subtitle1': { fontSize: '1.25rem !important' },
            '& .MuiTypography-subtitle2': { fontSize: '1.125rem !important' },
            '& .MuiTypography-body1': { fontSize: '1.25rem !important' },
            '& .MuiTypography-body2': { fontSize: '1.125rem !important' },
            '& .MuiTypography-caption': { fontSize: '1rem !important' },
            '& .MuiTypography-overline': { fontSize: '1rem !important' },
            '& .MuiButton-root': { fontSize: '1.125rem !important' },
            '& .MuiInputBase-root': { fontSize: '1.25rem !important' },
            '& .MuiInputLabel-root': { fontSize: '1.125rem !important' },
            '& .MuiMenuItem-root': { fontSize: '1.125rem !important' },
            '& .MuiChip-root': { fontSize: '1rem !important' },
          },
          '@media (min-width:2560px)': {
            fontSize: '20px !important',
            '& .MuiTypography-h1': { fontSize: '4.5rem !important' },
            '& .MuiTypography-h2': { fontSize: '4rem !important' },
            '& .MuiTypography-h3': { fontSize: '3.5rem !important' },
            '& .MuiTypography-h4': { fontSize: '3rem !important' },
            '& .MuiTypography-h5': { fontSize: '2.5rem !important' },
            '& .MuiTypography-h6': { fontSize: '2rem !important' },
            '& .MuiTypography-subtitle1': { fontSize: '1.5rem !important' },
            '& .MuiTypography-subtitle2': { fontSize: '1.25rem !important' },
            '& .MuiTypography-body1': { fontSize: '1.5rem !important' },
            '& .MuiTypography-body2': { fontSize: '1.25rem !important' },
            '& .MuiTypography-caption': { fontSize: '1.125rem !important' },
            '& .MuiTypography-overline': { fontSize: '1.125rem !important' },
            '& .MuiButton-root': { fontSize: '1.25rem !important' },
            '& .MuiInputBase-root': { fontSize: '1.5rem !important' },
            '& .MuiInputLabel-root': { fontSize: '1.25rem !important' },
            '& .MuiMenuItem-root': { fontSize: '1.25rem !important' },
            '& .MuiChip-root': { fontSize: '1.125rem !important', height: '36px !important' },
            '& .MuiTooltip-tooltip': { fontSize: '1.125rem !important' },
          },
        },
        body: {
          scrollbarColor: '#6b6b6b #2b2b2b',
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            backgroundColor: '#2b2b2b',
            width: 12,
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 8,
            backgroundColor: '#6b6b6b',
            minHeight: 24,
            border: '3px solid #2b2b2b',
          },
          '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus': {
            backgroundColor: '#959595',
          },
          '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active': {
            backgroundColor: '#959595',
          },
          '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#959595',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: '8px 16px',
          fontSize: '0.875rem',
        },
        sizeSmall: {
          padding: '4px 10px',
          fontSize: '0.75rem',
        },
        sizeLarge: {
          padding: '12px 28px',
          fontSize: '1rem',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#202328',
            },
            '&:hover fieldset': {
              borderColor: '#2BB4C6',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#2BB4C6',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 8,
        },
        elevation1: {
          boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
        },
        elevation3: {
          boxShadow: '0px 3px 6px rgba(0,0,0,0.3)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: '1px solid #202328',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 16,
          '&:last-child': {
            paddingBottom: 16,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          height: 28,
          fontSize: '0.75rem',
        },
        deleteIcon: {
          fontSize: '1.125rem',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(43, 180, 198, 0.08)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(43, 180, 198, 0.16)',
            '&:hover': {
              backgroundColor: 'rgba(43, 180, 198, 0.24)',
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          border: '1px solid #202328',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
        standardSuccess: {
          backgroundColor: 'rgba(77, 255, 176, 0.1)',
          border: '1px solid rgba(77, 255, 176, 0.3)',
          color: '#4DFFB0',
          '& .MuiAlert-icon': {
            color: '#4DFFB0',
          },
        },
        standardError: {
          backgroundColor: 'rgba(255, 61, 102, 0.1)',
          border: '1px solid rgba(255, 61, 102, 0.3)',
          color: '#FF3D66',
          '& .MuiAlert-icon': {
            color: '#FF3D66',
          },
        },
        standardInfo: {
          backgroundColor: 'rgba(43, 180, 198, 0.1)',
          border: '1px solid rgba(43, 180, 198, 0.3)',
          color: '#2BB4C6',
          '& .MuiAlert-icon': {
            color: '#2BB4C6',
          },
        },
        standardWarning: {
          backgroundColor: 'rgba(255, 167, 38, 0.1)',
          border: '1px solid rgba(255, 167, 38, 0.3)',
          color: '#FFA726',
          '& .MuiAlert-icon': {
            color: '#FFA726',
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#131619',
          color: '#D1D5DC',
          border: '1px solid #2BB4C6',
          borderRadius: 6,
          fontSize: '0.875rem',
          padding: '6px 12px',
        },
        arrow: {
          color: '#131619',
          '&::before': {
            border: '1px solid #2BB4C6',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: 8,
          '&:hover': {
            backgroundColor: 'rgba(43, 180, 198, 0.08)',
          },
        },
        sizeSmall: {
          padding: 4,
        },
        sizeLarge: {
          padding: 12,
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          padding: 8,
          color: '#202328',
          '&.Mui-checked': {
            color: '#2BB4C6',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          padding: '8px 14px',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          '&:hover': {
            backgroundColor: 'rgba(43, 180, 198, 0.08)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(43, 180, 198, 0.16)',
            '&:hover': {
              backgroundColor: 'rgba(43, 180, 198, 0.24)',
            },
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#202328',
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.06)',
        },
      },
    },
    MuiImageList: {
      styleOverrides: {
        root: {
          gap: 16,
        },
      },
    },
    MuiImageListItem: {
      styleOverrides: {
        root: {
          overflow: 'visible',
          '& img': {
            borderRadius: 6,
            border: '1px solid #202328',
          },
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: '#2BB4C6',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: '#202328',
          borderRadius: 4,
        },
        bar: {
          borderRadius: 4,
          backgroundColor: '#2BB4C6',
        },
      },
    },
  },
});

// Apply responsive font sizes
adminTheme = responsiveFontSizes(adminTheme);

export default adminTheme;