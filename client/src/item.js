import useStyles from './Styles'
import DeleteIcon from '@mui/icons-material/Delete';
import { FormControlLabel, Checkbox, Typography, IconButton } from '@material-ui/core';

function Item(props){
    const classes = useStyles();
    const internalPort = props.to;
    const externalPort = props.from;
    const protocol = props.protocol;
    const host = props.host;
    const client = props.client;
    const enabled = props.enabled;
    const description = props.description;
    const text = `${protocol} - ${host}:${externalPort} 🡒 ${client}:${internalPort}`;

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
        <div className={classes.controlGroup}>
            <div className={classes.toggle}>
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
            </div>
            <div className={classes.button}>
                <IconButton
                    onClick={deleteMapping}
                    aria-label="delete"
                    className={classes.deleteButton}>
                    <DeleteIcon />
                </IconButton>
            </div>
        </div>
    )
}

export default Item;