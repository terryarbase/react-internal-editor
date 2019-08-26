import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import i18n from 'i18next';

import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Divider from '@material-ui/core/Divider';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import { blue } from '@material-ui/core/colors';


import AddIcon from '@material-ui/icons/Add';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';

const SavePanelStyles = () => ({
    container: {
        padding: '20px',
    },
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
});

class SavePanel extends Component {
    static propTypes = {
        // canvasRef: PropTypes.any,
        onSave: PropTypes.func,
        onSavevImage: PropTypes.func,
        onOpenSavePanel: PropTypes.func,
        getSavableObject: PropTypes.func,
        source: PropTypes.object,
    }

    state = {
        value: null,
        // open: false,
    }

    onClose = () => {
        this.props.onOpenSavePanel();
        this.onChangeVersionName({
            target: {
                value: null,
            },
        });
    }

    onSaveAs = () => {
        let {
            value: name,
        } = this.state;
        const {
            source,
        } = this.props;
        if (!name) {
            name = source.name;
        }
        const dataSource = this.props.getSavableObject();
        this.props.onSave('saveAs', {
            ...source,
            dataSource,
            name,
        }, this.onClose);
        // this.onClose();
    }

    onSave = () => {
        const {
            source,
        } = this.props;
        const dataSource = this.props.getSavableObject();
        this.props.onSave('save', {
            ...source,
            dataSource,
            name,
        }, this.onClose);
        // this.onClose();
    }

    onSaveImage = () => {
        this.props.onSaveImage();
    }

    onChangeVersionName = ({ target: { value } }) => {
        this.setState({
            value,
        });
    }

    render() {
        const {
            classes,
        } = this.props;
        return (
            <Dialog
                onClose={this.onClose}
                maxWidth={'xl'}
                aria-labelledby="simple-dialog-title"
                open={this.props.open}
            >
                <DialogTitle>
                    {i18n.t('title.saveMode')}
                </DialogTitle>
                <div className={classes.container}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        onChange={this.onChangeVersionName}
                        label={i18n.t('title.newVersionName')}
                        type="text"
                        fullWidth
                    />
                </div>
                <List>
                    <ListItem
                        disabled={!this.state.value}
                        button
                        onClick={this.onSaveAs}
                    >
                        <ListItemAvatar>
                            <Avatar className={classes.avatar}>
                                <AddIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={i18n.t('title.saveAs')} />
                    </ListItem>
                    <Divider />
                    <ListItem button onClick={this.onSave}>
                        <ListItemAvatar>
                            <Avatar className={classes.avatar}>
                                <InsertDriveFileIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={i18n.t('title.saveVersion')} />
                    </ListItem>
                    {
                        /*
                        <ListItem button onClick={this.onSaveImage}>
                            <ListItemAvatar>
                                <Avatar className={classes.avatar}>
                                    <SaveAltIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={i18n.t('title.downloadImage')} />
                        </ListItem>
                        */
                    }
                </List>
            </Dialog>
        );
    }
}

export default withStyles(SavePanelStyles)(SavePanel);
