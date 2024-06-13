import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { CameraAlt, NoPhotography } from '@mui/icons-material';

function CameraAlertDialog(props) {
    const { title, contentText, label1, label2, setAllow, setDeny} = props;
    const [open, setOpen] = React.useState(true);
    const [cameraIcon, setCameraIcon] = React.useState(<NoPhotography/>)

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleDeny = () => {
        setOpen(false);
        props.setDeny();
        setCameraIcon(<NoPhotography/>);
    }

    const handleAllow = () => {
        setOpen(false);
        props.setAllow();
        setCameraIcon(<CameraAlt/>);
    }
  
    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOpen}>
                Camera Permissions &ensp;{cameraIcon}
            </Button>
            <Dialog
                open={open}
                onClose={props.handleDeny}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
            <DialogTitle id="alert-dialog-title">
                {props.title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {props.contentText}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDeny}>{props.label1}</Button>
                <Button onClick={handleAllow} autoFocus>{props.label2}</Button>
            </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

function RedirectAlertDialog(props) {
    const { title, contentText, label1, label2, setAllow, setDeny } = props;
    const [open, setOpen] = React.useState(true);

    const handleDeny = () => {
        setOpen(false);
        props.setDeny();
    }

    const handleAllow = () => {
        setOpen(false);
        props.setAllow();
    }
  
    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={props.handleDeny}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
            <DialogTitle id="alert-dialog-title">
                {props.title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {props.contentText}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDeny}>{props.label1}</Button>
                <Button onClick={handleAllow} autoFocus>{props.label2}</Button>
            </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export { CameraAlertDialog, RedirectAlertDialog };