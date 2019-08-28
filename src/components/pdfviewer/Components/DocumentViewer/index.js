import React, { Component } from "react";
import doEach from 'lodash/forEach';
// import PropTypes from 'prop-types';
// components
// import {
// 	Document,
// 	Page,
// 	pdfjs,
// } from 'react-pdf';
// import DocumentControl from './../DocumentControl';
// import OutlineControl from './../../Drawer/Outline';
import ImageMapEditor from './../../../imagemap/ImageMapEditor';
// material-ui
import { withStyles } from "@material-ui/core/styles";
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const DocumentViewerStyles = () => ({
	scrollContainer: {
		overflow: 'auto',
		height: '100%',
		width: '100%',
        padding: '0 90px',
	},
	viewContainer: {
		padding: 0,
		borderRadius: 0,
		position: 'relative',
		margin: '50px auto 100px auto',
		display: 'table',
		width: 'auto',
		textAlign: 'center',
	},
    previewAllContainer: {
        padding: 0,
        margin: 0,
    },
    editorContainer: {
        // position: 'absolute',
        // top: 0,
        // width: '100%',
        // height: '100%',
        // left: 0,
    },
	viewEmptyContainer: {
		width: '900px',
		height: '600px',
	},
	progressContainer: {
		position: 'absolute',
		top: 0,
		left: 0,
	},
});

class DocumentViewer extends Component {
	constructor(props) {
        super(props);
        this.state = this.initialState(props);
        this.scrollPanel = React.createRef();
        // self members binding
        const funcs = [
        	'onLoadingPage',
        	'onLoadedPage',
        	'onDocumentSourceSuccess',
        	'onDocumentLoaded',
        	'onPageChanged',
            'onZoom',
            'onCreateObject',
            'onScaleChanged',
        	// render helpers
        	// 'renderMainDocument',
        	'renderLoadingDocument',
        ];
        doEach(funcs, func => this[func] = this[func].bind(this));
    }

    initialState(props) {
    	return {
    		totalPage: 0,	// total number of page
    		page: 1,	// default page
    		loadingPage: false,
    		progress: 0,
            percentage: 1,
    		buffer: 0,
            first: true,    // is first page
            pageFactory: null, // PDFDocument Page factory object
    		factory: null, 	// PDFDocument factory object
    	};
    }

    onLoadingPage({ loaded, total }) {
    	let { progress } = this.state;
    	let buffer = 10;
    	progress = Math.floor((loaded / total) * 100);
    	if (progress < 100) { 
	  		buffer = progress + (Math.random() * 10);
	  	}
    	this.setState({
    		loadingPage: true,
    		progress,
    		buffer,
    	});
    }

    onDocumentSourceSuccess() {
    	this.setState({
    		loadingPage: true,
    	});
    }

    onZoom(opt) {
        const {
            zoomRatio: percentage,
        } = opt;
        let {
            width,
            height,
        } = opt;
        this.setState({
            percentage,
        });
        const {
            scrollPanel={}
        } = this;
        // console.log(percentage, width, height);
        if (scrollPanel.current) {
            const {
                current={},
            } = scrollPanel;
            width = (width * percentage) - 90;
            // height = (height * percentage) - 150;
            // console.log((current.scrollWidth - width) / 2, (current.scrollHeight - 350) / 2, current.scrollTo);
            // console.log(width, height, current.scrollWidth - width, current.scrollHeight - height);
            // current.scrollTo(2000, 200);
            current.scrollTo((current.scrollWidth - width) / 2, (current.scrollHeight - 350) / 2);
            // console.log(current.scrollTo);
            // if (scrollPanel.current.scrollWidth < )
            // console.log(scrollPanel.current.scrollWidth);
        }
    }

    onAdd = () => {
        // const {
        //     scrollPanel={}
        // } = this;
        // // console.log(percentage, width, height);
        // if (scrollPanel.current) {
        //     const {
        //         current={},
        //     } = scrollPanel;
        //     current.scrollLeft = 1500;
        //     console.log(current.clientWidth, current.scrollLeft);
        //     // current.scrollTo(current.scrollWidth / 2, (current.scrollHeight - 350) / 2);
        // }
    }

    onPageChanged(page) {
        // console.log(page);
    	this.setState({
    		page,
            last: page === this.state.totalPage,
            first: page === 1,
    	});
    }

    onScaleChanged(percentage) {
        this.setState({
            percentage,
        });
    }

    onLoadedPage(pageFactory) {
    	this.setState({
    		loadingPage: false,
    		progress: 0,
            pageFactory,
    	});
    }

    onCreateObject() {
        // console.log(this.scrollPanel);
    }

