import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { fabric } from 'fabric';
import qs from 'qs';
import _ from 'lodash';
import i18n from 'i18next';
import CircularProgress from '@material-ui/core/CircularProgress';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
// import { Slider } from '@material-ui/core';
import Slider from 'react-rangeslider';
import { withStyles } from '@material-ui/core/styles';
import Grow from '@material-ui/core/Grow';
import Popper from '@material-ui/core/Popper';

import Icon from '../icon/Icon';
import SearchPanel from './panels/SearchPanel';
import 'react-rangeslider/lib/index.css';
import {
    DownloadFile,
} from './../../utils/download';

// const PrettoSlider = withStyles({
//   root: {
//     color: '#5d1111',
//     height: 8,
//   },
//   thumb: {
//     height: 24,
//     width: 24,
//     backgroundColor: '#fff',
//     border: '2px solid currentColor',
//     marginTop: -8,
//     marginLeft: -12,
//     '&:focus,&:hover,&$active': {
//       boxShadow: 'inherit',
//     },
//   },
//   active: {},
//   valueLabel: {
//     left: 'calc(-50% + 4px)',
//   },
//   track: {
//     height: 8,
//     borderRadius: 4,
//   },
//   rail: {
//     height: 8,
//     borderRadius: 4,
//   },
// })(Slider);

const dormerPickedBg = 'data:image/png;base64,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';

class DormerPanel extends Component {
    static propTypes = {
        canvasRef: PropTypes.any,
        dormerMode: PropTypes.bool,
        selectedItem: PropTypes.object,
    }

    state = {
        open: false,
        loading: false,
        targetObject: null, // [IMPORTANT] store the selected canvas item in the component state, against loading the image to the other cnavas by clicking
    }

    fetchURL = async (item) => {
        const {
            selectedItem,
        } = this.props;
        let {
            imageEndpoint: {
                url,
            },
        } = this.props;
        let params = _.pick(selectedItem, ['width', 'height', 'left', 'top']);
        // console.log('> ', params.width * selectedItem.scaleX);
        params = {
            ...params,
            width: params.width * selectedItem.scaleX,
            height: params.height * selectedItem.scaleY,
            id: item._id,
        }
        url = `${url}?${qs.stringify(params)}`;       
        try {
            return await DownloadFile(url);
        } catch (err) {
            window.console.error(err);
            const {
                imageEndpoint: {
                    onError,
                },
            } = this.props;
            if (onError) {
                onError(err);
            }
        }
        return null;
    }

    collapseMenu = () => {
        if (this.state.loading) {
            return;
        }
        this.setState(preState => ({
            open: !preState.open,
        }));
    }

    switchDormerImage = (selectedItem, image) => {
        const img = new Image();
        if (image) {
            img.src = image;
        }
        selectedItem.setElement(img, {
            width: selectedItem.width,
            height: selectedItem.height,
        });
        // const width = selectedItem.width * selectedItem.scaleX;
        // const left = selectedItem.left;
        // const top = selectedItem.top;
        // const height = selectedItem.height * selectedItem.scaleY;
        // // context2D.drawImage(img, 0, 0, width, height);
        // context2D.clearRect(width / 2 * -1, height / 2 * -1, width, height); 
        // const fillStyle = context2D.createPattern(img, "no-repeat");
        // context2D.rect(width / 2 * -1, height / 2 * -1, width, height);
        // context2D.fillStyle = fillStyle;
        // context2D.fill();
        // let image = selectedItem.img;
        // if (!image) {
        //     image = new Image();
        // }
        // const dormerImage = new Image();
        // dormerImage.src = image;
        // dormerImage.width = selectedItem.width * selectedItem.scaleX;
        // dormerImage.height = selectedItem.height * selectedItem.scaleY;
        // console.log(selectedItem.width * selectedItem.scaleX, selectedItem.height * selectedItem.scaleY);
        // dormerImage.
        // selectedItem.scaleToWidth(selectedItem.width);
        // selectedItem.scaleToHeight(selectedItem.height);
        // // console.log(selectedItem.width, selectedItem.height, selectedItem.scaleX, selectedItem.scaleY);
        // selectedItem.setSrc(image, this.props.refreshAll);
        
        // selectedItem.setCoords();
    }

