import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '& > *': {
            margin: "1px",
            width: '80vw',
            height: '90vh',
        },
    },
    title: {
        color: 'black',
        fontWeight: 'bold'
    },
    controlPanel: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: "80vw",
        '& > *': {
            margin: "1px",
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
            margin: "1px",
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
        margin: "1px",
    },
    deleteButton: {
        color: '#FF0000',
    },
    divider:{
        borderTop: '3px solid #bbb',
        width:'100%'
    }
});

export default useStyles;