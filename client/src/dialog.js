import * as React from 'react';
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
  const [open, setOpen] = React.useState(false);
  const [protocol, setProtocol] = React.useState(protocols[0]);
  const [externalPort, setExternalPort] = React.useState('');
  const [internalPort, setInternalPort] = React.useState('');
  const [client, setClient] = React.useState('');
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
          <Autocomplete
            value={protocol}
            onChange={(event, newValue) => {
                if (newValue in protocols)
                    setProtocol(newValue);
            }}
            id="protocol"
            options={protocols}
            sx={{ mt: 1, border:'none' }}
            fullWidth
            renderInput={(params) => <TextField variant="standard" {...params} label="Protocol" />}
            />
          <TextField
            margin="dense"
            id="host"
            label="Host"
            type="text"
            fullWidth
            variant="standard"
            minLength="7"
            maxLength="15"
            size="15"
            pattern="^((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$"
            value={host}
            helperText="Define the ip address you allow to connect to the specified port. Leave 0.0.0.0 to allow all."
            onChange={evt => setHost(evt.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="client"
            label="Client"
            type="text"
            fullWidth
            variant="standard"
            minLength="7"
            maxLength="15"
            size="15"
            pattern="^((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$"
            value={client}
            helperText="Define the ip of the local machine that will handle the traffic of the specified port"
            onChange={evt => setClient(evt.target.value)}
          />
          <TextField
            margin="dense"
            id="internalPort"
            label="Internal Port"
            type="number"
            fullWidth
            variant="standard"
            helperText="Define the port of the local client that will be exposed to the outside world"
            value={internalPort}
            onChange={evt => setInternalPort(evt.target.value)}
          />
          <TextField
            margin="dense"
            id="externalPort"
            label="External Port"
            type="number"
            fullWidth
            variant="standard"
            value={externalPort}
            helperText="Define the external port that will be used by the outside world to access the internal port of the specified client"
            onChange={evt => setExternalPort(evt.target.value)}
          />
          <TextField
            margin="dense"
            id="description"
            label="Description"
            type="text"
            variant="standard"
            fullWidth
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