    onLoadedSelect = (selected, selectedId, image) => {
        // console.log(this.state.targetObject);
        const selectedItem = this.props.getSelectedDormer(selectedId);
        // console.log('?>.>>>>>>', selectedItem);
        if (!selectedItem) {
            window.console.warn(`${this.state.targetObject} has been removed. No need to show the dormer image.`);
        } else {
            // this.props.activeObject(selectedItem);
            // const {
            //     targetObject: selectedItem,
            // } = this.state;
            // for the async process, the user may be change to select another one layer
            // prevent loading the image to the other selected layer
            const {
                selectedItem: userSelectedItem,
            } = this.props;
            const target = {
                ...selected,
                image,
            };
            // set image element to Image object
            // this.switchDormerImage(selectedItem);
            selectedItem.set({
                // push to local cache
                dormerCached: {
                    ...selectedItem.dormerCached,
                    [target._id]: target,
                },
                dormerId: target._id,
                dormerName: target.name,
                dormerImage: image,
                // clipTo: ctx => this.switchDormerImage(selectedItem, ctx, image),
                // clipTo: ctx => this.switchDormerImage(selectedItem, ctx, image),
                // {
                //     const width = selectedItem.width + 10;
                //     const height = selectedItem.height + 10;
                //     const rect = new fabric.Rect({
                //         left: 0,
                //         top: 0,
                //         rx: 10 / selectedItem.scaleX,
                //         ry: 10 / selectedItem.scaleY,
                //         width,
                //         height,
                //     });
                //     rect._render(ctx, false);
                // },
            });
            // render Fabric again
            if (userSelectedItem && userSelectedItem.id === selectedItem.id) {
                this.props.onUpdateSelectedItem(selectedItem);
            } else {
                this.props.refreshAll();
            }
        }
        this.setState({
            loading: false,
            targetObject: undefined,
        });
    }

    lockModeItem = status => {
        const {
            selectedItem,
        } = this.props;
        let properties = [
            'lockMovementX',
            'lockMovementY',
            'lockScalingX',
            'lockScalingY',
            'lockUniScaling',
            'lockRotation',
        ];
        properties = _.reduce(properties, (accum, p) => ({
            ...accum,
            [p]: status,
        }), {});
        properties = {
            ...properties,
            hasControls: !status,
        };
        selectedItem.set(properties);
        selectedItem.setCoords();
        // console.log(selectedItem, properties);
        // if (userSelectedItem.id === selectedItem.id) {
        this.props.onUpdateSelectedItem(selectedItem);
        // } else {
        //     // directly render canvas
        //     this.props.refreshAll();
        // }
    }

    clearDormerCached = () => {
        const {
            // dormerCached,
            selectedItem,
            descriptor=[],
        } = this.props;
        selectedItem.set({
            dormerId: undefined,
            dormerName: undefined,
            dormerCached: undefined,
            dormerImage: undefined,
            dormerOpacity: 1,
            opacity: 1,
            // clipTo: ctx => this.switchDormerImage(selectedItem, ctx, descriptor[0] && descriptor[0].option.src),
        });
        // console.log(descriptor[0] && descriptor[0].option.src);
        this.switchDormerImage(selectedItem, descriptor[0] && descriptor[0].option.src);
        this.props.onUpdateSelectedItem(selectedItem);
        this.lockModeItem(false);
    }
    // async process not target to the selectedItem directly
    onSelect = async(item) => {
        // const selectedItem = this.props.getSelectedDormer(this.props.selectedItem);
        // // console.log(selectedItem);
        // // return;
        // if (!selectedItem) {
        //     window.console.warn('No any item cannot be selected.');
        //     return;
        // }
        const {
            descriptor=[],
            selectedItem,
        } = this.props;
        this.setState({
            targetObject: selectedItem.id,
        });
        const {
            dormerCached={},
        } = selectedItem;
        let target = item;
        // this.props.onSelect(target);
        // pick it from the local cached directly
        if (dormerCached[target._id] && dormerCached[target._id].image) {
            return this.onLoadedSelect(target, selectedItem.id,dormerCached[target._id].image);
        }
        // hide the target menu
        this.collapseMenu();
        // lock the dormer region
        this.lockModeItem(true);
        // loading the process
        this.setState({
            loading: true,
        });

        // clear the image set before
        this.switchDormerImage(selectedItem, descriptor[0] && descriptor[0].option.src);
        // mark the current selected id
        selectedItem.set({
            dormerId: item._id,
            dormerName: item.name,
            // clipTo: ctx => this.switchDormerImage(selectedItem, ctx, descriptor[0] && descriptor[0].option.src),
        });
        // if (userSelectedItem.id === selectedItem.id) {
        this.props.onUpdateSelectedItem(selectedItem);
        // }

        // start download the dormer image
        const dormer = await this.fetchURL(item);
        if (dormer) {
            return this.onLoadedSelect(item, selectedItem.id, dormer);
        } else {
            this.lockModeItem(false);
        }
    }

