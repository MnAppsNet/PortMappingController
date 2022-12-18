import React from 'react';
import {useState, useEffect} from 'react'
import { Paper, Typography } from '@material-ui/core';
import CssBaseline from '@mui/material/CssBaseline';
import useStyles from './Styles'
import Item from './item'
import AddNewMapping from './dialog'

function ControlPanel(props) {
    const classes = useStyles();
    const [ports, setPorts] = useState([]);
    let id = 0;

    const getPortMappings = () =>{
        fetch("/getPorts").then((response) => {
            response.json().then(
                data => {
                    if (data == null) data = []
                    setPorts(data)} )
        });
    }

    useEffect(() => {
        getPortMappings();
      }, []);

    return (
        <div className={classes.root}>
            <CssBaseline />
            <Paper elevation={3}>
                <div className={classes.controlPanel}>
                    <Typography variant="h4" className={classes.title}>Port Mappings</Typography>
                    {ports.map(port => {
                        id++;
                        return (
                            <div className={classes.items}>
                                <Item id={id.toString()}
                                    protocol={port.protocol}
                                    host={port.host}
                                    from={port.from}
                                    to={port.to}
                                    client={port.client}
                                    description={port.description}
                                    enabled={port.enabled}
                                    refresh={getPortMappings}/>
                                <hr className={classes.divider}></hr>
                            </div>
                        );
                    })}
                    <AddNewMapping refresh={getPortMappings}/>
                </div>
            </Paper>
        </div>
    );
}

export default ControlPanel;