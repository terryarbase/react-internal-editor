import React, { Component } from "react";
import _ from 'lodash';
// components
import Drawer from './Drawer';
import { i18nClient } from './../../i18n';
import DocumentViewer from './Components/DocumentViewer';
import {
	DownloadFile,
} from './../../utils/download';
// material-ui
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress';

const DocumentReaderStyles = () => ({
	documentViewport: {
		overflow: 'auto',
		width: '100%',
		height: '100%',
		position: 'fixed',
		backgroundColor: '#eeeeee',
		textAlign: 'center',
		padding: '0',
		top: 0,
		left: 0,
	},
	fetchLoaderContainer: {
		position: 'fixed',
		left: '50%',
		top: '50%',
    	transform: 'translate(-50%, -50%)',
    	textAlign: 'center',
	},
	fetchLoaderLabel: {
		color: '#3f51b5',
		fontWeight: 'bolder',
	},
});

class DocumentReader extends Component {
	constructor(props) {
        super(props);
        this.state = this.initialState(props);

        // self members binding
        const funcs = [
        	'onDocumentUploaded',
        	'onDrawer',
        	'renderFetchLoading',
            'renderPickingLoading',
        	'onProgress',
        	'refetchURL',
            'fetchURL',
            'bufferImageLoaded',
            'bufferImageError',
        ];
        _.forEach(funcs, func => this[func] = this[func].bind(this));
        i18nClient.changeLanguage('en-US');
    }

    async componentWillReceiveProps(nextProps) {
        const {
            dataSources,
            language='en-US',
        } = nextProps;
        if (nextProps.sourceEndpoint.url !== this.props.sourceEndpoint.url) {
            this.refetchURL(nextProps);
        }
        if (!_.keys(dataSources).length) {  
            this.setState(this.initialDataSources());
        }
        if (language !== this.props.language) {
            i18nClient.changeLanguage(language);
        }
    }

    async componentWillMount() {
    	this.refetchURL(this.props);
    }

    async refetchURL(props) {
    	const {
    		sourceEndpoint,
    	} = props;
    	let newState = {
    		initial: true,
            pickBuffer: false,
    	};
        
    	if (!!sourceEndpoint) {
    		this.setState(this.initialState(props));
    		const pdfBuffer = await this.fetchURL(sourceEndpoint.url);

            if (!pdfBuffer) {
                newState = {
                    ...newState,
                    initial: false,
                }
            } else {
                newState = {
                    ...newState,
                    pdfBuffer,
                };
            }
    	}
    	this.setState(newState);
    }

    bufferImageError() {
        alert('The pdf cannot be loaded.');
        this.setState({
            initial: false,
        });
    }

    bufferImageLoaded({ target }) {
        this.setState({
            pdfCanvasOption: {
                width: target.width,
                height: target.height,
            },
            pickBuffer: true,
        })
    }

    onProgress(e) {
    	this.setState({
    		progress: Math.floor(100 * e.loaded / e.total),
    	});
    	// console.log(`progress=${progress}%`);
    }

    async fetchURL(url) {
        try {
        	return await DownloadFile(url, {
        		onProgress: this.onProgress,
        	});
        } catch (err) {
            window.console.error(err);
            this.bufferImageError();
            const {
                mainEndpoint: {
                    onError,
                },
            } = this.props;
            if (onError) {
                onError(err);
            }
        }
    	return null;
    }

    initialState(props) {
    	return {
    		initial: true,
            pickBuffer: false,  // the image is already loaded
    		progress: 0,
            pdfCanvasOption: {
                width: 900,
                height: 900,
            },
    		pdf: null,	// pdf file object
    		pdfBuffer: null, // pdf file uint8Array buffer
    		showDrawer: false,	// show the side menu
            dataSources: props.dataSources,
    	};
    }