    renderMenu = () => {
        const {
            selectedItem,
        } = this.props;
        return (
            <div
                className="rde-editor-dormer-container-menu"
                style={{
                    display: this.state.open && !this.state.loading ? 'block' : 'none',
                }}
            >
                <SearchPanel 
                    title={i18n.t('title.dormer')}
                    endpoint={this.props.endpoint}
                    selected={selectedItem && selectedItem.dormerId}
                    listMode
                    onSelect={this.onSelect}
                    checkmarks={selectedItem && selectedItem.dormerCached || {}}
                    mapCheckmark
                    onClose={this.collapseMenu}
                    fullset // return full set of selected items
                />
            </div>
        );
    }

    changeOpacity = value => {
        const {
            selectedItem,
        } = this.props;
        const opacity = value / 100;
        selectedItem.set({
            dormerOpacity: opacity,
            opacity,
        });

        this.props.onUpdateSelectedItem(selectedItem);
    }

    sliderValue = value => `${value}%`;

    renderHeader = () => {
        const {
            selectedItem,
        } = this.props;
        return (
            <>
                {
                    selectedItem && !!selectedItem.dormerCached && <div 
                    className="rde-editor-dormer-wrapper-slider"
                >   
                    <Slider
                        step={10}
                        min={40}
                        max={100}
                        value={!isNaN(selectedItem.dormerOpacity) ? selectedItem.dormerOpacity * 100 : 100}
                        onChange={this.changeOpacity}
                    />
                        {
                            /*<PrettoSlider
                                defaultValue={!isNaN(selectedItem.dormerOpacity) ? selectedItem.dormerOpacity * 100 : 100}
                                getAriaValueText={this.sliderValue}
                                aria-labelledby="discrete-slider"
                                valueLabelDisplay="auto"
                                step={10}
                                onChange={this.changeOpacity}
                                marks
                                min={40}
                                max={100}
                            />*/
                        }
                    </div>
                }
                <div className="rde-editor-dormer-wrapper-header">
                    {
                        selectedItem && !!selectedItem.dormerName && <div className="rde-editor-dormer-wrapper-header-label">
                            {selectedItem.dormerName}
                        </div>
                    }
                    {
                        selectedItem && !!selectedItem.dormerCached && 
                            <div 
                                onClick={this.clearDormerCached} 
                                className="rde-editor-dormer-wrapper-header-remove"
                            >
                                <Icon
                                    name='unlock'
                                    prefix='fas'
                                /> 
                            </div>
                    }
                    <div className="rde-editor-dormer-wrapper-header-icon" onClick={this.collapseMenu}>
                        <Icon
                            name={this.state.open ? 'minus' : 'book-open'}
                            prefix='fas'
                        /> 
                    </div>
                </div>
            </>
        );
    }

    render() {
        const {
            selectedItem,
            dormerMode,
        } = this.props;

        const {
            loading,
            targetObject,
        } = this.state;

        let containerStyle = {
            display: dormerMode ? 'block' : 'none',
        };
        let dormerImage = null;
        let watitingOtherComparison = false;
        let opacity = 1;
        if (selectedItem) {
            containerStyle = {
                ...containerStyle,
                left: selectedItem.left,
                top: selectedItem.top,
                width: selectedItem.width * selectedItem.scaleX,
                height: selectedItem.height * selectedItem.scaleY,
            };
            dormerImage = selectedItem.dormerImage;
            watitingOtherComparison = targetObject && targetObject !== selectedItem.id;
            opacity = !isNaN(selectedItem.dormerOpacity) ? selectedItem.dormerOpacity : 1;
            // console.log(selectedItem);
        }
        return (
            <div
                className="rde-editor-dormer-container"
                style={containerStyle}
            >
                <div className="rde-editor-dormer-wrapper">
                    {
                        !loading ? this.renderHeader() :
                        <div className="rde-editor-dormer-wrapper-loading">
                            <CircularProgress size={25} /> 
                            <div className="rde-editor-dormer-wrapper-loading-label">
                                {   
                                    watitingOtherComparison ? 
                                    i18n.t('message.waitOtherCuttingDormer') : 
                                    i18n.t('message.cuttingDormer')
                                }
                            </div>
                        </div>
                    }
                    {
                        dormerImage && <img src={dormerImage} style={{
                            opacity,
                        }} />
                    }
                </div>
                {
                    this.renderMenu()
                }
            </div>
        );
    }
}

export default DormerPanel;
