import React, { Component } from 'react';
import { ResizeSensor } from 'css-element-queries';
import { Badge, Button, Spin, Popconfirm, Menu, Modal } from 'antd';
// import ab2str from 'arraybuffer-to-string';
import debounce from 'lodash/debounce';
import i18n from 'i18next';
import storage from 'store/storages/localStorage';

import Icon from '../icon/Icon';
import Descriptors from './Descriptors';
import Wireframe from '../wireframe/Wireframe';
import Canvas from '../canvas/Canvas';
import ImageMapFooterToolbar from './ImageMapFooterToolbar';
import ImageMapItems from './ImageMapItems';
import ImageMapTitle from './ImageMapTitle';
import ImageMapHeaderToolbar from './ImageMapHeaderToolbar';
import ImageMapPreview from './ImageMapPreview';
import ImageMapConfigurations from './ImageMapConfigurations';
import SandBox from '../sandbox/SandBox';
import DormerPanel from './DormerPanel';
import SearchPanel from './panels/SearchPanel';

import '../../libs/fontawesome-5.2.0/css/all.css';
import '../../styles/index.less';
import Container from '../common/Container';
import CommonButton from '../common/CommonButton';

const propertiesToInclude = [
    'id',
    'name',
    'lock',
    'file',
    'title',
    'description',
    'shortcut',
    'src',
    'link',
    // 'tooltip',
    // 'animation',
    'layout',
    'workareaWidth',
    'workareaHeight',
    'videoLoadType',
    'autoplay',
    'shadow',
    'muted',
    'loop',
    // 'code',
    'icon',
    // 'userProperty',
    // 'trigger',
    'configuration',
    'superType',
    'points',
    // assignment enhancements
    'isAssignment',
    'groupAssignment',
    'individualAssignment',
];

const defaultOptions = {
    fill: 'rgba(0, 0, 0, 1)',
    stroke: 'rgba(255, 255, 255, 0)',
    resource: {},
    link: {
        enabled: false,
        type: 'resource',
        state: 'new',
        dashboard: {},
    },
    tooltip: {
        enabled: true,
        type: 'resource',
        template: '<div>{{message.name}}</div>',
    },
    animation: {
        type: 'none',
        loop: true,
        autoplay: true,
        delay: 100,
        duration: 1000,
    },
    userProperty: {},
    trigger: {
        enabled: false,
        type: 'alarm',
        script: 'return message.value > 0;',
        effect: 'style',
    },
};

class ImageMapEditor extends Component {
    constructor(props) {
        super(props);
        this.getWorkarea = this.getWorkarea.bind(this);
        const workarea = this.getWorkarea(props);
        this.state = {
            dormerCached: {}, // local cache for the base64 dormer image with id
            selectedItem: null,
            zoomRatio: 1,
            canvasRect: {
                width: 600,
                height: 150,
            },
            preview: false,
            loading: false,
            propertyCollapse: false,
            progress: 0,
            animations: [],
            objects: [],
            styles: [],
            dataSources: [],
            workarea,
            editing: false,
            descriptors: Descriptors,
            dataObjects: {},    // store each of page object, for page change
        }
    }

    // componentWillReceiveProps({ percentage }) {
    //     if (this.props.percentage !== percentage) {
    //         console.log(this.state.canvasRect.width,
    //             this.state.canvasRect.height,
    //             this.state.canvasRect.width * percentage,
    //             this.state.canvasRect.height * percentage,);
    //         this.canvasRef.eventHandlers.resize(
    //             this.state.canvasRect.width,
    //             this.state.canvasRect.height,
    //             this.state.canvasRect.width * percentage,
    //             this.state.canvasRect.height * percentage,
    //         );
    //     }
    // }
    // componentWillMount() {
    //     if (this.props.zoomMinimize) {
    //         this.canvasRef.zoomHandlers.zoomMinimize();
    //     }
    // }

    componentDidMount() {
        // this.showLoading(true);
        const { pdfCanvasOption } = this.props;
        
        // const { zoomRatio } = this.state;
        this.resizeSensor = new ResizeSensor(this.container, () => {
            const { canvasRect: currentCanvasRect } = this.state;
            const canvasRect = Object.assign({}, currentCanvasRect, pdfCanvasOption);
            this.setState({
                canvasRect,
            });
        });
        const { config={} } = this.props;
        // import('./Descriptors.json').then((descriptors) => {
        //     this.setState({
        //         descriptors,
        //     }, () => {
        //         this.showLoading(false);
        //         // this.handlers.initialObjectFromConfig(config, this.props.currentPage);
        //     });
        // });
        // console.log(config);
        this.setState({
            canvasRect: {
                ...pdfCanvasOption,
            },
            selectedItem: null,
            dataObjects: config,
        }, () => this.handlers.initialObjectFromConfig(config, this.props.currentPage));
    }


