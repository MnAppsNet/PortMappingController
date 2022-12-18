import * as React from 'react';
import useStyles from './Styles'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Autocomplete from '@mui/material/Autocomplete';

const protocols = ['TCP', 'UDP'];

export default function AddNewMapping(props) {
  useStyles();
  const [open, setOpen] = React.useState(false);
  const [protocol, setProtocol] = React.useState(protocols[0]);
  const [externalPort, setExternalPort] = React.useState(0);
  const [internalPort, setInternalPort] = React.useState(0);
  const [client, setClient] = React.useState('0.0.0.0');
  const [description, setDescription] = React.useState('');
  const [host, setHost] = React.useState('0.0.0.0');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (submit) => {
    setOpen(false);
    if (!submit) return;

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
                enabled: true,
                description: description
        })}
        ).finally(() => props.refresh())
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        <AddCircleOutlineIcon/> Add new mapping
      </Button>
      <Dialog open={open} onClose={() => {handleClose(false)}}>
        <DialogTitle>Add new mapping</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Expose a new port to the outside world.
            Please be careful as this will expose the port of specified client to everyone
            on the internet.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="client"
            label="client"
            type="text"
            fullWidth
            variant="standard"
            minlength="7"
            maxlength="15"
            size="15"
            pattern="^((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$"
            value={client}
            onChange={evt => setClient(evt.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="host"
            label="host"
            type="text"
            fullWidth
            variant="standard"
            defaultValue="0.0.0.0"
            minlength="7"
            maxlength="15"
            size="15"
            pattern="^((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$"
            value={host}
            onChange={evt => setHost(evt.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="internalPort"
            label="internalPort"
            type="number"
            fullWidth
            variant="standard"
            value={internalPort}
            onChange={evt => setInternalPort(evt.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="externalPort"
            label="externalPort"
            type="number"
            fullWidth
            variant="standard"
            value={externalPort}
            onChange={evt => setExternalPort(evt.target.value)}
          />
          <Autocomplete
            value={protocol}
            onChange={(event, newValue) => {
                if (newValue in protocols)
                    setProtocol(newValue);
            }}
            id="protocol"
            options={protocols}
            fullWidth
            renderInput={(params) => <TextField {...params} label="Protocol" />}
            />
            <TextField
                autoFocus
                margin="dense"
                id="description"
                label="Description"
                type="text"
                fullWidth
                variant="standard"
                value={description}
                onChange={evt => setDescription(evt.target.value)}
            />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {handleClose(false)}}>Cancel</Button>
          <Button onClick={() => {handleClose(true)}}>Add Mapping</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}