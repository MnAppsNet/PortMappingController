import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '& > *': {
            margin: theme.spacing(1),
            width: '80vw',
            height: '90vh',
        },
    },
    title: {
        margin: theme.spacing(2, 0, 2, 0),
        color: 'black',
        fontWeight: 'bold'
    },
    controlPanel: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: "80vw",
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    items: {
        display: 'block',
        width: '90%'
    },
    controlGroup: {
        display: 'block',
        alignItems: 'center',
        width: '100%',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    toggle: {
        display: 'inline-block',
        float: 'left',
        marginLeft: '5px',
        width:'fit-content',
    },
    button: {
        display: 'inline-block',
        float: 'right',
        width:'fit-content',
        marginRight: '50px'
    },
    checkbox: {
        color: 'blue',
    },
    label: {
        fontWeight: 'bold'
    },
    description: {
        margin: theme.spacing(1, 0, 1, 0),
    },
    deleteButton: {
        color: 'red',
    },
    divider:{
        borderTop: '3px solid #bbb',
        width:'100%'
    }
}));

export default useStyles;