    canvasHandlers = {
        // switchUserAssignmentMode: () => {
        //     this.setState(prevState => ({
        //         userAssignmentMode: !prevState.userAssignmentMode,
        //     }));
        // },
        // switchGroupAssignmentMode: () => {
        //     this.setState(prevState => ({
        //         groupAssignmentMode: !prevState.groupAssignmentMode,
        //     }));
        // },
        refreshAll: () => {
            this.canvasRef.handlers.renderAll();
        },
        activeObject: obj => {
            this.canvasRef.handlers.select(obj);
        },
        onAdd: (target) => {
            if (!this.state.editing) {
                this.changeEditing(true);
            }
            if (target.type === 'activeSelection') {
                this.canvasHandlers.onSelect(null);
                return;
            }
            this.canvasRef.handlers.select(target);
            this.props.onAdd();
        },
        onSelect: (target) => {
            const selectedItems = this.canvasRef.handlers.getSelectedObjects() || [];
            const isMultiSelected = selectedItems.length > 1;
            if (target
            && target.id
            && target.id !== 'workarea'
            && target.type !== 'activeSelection') {

                if (this.state.selectedItem && target.id === this.state.selectedItem.id) {
                    return;
                }
                this.canvasRef.handlers.getObjects().forEach((obj) => {
                    if (obj) {
                        this.canvasRef.animationHandlers.initAnimation(obj, true);
                    }
                });

                this.setState({
                    selectedItem: target,
                    dormerMode: selectedItems.length === 1 && target.dormerMode,
                    areaMode: selectedItems.length === 1 && target.areaMode,
                    isMultiSelected,
                });
                // if (target.dormerMode) {
                //     setTimeout(() => {
                //         this.canvasRef.zoomHandlers.zoomToDefault();
                //     });
                // }
                return;
            } else if (target && !target.id && target.type === 'activeSelection') {
                this.canvasRef.handlers.getObjects().forEach((obj) => {
                    if (obj) {
                        this.canvasRef.animationHandlers.initAnimation(obj, true);
                    }
                });
                this.setState({
                    selectedItem: target,
                    dormerMode: selectedItems.length === 1 && target.dormerMode,
                    isMultiSelected,
                });
                // if (target.dormerMode) {
                //     this.canvasRef.zoomHandlers.zoomToDefault();
                // }
                return;
            }
            this.canvasRef.handlers.getObjects().forEach((obj) => {
                if (obj) {
                    this.canvasRef.animationHandlers.initAnimation(obj, true);
                }
            });
            this.setState({
                selectedItem: null,
                dormerMode: false,
                propertyCollapse: false,
                propertyKey: 'layer',
                isMultiSelected,
            });
        },
        onRemove: (target) => {
            if (!this.state.editing) {
                this.changeEditing(true);
            }
            this.canvasHandlers.onSelect(null);
        },
        onModified: debounce((target) => {
            if (!this.state.editing) {
                this.changeEditing(true);
            }
            if (target
            && target.id
            && target.id !== 'workarea'
            && target.type !== 'activeSelection') {
                this.setState({
                    selectedItem: target,
                });
                return;
            }
            this.setState({
                selectedItem: null,
            });
        }, 300),
        onZoom: (zoomRatio) => {
            const {
                workarea: {
                    height: oldHieght,
                    width: oldWidth,
                },
            } = this.state;
            // console.log(zoom);
            this.setState({
                zoomRatio,
            }, () => {
                // console.log(zoom, (oldWidth * zoom), oldWidth);
                // // this.canvasRef.handlers.scaleToResizes(
                // //     this.state.workarea.width, 
                // //     this.state.workarea.height, 
                // //     this.canvasRef.handlers.getObjects(),
                // // );
                // this.canvasRef.handlers.getObjects().forEach(obj => {
                //     this.canvasRef.handlers.setProperties(obj, {
                //         left: (obj.left * (oldWidth * zoom)) / oldWidth,
                //         top: (obj.top * (oldHieght * zoom)) / oldHieght,
                //     }); 
                //     // console.log(obj);
                // });
                // this.canvasRef.requestRenderAll();
                if (this.props.onZoom) {
                    this.props.onZoom({
                        zoomRatio,
                        ...this.canvasRef.handlers.getCanvasInfo(),
                    });
                }
            });
        },
        onChange: (selectedItem, changedValues, allValues) => {
            // console.log('>>>>>>>>>>>>>> ', changedValues, allValues);
            if (!this.state.editing) {
                this.changeEditing(true);
            }
            const changedKey = Object.keys(changedValues)[0];
            const changedValue = changedValues[changedKey];
            if (allValues.workarea) {
                this.canvasHandlers.onChangeWokarea(changedKey, changedValue, allValues.workarea);
                return;
            }
            if (changedKey === 'width' || changedKey === 'height') {
                this.canvasRef.handlers.scaleToResize(allValues.width, allValues.height);
                return;
            }
            if (changedKey === 'lock') {
                this.canvasRef.handlers.setObject({
                    lockMovementX: changedValue,
                    lockMovementY: changedValue,
                    hasControls: !changedValue,
                    hoverCursor: changedValue ? 'pointer' : 'move',
                    editable: !changedValue,
                    lock: changedValue,
                });
                return;
            }
            if (changedKey === 'file' || changedKey === 'src' || changedKey === 'code') {
                if (selectedItem.type === 'image') {
                    this.canvasRef.handlers.setImageById(selectedItem.id, changedValue);
                } else if (this.canvasRef.handlers.isElementType(selectedItem.type)) {
                    this.canvasRef.elementHandlers.setById(selectedItem.id, changedValue);
                }
                return;
            }
            if (changedKey === 'link') {
                const link = Object.assign({}, defaultOptions.link, allValues.link);
                this.canvasRef.handlers.set(changedKey, link);
                return;
            }
            if (changedKey === 'tooltip') {
                const tooltip = Object.assign({}, defaultOptions.tooltip, allValues.tooltip);
                this.canvasRef.handlers.set(changedKey, tooltip);
                return;
            }
            if (changedKey === 'animation') {
                const animation = Object.assign({}, defaultOptions.animation, allValues.animation);
                this.canvasRef.handlers.set(changedKey, animation);
                return;
            }
            if (changedKey === 'icon') {
                const { unicode, styles } = changedValue[Object.keys(changedValue)[0]];
                const uni = parseInt(unicode, 16);
                if (styles[0] === 'brands') {
                    this.canvasRef.handlers.set('fontFamily', 'Font Awesome 5 Brands');
                } else if (styles[0] === 'regular') {
                    this.canvasRef.handlers.set('fontFamily', 'Font Awesome 5 Regular');
                } else {
                    this.canvasRef.handlers.set('fontFamily', 'Font Awesome 5 Free');
                }
                this.canvasRef.handlers.set('text', String.fromCodePoint(uni));
                this.canvasRef.handlers.set('icon', changedValue);
                return;
            }
            if (changedKey === 'shadow') {
                if (allValues.shadow.enabled) {
                    this.canvasRef.handlers.setShadow(changedKey, allValues.shadow);
                } else {
                    this.canvasRef.handlers.setShadow(changedKey, null);
                }
                return;
            }
            if (changedKey === 'fontWeight') {
                this.canvasRef.handlers.set(changedKey, changedValue ? 'bold' : 'normal');
                return;
            }
            if (changedKey === 'fontStyle') {
                this.canvasRef.handlers.set(changedKey, changedValue ? 'italic' : 'normal');
                return;
            }
            if (changedKey === 'textAlign') {
                this.canvasRef.handlers.set(changedKey, Object.keys(changedValue)[0]);
                return;
            }
            if (changedKey === 'trigger') {
                const trigger = Object.assign({}, defaultOptions.trigger, allValues.trigger);
                this.canvasRef.handlers.set(changedKey, trigger);
                return;
            }
            if (_.includes(['title', 'description'], changedKey)) {
                const {
                    option:{
                        code,
                    },
                } = this.state.descriptors.LINKAREA[0];
                selectedItem[changedKey] = changedValue;
                const info = this.canvasRef.dormerHandlers.getAreaInfo(selectedItem, code);
                this.canvasRef.elementHandlers.setById(selectedItem.id, info.code);
                return;
            }
            this.canvasRef.handlers.set(changedKey, changedValue);
        },
        onChangeWokarea: (changedKey, changedValue, allValues) => {
            if (changedKey === 'layout') {
                this.canvasRef.workareaHandlers.setLayout(changedValue);
                return;
            }
            if (changedKey === 'file' || changedKey === 'src') {
                this.canvasRef.workareaHandlers.setImage(changedValue);
                return;
            }
            if (changedKey === 'width' || changedKey === 'height') {
                this.canvasRef.handlers.originScaleToResize(this.canvasRef.workarea, allValues.width, allValues.height);
                this.canvasRef.canvas.centerObject(this.canvasRef.workarea);
                return;
            }
            this.canvasRef.workarea.set(changedKey, changedValue);
            this.canvasRef.canvas.requestRenderAll();
        },
        onTooltip: (ref, target) => {
            const value = (Math.random() * 10) + 1;
            const { animations, styles } = this.state;
            // const { code } = target.trigger;
            // const compile = SandBox.compile(code);
            // const result = compile(value, animations, styles, target.userProperty);
            // console.log(result);
            return (
                <div>
                    <div>
                        <div>
                            <Button>
                                {target.id}
                            </Button>
                        </div>
                        <Badge count={value} />
                    </div>
                </div>
            );
        },
        onLink: (canvas, target) => {
            const { link } = target;
            if (link.state === 'current') {
                document.location.href = link.url;
                return;
            }
            window.open(link.url);
        },
        onContext: (ref, event, target) => {
            const { selectedItem, isMultiSelected } = this.state;
            if (selectedItem && selectedItem.ignored) {
                return null;
            }
            const groupDom = (
                <Menu.Item onClick={() => { this.handlers.switchProperties('group'); }}>
                    {i18n.t('action.assign-grouptask')}
                </Menu.Item>
            );
            const userDom = (
                <Menu.Item onClick={() => { this.handlers.switchProperties('user'); }}>
                    {i18n.t('action.assign-individual')}
                </Menu.Item>
            );
            if ((target && target.id === 'workarea') || !target) {
                const { layerX: left, layerY: top } = event;
                return (
                    <Menu>
                        <Menu.SubMenu key="add" style={{ width: 120 }} title={i18n.t('action.add')}>
                            {
                                this.transformList().map((item) => {
                                    const option = Object.assign({}, item.option, { left, top });
                                    const newItem = Object.assign({}, item, { option });
                                    return (
                                        <Menu.Item style={{ padding: 0 }} key={item.name}>
                                            {this.itemsRef.renderItem(newItem, false)}
                                        </Menu.Item>
                                    );
                                })
                            }
                        </Menu.SubMenu>
                    </Menu>
                );
            }
            if (target.type === 'activeSelection') {
                return (
                    <Menu>
                        {
                            !isMultiSelected && groupDom
                        }
                        {
                            !isMultiSelected  && userDom
                        }
                        {
                            !isMultiSelected  && <Menu.Divider />
                        }
                        <Menu.Item onClick={() => { this.canvasRef.handlers.toGroup(); }}>
                            {i18n.t('action.object-group')}
                        </Menu.Item>
                        <Menu.Item onClick={() => { this.canvasRef.handlers.duplicate(); }}>
                            {i18n.t('action.clone')}
                        </Menu.Item>
                        <Menu.Item onClick={() => { this.canvasRef.handlers.remove(); }}>
                            {i18n.t('action.delete')}
                        </Menu.Item>
                    </Menu>
                );
            }
            if (target.type === 'group') {
                return (
                    <Menu>
                        {
                            !isMultiSelected && groupDom
                        }
                        {
                            !isMultiSelected  && userDom
                        }
                        {
                            !isMultiSelected  && <Menu.Divider />
                        }
                        <Menu.Item onClick={() => { this.canvasRef.handlers.toActiveSelection(); }}>
                            {i18n.t('action.object-ungroup')}
                        </Menu.Item>
                        <Menu.Item onClick={() => { this.canvasRef.handlers.duplicate(); }}>
                            {i18n.t('action.clone')}
                        </Menu.Item>
                        <Menu.Item onClick={() => { this.canvasRef.handlers.remove(); }}>
                            {i18n.t('action.delete')}
                        </Menu.Item>
                    </Menu>
                );
            }
            return (
                <Menu>
                    {
                        !isMultiSelected && groupDom
                    }
                    {
                        !isMultiSelected  && userDom
                    }
                    {
                        !isMultiSelected  && <Menu.Divider />
                    }
                    <Menu.Item onClick={() => { this.canvasRef.handlers.duplicateById(target.id); }}>
                        {i18n.t('action.clone')}
                    </Menu.Item>
                    <Menu.Item onClick={() => { console.log(target.id); this.canvasRef.handlers.removeById(target.id); }}>
                        {i18n.t('action.delete')}
                    </Menu.Item>
                </Menu>
            );
        },
    }

