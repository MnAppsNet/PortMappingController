import DeleteIcon from '@mui/icons-material/Delete';
import {useState, useEffect} from 'react'
import { FormControlLabel, Checkbox, Typography, IconButton, Box } from '@material-ui/core';
import { DDNS } from './config'
import useStyles from './Styles'

function Item(props){
    const classes = useStyles();

    const [publicIP,setPublicIP] = useState(null);

    useEffect(() => {
        if (DDNS != null){
            setPublicIP(DDNS);
            return;
        }
        try{
            fetch("https://api64.ipify.org/?format=text").then(response => response.text().then(ip => setPublicIP(ip)))
        }catch(e){}
      }, []);

    const internalPort = props.to;
    const externalPort = props.from;
    const protocol = props.protocol;
    const host = props.host;
    const client = props.client;
    const enabled = props.enabled;
    const description = props.description;
    const text = `(${protocol}): ${host} 🡒 ${(publicIP == null)?externalPort:publicIP+":"+externalPort} 🡒 ${client}:${internalPort}`;

    const deleteMapping = (e) => {
        fetch("/removePort",
        {method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                host: host,
                client: client,
                externalPort: externalPort,
                protocol: protocol
        })}
        ).finally(() => props.refresh())
    }

    const changeState = (e) => {
        fetch("/addPort",
        {method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                host: host,
                client: client,
                internalPort: internalPort,
                externalPort: externalPort,
                protocol: protocol,
                enabled: !enabled,
                description: description
        })}
        ).finally(() => props.refresh())
    }

    return (
        <Box className={classes.controlGroup}>
            <Box className={classes.toggle}>
                <Typography className={classes.description}>{description}</Typography>
                <FormControlLabel
                    control={
                        <Checkbox
                            id={props.id}
                            name={props.id}
                            onChange={changeState}
                            checked={props.enabled} />
                    }
                    label={text}/>
            </Box>
            <Box className={classes.button}>
                <IconButton
                    onClick={deleteMapping}
                    aria-label="delete"
                    className={classes.deleteButton}>
                    <DeleteIcon />
                </IconButton>
            </Box>
        </Box>
    )
}

export default Item;