    onDocumentLoaded(factory) {
    	const { numPages } = factory;
    	let totalPage = numPages;
    	let page = 1;
    	if (totalPage <= 0) {
    		page = 0;
    	}
        // console.log(factory, page, totalPage);
    	this.setState({
    		totalPage,
            last: totalPage === 1,
    		page,
    		factory,
    	});
    }

    renderLoadingDocument() {
    	return (
    		<div className={this.props.classes.progressContainer}>
    			<LinearProgress
    				variant="buffer"
    				value={this.state.progress}
    				valueBuffer={this.state.buffer}
    			/>
    		</div>
    	);
    }

    // renderMainDocument() {
    // 	if (!this.props.pdf && !this.props.file) {
    // 		return (<div />);
    // 	}
    // 	return (
    //         <div>
    //     		<Document
    // 	        	file={this.props.pdf || this.props.file}
    // 				noData={(<div />)}
    // 				loading={(<div />)}
    // 				onSourceSuccess={this.onDocumentSourceSuccess}
    // 				onSourceError={(error) => {
    // 					console.log(error.message);
    // 				}}
    // 				onLoadSuccess={this.onDocumentLoaded}
    // 	        >
    // 	        	<Page
    // 	        		inputRef={r => { this.pageRef = r; }}
    // 	        		onLoadProgress={this.onLoadingPage}
    //                     onLoadSuccess={this.onLoadedPage}
    // 	        		pageNumber={this.state.page}
    //                     renderAnnotationLayer={false}
    //                     renderTextLayer={false}
    //                     scale={this.state.percentage}
    // 	        	/>
    // 	        </Document>
    //         </div>
    // 	);
    // }

	render() {
		const { classes, pdfCanvasOption={}, preview } = this.props;
		let viewContainerStyle = [ classes.viewContainer ];
        let scrollContainerStyle = [ classes.scrollContainer ];
		// the user does not pick any file
		if (!this.props.pdf && !this.props.file) {
			viewContainerStyle = [
				...viewContainerStyle,
				classes.viewEmptyContainer,
			];
		}

        if (preview) {
            viewContainerStyle = [
                ...viewContainerStyle,
                classes.previewAllContainer,
            ];
            scrollContainerStyle = [
                ...scrollContainerStyle,
                classes.previewAllContainer,
            ];
        }
        const { factory, pageFactory, percentage } = this.state;
		return (
			<div
                className={scrollContainerStyle.join(' ')}
                ref={this.scrollPanel}
            >
				<div
					className={viewContainerStyle.join(' ')}
					elevation={1}
				>
					{ /*this.renderMainDocument()*/ }
					{
                        /*
                        <DocumentControl
    						currentPage={this.state.page}
    						totalPage={this.state.totalPage}
    						onChangePage={this.onPageChanged}
                            percentage={percentage}
                            onScaleChanged={this.onScaleChanged}
    						pdf={factory}
    						file={this.props.file}
					   />
                       */
                    }
                    {
                        /*factory && <OutlineControl
                            onChangePage={this.onPageChanged}
                            pdf={factory}
                            totalPage={this.state.totalPage}
                            currentPage={this.state.page}
                        />*/
                    }
                    {
        
                        <div className={classes.editorContainer}>
                            <ImageMapEditor
                                totalPage={this.state.totalPage}
                                currentPage={this.state.page}
                                onChangePage={this.onPageChanged}
                                pdfCanvasOption={pdfCanvasOption}
                                page={pageFactory}
                                pdf={this.props.pdf}    // pdf arraybuffer object
                                lastPage={this.state.last}
                                firstPage={this.state.first}
                                percentage={percentage}
                                onCreateObject={this.onCreateObject}
                                onZoom={this.onZoom}
                                readOnly={this.props.preview}
                                documentPanel={this.scrollPanel}
                                onAdd={this.onAdd}
                                encrypt={this.props.encrypt}
                                config={this.props.dataSources}
                                source={this.props.source}
                                floorList={this.props.floorList}
                                onFloorSelect={this.props.onFloorSelect}
                                onSave={this.props.onSave}
                                onClickHyperLink={this.props.onClickHyperLink}
                                areaListEndpoint={this.props.areaListEndpoint}
                                groupAssignmentEndpoint={this.props.groupAssignmentEndpoint}
                                userAssignmentEndpoint={this.props.userAssignmentEndpoint}
                                comparsionListEndpoint={this.props.comparsionListEndpoint}
                                comparsionDetailEndpoint={this.props.comparsionDetailEndpoint}
                            />
                        </div>
                    }
				</div>
			</div>
		);
	};
}

// DocumentViewer.propTypes = {
// 	pdf: PropTypes.object,
// 	file: PropTypes.object,
// 	classes: PropTypes.object.isRequired,
// };

export default withStyles(DocumentViewerStyles)(DocumentViewer);