    handlers = {
        getSelectedDormer: id => {
            const objects = this.canvasRef.handlers.getObjects();
            return _.find(objects, obj => obj.id === id);
        },
        onGroupAssignment: groupAssignment => {
            const {
                selectedItem,
            } = this.state;
            selectedItem.set({
                groupAssignment,
                isAssignment: true,
            });
            this.setState({
                selectedItem,
            });
        },
        onUserAssignment: individualAssignment => {
            const {
                selectedItem,
            } = this.state;
            selectedItem.set({
                individualAssignment,
                isAssignment: true,
            });
            this.setState({
                selectedItem,
            });
        },
        onAreaShortcut: shortcut => {
            const {
                selectedItem,
                descriptors: {
                    LINKAREA,
                },
            } = this.state;
            selectedItem.set({
                shortcut,
            });
            this.setState({
                selectedItem,
            });

            const {
                option:{
                    code,
                },
            } = LINKAREA[0];
            const info = this.canvasRef.dormerHandlers.getAreaInfo(selectedItem, code);
            this.canvasRef.elementHandlers.setById(selectedItem.id, info.code);
       
        },
        onPropertiesPanel: () => {
            this.setState(prevState => ({
                propertyCollapse: !prevState.propertyCollapse,
            }));
        },
        switchProperties: propertyKey => {
            let newState = {
                propertyKey,
            };
            if (!this.state.propertyCollapse) {
                newState = {
                    ...newState,
                    propertyCollapse: true,
                };
            }
            this.setState(newState);
        },
        // onDormerSelect: item => {
        //     // store the cache image
        //     this.setState({
        //         dormerSelected: item,
        //     });
        // },
        onUpdateSelectedItem: selectedItem => {
            this.setState({
                selectedItem,
            });
            this.canvasRef.handlers.renderAll();
        },
        // onDormerLoadedSelect: item => {
        //     // store the cache image
        //     this.setState(prevState => ({
        //         dormerCached: {
        //             ...prevState.dormerCached,
        //             [item._id]: item,
        //         },
        //     }));
        // },
        onDormerCreate: obj => {
            this.setState({
                individualMode: true,
            });
        },
        // get all of objects for the current page
        getCurrentCanvasObjects: () => {
            // get all of object for the current canvas
            const objects = this.canvasRef.handlers.exportJSON().objects.filter((obj) => {
                if (!obj.id || obj.ignored) {
                    return false;
                }
                return true;
            });
            const { animations, styles, dataSources, workarea } = this.state;
            const exportDatas = {
                workarea,
                objects,
                animations,
                styles,
                dataSources,
            };

            return exportDatas;
        },
        // update current Object into dataObjects state for the current page
        updateCurrentToAllObjects: () => {
            const exportDatas = this.handlers.getCurrentCanvasObjects();
            let { dataObjects } = this.state;
            const { currentPage } = this.props;

            // store the current page object into state
            dataObjects = {
                ...dataObjects,
                // [currentPage]: exportDatas,
                ...exportDatas,
            };
            return dataObjects;
        },
        // clear the current canvas and switch to another canvas with the objects
        loadOtherCanvas: (pageToBeChanged, objectToBe={}) => {
            // clear all of objects in the canvas
            this.canvasRef.handlers.clear();
            // load all of objects picked from dataObjects state for the page to be changed
            this.canvasRef.handlers.importJSON(objectToBe.objects || []);
            // call back to pdf viewer for the page changing
            this.props.onChangePage(pageToBeChanged);
        },
        initialObjectFromConfig: (dataObjects, pageToBeChanged) => {
            const workarea = this.getWorkarea(this.props);
            // get all of object for the page to be changed
            const current = dataObjects || {
            // dataObjects[pageToBeChanged] || {
                animations: [],
                styles: [],
                dataSources: [],
                objects: [],
                workarea,
            };

            this.setState({
                ...current,
            }, () => {
                // clear all of objects in the canvas
                this.canvasRef.handlers.clear();
                // load all of objects picked from dataObjects state for the page to be changed
                this.canvasRef.handlers.importJSON(current.objects || []);
            });
        },
        onChangePage: pageToBeChanged => {
            const dataObjects = this.handlers.updateCurrentToAllObjects();
            const workarea = this.getWorkarea(this.props);
            // get all of object for the page to be changed
            const prevData = dataObjects[pageToBeChanged] || {
                animations: [],
                styles: [],
                dataSources: [],
                objects: [],
                workarea,
            };

            this.setState({
                ...prevData,
                dataObjects,
            }, () => {
                this.handlers.loadOtherCanvas(pageToBeChanged, prevData);
            });
        },
        onChangePreview: (checked) => {
            this.setState({
                preview: typeof checked === 'object' ? false : checked,
            }, () => {
                if (this.state.preview) {
                    const data = this.canvasRef.handlers.exportJSON().objects.filter((obj) => {
                        if (!obj.id) {
                            return false;
                        }
                        return true;
                    });
                    this.preview.canvasRef.handlers.importJSON(data);
                    return;
                }
                this.preview.canvasRef.handlers.clear(true);
            });
        },
        onProgress: (progress) => {
            this.setState({
                progress,
            });
        },
        onPDFX: () => {

        },
        onCanvasClick: () => {
            this.setState({
                collapseAll: true,
            });
        },
        onImport: (files) => {
            if (files) {
                this.showLoading(true);
                setTimeout(() => {
                    const reader = new FileReader();
                    reader.onprogress = (e) => {
                        if (e.lengthComputable) {                                            
                            const progress = parseInt(((e.loaded / e.total) * 100), 10);
                            this.handlers.onProgress(progress);
                        }
                    };
                    reader.onload = (e) => {
                        const { objects, animations, styles, dataSources } = JSON.parse(e.target.result);
                        this.setState({
                            animations,
                            styles,
                            dataSources,
                        });
                        if (objects) {
                            this.canvasRef.handlers.clear(true);
                            const data = objects.filter((obj) => {
                                if (!obj.id) {
                                    return false;
                                }
                                return true;
                            });

                            this.canvasRef.handlers.importJSON(JSON.stringify(data));
                        }
                    };
                    reader.onloadend = () => {
                        this.showLoading(false);
                    };
                    reader.onerror = () => {
                        this.showLoading(false);
                    };
                    reader.readAsText(files[0]);
                }, 500);
            }
        },
        onUpload: () => {
            const inputEl = document.createElement('input');
            inputEl.accept = '.json';
            inputEl.type = 'file';
            inputEl.hidden = true;
            inputEl.onchange = (e) => {
                this.handlers.onImport(e.target.files);
            };
            document.body.appendChild(inputEl); // required for firefox
            inputEl.click();
            inputEl.remove();
        },
        getSavableObject: () => {
            return this.handlers.updateCurrentToAllObjects();
        },
        // export all of object for the page and pdf buffer string
        onExport: () => {
            this.showLoading(true);
            const data = this.handlers.updateCurrentToAllObjects();
            // toBeExport = JSON.stringify(toBeExport);
            // convert to base64
            // if (this.props.encrypt) {
            //     toBeExport = window.btoa(encodeURIComponent(toBeExport));
            // }
            let file = 'default';
            // {
            //     file,
            // } = this.props;
            file = `${file.replace(/\.[^/.]+$/, '')}.json`;
            const anchorEl = document.createElement('a');
            anchorEl.href = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, '\t'))}`;
            anchorEl.download = file;
            document.body.appendChild(anchorEl); // required for firefox
            anchorEl.click();
            anchorEl.remove();
            this.showLoading(false);

        },
        onDownload: () => {
            this.showLoading(true);
            const objects = this.canvasRef.handlers.exportJSON().objects.filter((obj) => {
                if (!obj.id) {
                    return false;
                // for dormer object
                } else if (obj.ignored) {
                    return false;
                }
                return true;
            });
            const { animations, styles, dataSources } = this.state;
            const exportDatas = {
                objects,
                animations,
                styles,
                dataSources,
            };
            const anchorEl = document.createElement('a');
            let { file } = this.props;
            file = `${(file.name || 'default').replace(/\.[^/.]+$/, '')}.pdfx`;
            anchorEl.href = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(exportDatas, null, '\t'))}`;
            anchorEl.download = `${this.canvasRef.workarea.name || 'sample'}.json`;
            document.body.appendChild(anchorEl); // required for firefox
            anchorEl.click();
            anchorEl.remove();
            this.showLoading(false);
        },
        onChangeAnimations: (animations) => {
            if (!this.state.editing) {
                this.changeEditing(true);
            }
            this.setState({
                animations,
            });
        },
        onChangeStyles: (styles) => {
            if (!this.state.editing) {
                this.changeEditing(true);
            }
            this.setState({
                styles,
            });
        },
        onChangeDataSources: (dataSources) => {
            if (!this.state.editing) {
                this.changeEditing(true);
            }
            this.setState({
                dataSources,
            });
        },
        onSaveImage: () => {
            const {
                source,
            } = this.props;
            const option = {
                name: source.name,
                format: 'png',
                quality: 1,
            }
            this.canvasRef.handlers.saveCanvasImage(option);
        },
    }

    getWorkarea(props) {
        const { page, percentage } = props;
        let width = 900;
        let height = 600;
        if (page && page.getViewport) {
            const workarea = page.getViewport(percentage || 1);
            width = workarea.width;
            height = workarea.height;
        }
        return {
            width,
            height,
        };
    }

    transformList = () => {
        return Object.values(this.state.descriptors).reduce((prev, curr) => prev.concat(curr), []);
    }

    showLoading = (loading) => {
        this.setState({
            loading,
        });
    }

    changeEditing = (editing) => {
        this.setState({
            editing,
        });
    }

    render() {
        const {
            preview,
            selectedItem,
            canvasRect,
            zoomRatio,
            loading,
            progress,
            animations,
            styles,
            dataSources,
            editing,
            descriptors={},
            workarea,
            collapseAll,
            dormerMode,
            areaMode,
            // dormerSelected,
            // dormerCached,
            propertyKey,
            propertyCollapse,
            isMultiSelected,
        } = this.state;
        const {
            onAdd,
            onRemove,
            onSelect,
            onModified,
            onChange,
            onZoom,
            onTooltip,
            onLink,
            onContext,
            refreshAll,
            activeObject,
        } = this.canvasHandlers;
        const {
            onChangePreview,
            onDownload,
            onExport,
            onPDFX,
            getSavableObject,
            onUpload,
            onChangeAnimations,
            onChangeStyles,
            onChangeDataSources,
            onSaveImage,
            onCanvasClick,
            onDormerCreate,
            onUpdateSelectedItem,
            // onDormerSelect,
            // onDormerLoadedSelect,
            onPropertiesPanel,
            onGroupAssignment,
            onUserAssignment,
            onAreaShortcut,
            switchProperties,
            getSelectedDormer,
        } = this.handlers;
        let {
            page,
            afterZoom,
            percentage,
            readOnly,
            pdf,
            source,
            documentPanel={},
            pdfCanvasOption,
            onSave,
            onClickHyperLink,
        } = this.props;
        const action = (
            <React.Fragment>
                <CommonButton
                    className="rde-action-btn"
                    shape="circle"
                    icon="file-download"
                    disabled={!editing}
                    tooltipTitle={i18n.t('action.download')}
                    onClick={onDownload}
                    tooltipPlacement="bottomRight"
                />
                {
                    editing ? (
                        <Popconfirm
                            title={i18n.t('imagemap.imagemap-editing-confirm')}
                            okText={i18n.t('action.ok')}
                            cancelText={i18n.t('action.cancel')}
                            onConfirm={onUpload}
                            placement="bottomRight"
                        >
                            <CommonButton
                                className="rde-action-btn"
                                shape="circle"
                                icon="file-upload"
                                tooltipTitle={i18n.t('action.upload')}
                                tooltipPlacement="bottomRight"
                            />
                        </Popconfirm>
                    ) : (
                        <CommonButton
                            className="rde-action-btn"
                            shape="circle"
                            icon="file-upload"
                            tooltipTitle={i18n.t('action.upload')}
                            tooltipPlacement="bottomRight"
                            onClick={onUpload}
                        />
                    )
                }
            </React.Fragment>
        );
        const editable = !selectedItem || (selectedItem && !selectedItem.dormerMode);
        const content = (
            <div className="rde-editor">
                <DormerPanel
                    canvasRef={this.canvasRef}
                    dormerMode={dormerMode}
                    onUpdateSelectedItem={onUpdateSelectedItem}
                    selectedItem={selectedItem}
                    endpoint={this.props.comparsionListEndpoint}
                    descriptor={descriptors.DORMER}
                    getSelectedDormer={getSelectedDormer}
                    refreshAll={refreshAll}
                    activeObject={activeObject}
                    imageEndpoint={this.props.comparsionDetailEndpoint}
                />
                {
                    !readOnly && editable && <ImageMapItems
                        ref={(c) => { this.itemsRef = c; }}
                        canvasRef={this.canvasRef}
                        descriptors={descriptors}
                        readOnly={readOnly}
                    /> 
                }
                <div className="rde-editor-canvas-container">
                    {
                        !!this.state.selectedItem && !readOnly && editable && <div className="rde-editor-header-toolbar">
                            <ImageMapHeaderToolbar
                                onDownload={onExport}
                                onImport={onPDFX}
                                canvasRef={this.canvasRef}
                                selectedItem={selectedItem}
                                onSelect={onSelect}
                            />
                        </div>
                    }
                    <div
                        ref={(c) => { this.container = c; }}
                        className="rde-editor-canvas"
                    >
                        <Canvas
                            ref={(c) => { this.canvasRef = c; }}
                            canvasOption={{
                                width: canvasRect.width,
                                height: canvasRect.height,
                                backgroundColor: 'rgba(0, 0, 0, 0)',
                                selection: !readOnly,
                            }}
                            minZoom={20}
                            maxZoom={100}
                            pdf={pdf}
                            zoomRatio={zoomRatio}
                            pdfCanvasOption={pdfCanvasOption}
                            defaultOptions={defaultOptions}
                            propertiesToInclude={propertiesToInclude}
                            totalPage={this.props.totalPage}
                            currentPage={this.props.currentPage}
                            onChangePage={this.handlers.onChangePage}
                            onModified={onModified}
                            onAdd={onAdd}
                            switchProperties={switchProperties}
                            afterAdd={this.props.onCreateObject}
                            onRemove={onRemove}
                            onSelect={onSelect}
                            descriptor={descriptors}
                            onZoom={onZoom}
                            onTooltip={onTooltip}
                            onLink={onLink}
                            onContext={onContext}
                            onClickHyperLink={onClickHyperLink}
                            onCanvasClick={onCanvasClick}
                            onDormerCreate={onDormerCreate}
                        />
                    </div>
                    {
                        !dormerMode && <div className="rde-editor-footer-toolbar">
                            <ImageMapFooterToolbar
                                canvasRef={this.canvasRef}
                                preview={preview}
                                onDownload={onExport}
                                getSavableObject={getSavableObject}
                                onSave={onSave}
                                onSaveImage={onSaveImage}
                                source={source}
                                editable={editable}
                                onChangePreview={onChangePreview}
                                zoomRatio={zoomRatio}
                                readOnly={readOnly}
                                firstPage={this.props.firstPage}
                                lastPage={this.props.lastPage}
                                totalPage={this.props.totalPage}
                                currentPage={this.props.currentPage}
                                onChangePage={this.handlers.onChangePage}
                            />
                        </div>
                    }
                </div>
                {
                    !readOnly && editable && <ImageMapConfigurations
                        canvasRef={this.canvasRef}
                        onChange={onChange}
                        collapseAll={collapseAll}
                        selectedItem={selectedItem}
                        onChangeAnimations={onChangeAnimations}
                        onPropertiesPanel={onPropertiesPanel}
                        onChangeStyles={onChangeStyles}
                        onChangeDataSources={onChangeDataSources}
                        onGroupAssignment={onGroupAssignment}
                        onUserAssignment={onUserAssignment}
                        onAreaShortcut={onAreaShortcut}
                        floorList={this.props.floorList}
                        onFloorSelect={this.props.onFloorSelect}
                        source={this.props.source}
                        userAssignmentEndpoint={this.props.userAssignmentEndpoint}
                        groupAssignmentEndpoint={this.props.groupAssignmentEndpoint}
                        areaListEndpoint={this.props.areaListEndpoint}
                        animations={animations}
                        styles={styles}
                        editable={editable}
                        readOnly={readOnly}
                        switchProperties={switchProperties}
                        dataSources={dataSources}
                        propertyKey={propertyKey}
                        propertyCollapse={propertyCollapse}
                        isMultiSelected={isMultiSelected}
                    />
                }
            </div>
        );
        return (
            <div className="rde-main">
                <Container
                    content={content}
                    loading={loading}
                    className=""
                />
            </div>
        );
    }
}

export default ImageMapEditor;
