import * as React from 'react';
import {useState, useEffect} from 'react'
import { Paper, Typography, Box } from '@material-ui/core';
import useStyles from './Styles'
import Item from './item'
import AddNewMapping from './dialog'
import logo from './logo.png';

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
        <Box id="root" className={classes.root}>
            <Paper id="root_panel" elevation={3}>
                <Box id="panel" className={classes.controlPanel}>
                    <img id="logo" src={logo} alt="PortMappingController" width="80px" height="80px" />
                    <Typography id="title" variant="h5" className={classes.title}>Port Mappings</Typography>
                    {ports.map(port => {
                        id++;
                        return (
                            <Box key={"item_panel"+id.toString()} className={classes.items}>
                                <Item id={id.toString()} key={id.toString()}
                                    protocol={port.protocol}
                                    host={port.host}
                                    from={port.from}
                                    to={port.to}
                                    client={port.client}
                                    description={port.description}
                                    enabled={port.enabled}
                                    refresh={getPortMappings}/>
                                <hr className={classes.divider}></hr>
                            </Box>
                        );
                    })}
                    <AddNewMapping id="newMappingButton" refresh={getPortMappings}/>
                </Box>
            </Paper>
        </Box>
    );
}

export default ControlPanel;