    initialWorkAreaObject() {
        // const {
        //     dataSources={},
        // } = this.state;
        // if (_.find(dataSources.objects, o => o.id === 'workarea')) {
        //     return null;
        // }
        return {
            "type": "image",
            "version": "2.3.6",
            "originX": "left",
            "originY": "top",
            "left": 297.5,
            "top": 421,
            "width": 0,
            "height": 0,
            "fill": "rgb(0,0,0)",
            "stroke": null,
            "strokeWidth": 0,
            "strokeDashArray": null,
            "strokeLineCap": "butt",
            "strokeLineJoin": "miter",
            "strokeMiterLimit": 4,
            "scaleX": 1,
            "scaleY": 1,
            "angle": 0,
            "flipX": false,
            "flipY": false,
            "opacity": 1,
            "shadow": null,
            "visible": true,
            "clipTo": null,
            "backgroundColor": "rgba(255, 255, 255, 0)",
            "fillRule": "nonzero",
            "paintFirst": "fill",
            "globalCompositeOperation": "source-over",
            "transformMatrix": null,
            "skewX": 0,
            "skewY": 0,
            "crossOrigin": "",
            "cropX": 0,
            "cropY": 0,
            "id": "workarea",
            "name": "",
            "link": {},
            "tooltip": {
                "enabled": false
            },
            "layout": "fixed",
            "workareaWidth": 595,
            "workareaHeight": 842,
            "src": "",
            "filters": []
        };
    }

    initialDataSources() {
        const workareObject = this.initialWorkAreaObject();
        return {
            workarea: {
                "width": 900,
                "height": 900,
            },
            objects: [
                workareObject,
            ],
            animations: [],
            styles: [],
            dataSources: [],
        };
    }

    onDocumentUploaded(pdf, pdfBuffer) {
	    this.setState({
	    	pdfBuffer,
	    	pdf,
	    	showDrawer: false,
	    });
	}

    onDrawer() {
    	this.setState(prev => ({
    		showDrawer: !prev.showDrawer,
    	}))
    }

    renderFetchLoading() {
    	const {
    		progress,
    	} = this.state;
    	const {
    		classes,
    	} = this.props;
        let color = 'primary';
        if (progress > 80) {
            color = 'secondary';
        }
    	return (
    		<div className={classes.fetchLoaderContainer}>
    			<CircularProgress size={70} color={color} />
    			<div className={classes.fetchLoaderLabel}>
    				Loading {progress}%
    			</div>
    		</div>
    	);
    }

    renderPickingLoading() {
        const {
            classes,
        } = this.props;
        return (
            <div className={classes.fetchLoaderContainer}>
                <CircularProgress size={70} color={'secondary'} />
                <div className={classes.fetchLoaderLabel}>
                    Processing...
                </div>
            </div>
        );
    }

	render() {
		const { classes } = this.props;
        // console.log(this.state);
		if (!this.state.initial) return this.renderFetchLoading();
        const {
            pdfBuffer,
            pickBuffer,
        } = this.state;
        let {
            dataSources,
        } = this.state;
        if (pickBuffer) {
            if (!_.keys(dataSources).length) {  
                dataSources = this.initialDataSources();
            }
    		return (
    			<div className={classes.documentViewport}>         
    				<DocumentViewer
    					pdf={pdfBuffer}
                        pdfCanvasOption={this.state.pdfCanvasOption}
                        preview={this.props.preview}
                        source={this.props.source}
                        dataSources={dataSources}
                        floorList={this.props.floorList}
                        onFloorSelect={this.props.onFloorSelect}
                        onClickHyperLink={this.props.onClickHyperLink}
                        onSave={this.props.onSave}
                        groupAssignmentEndpoint={this.props.groupAssignmentEndpoint}
                        userAssignmentEndpoint={this.props.userAssignmentEndpoint}
                        areaListEndpoint={this.props.areaListEndpoint}
                        comparsionListEndpoint={this.props.comparsionListEndpoint}
                        comparsionDetailEndpoint={this.props.comparsionDetailEndpoint}
    				/>
    			</div>
    		);
        }
        return (
            <div>
                {
                    !pickBuffer && this.renderPickingLoading()
                }
                {
                    pdfBuffer && <img
                        style={{ display: 'none' }}
                        src={pdfBuffer}
                        onLoad={this.bufferImageLoaded}
                        onError={this.bufferImageError}
                        alt=""
                    />
                }
            </div>
        );
	};
}

// DocumentReader.propTypes = {
// 	classes: PropTypes.object.isRequired,
// };

export default withStyles(DocumentReaderStyles)(DocumentReader);
