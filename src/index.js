import React, { Component } from 'react';
import ReactDom from 'react-dom';
import _ from 'lodash';
import { AppContainer } from 'react-hot-loader';
import { LocaleProvider } from 'antd';
import koKR from 'antd/lib/locale-provider/ko_KR';
import enUS from 'antd/lib/locale-provider/en_US';

import App from './containers/App';
import PDFViewer from './components/pdfviewer';
import { i18nClient } from './i18n';

// const antResources = {
//     ko: koKR,
//     'ko-KR': koKR,
//     en: enUS,
//     'en-US': enUS,
// };



class AppView extends Component {
    constructor(props) {
        super(props);
        // self members binding
        const funcs = [
            'onAreaViewClick',
        ];
        _.forEach(funcs, func => this[func] = this[func].bind(this));
        const sources = {
            "workarea": {
                "width": 595,
                "height": 842
            },
            "objects": [
                {
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
                },
                {
                    "_id": "124SAFA15125sfasf21412rasfasf",
                    "type": "rect",
                    "version": "2.3.6",
                    "originX": "left",
                    "originY": "top",
                    "left": 101,
                    "top": 148.5,
                    "width": 40,
                    "height": 40,
                    "fill": "rgba(0, 0, 0, 1)",
                    "stroke": "rgba(255, 255, 255, 0)",
                    "strokeWidth": 1,
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
                    "backgroundColor": "",
                    "fillRule": "nonzero",
                    "paintFirst": "fill",
                    "globalCompositeOperation": "source-over",
                    "transformMatrix": null,
                    "skewX": 0,
                    "skewY": 0,
                    "rx": 0,
                    "ry": 0,
                    "id": "267ec4ab-81a5-4423-895c-b574e897dd3a",
                    "name": "New shape",
                    "link": {
                        "enabled": false,
                        "type": "resource",
                        "state": "new",
                        "dashboard": {}
                    },
                    "tooltip": {
                        "enabled": true,
                        "type": "resource",
                        "template": "<div>{{message.name}}</div>"
                    },
                    "animation": {
                        "type": "none",
                        "loop": true,
                        "autoplay": true,
                        "delay": 100,
                        "duration": 1000
                    },
                    "userProperty": {},
                    "trigger": {
                        "enabled": false,
                        "type": "alarm",
                        "script": "return message.value > 0;",
                        "effect": "style"
                    }
                },
                {
                    "singleton": true,
                    "type": "rect",
                    "version": "2.3.6",
                    "originX": "left",
                    "originY": "top",
                    "left": 277,
                    "top": 400.5,
                    "width": 40,
                    "height": 40,
                    "fill": "rgba(0, 0, 0, 1)",
                    "stroke": "rgba(255, 255, 255, 0)",
                    "strokeWidth": 1,
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
                    "backgroundColor": "",
                    "fillRule": "nonzero",
                    "paintFirst": "fill",
                    "globalCompositeOperation": "source-over",
                    "transformMatrix": null,
                    "skewX": 0,
                    "skewY": 0,
                    "rx": 0,
                    "ry": 0,
                    "id": "5048a58a-0bf0-45d7-8d2a-45dcf2bc155a",
                    "name": "New shape",
                    "link": {
                        "enabled": false,
                        "type": "resource",
                        "state": "new",
                        "dashboard": {}
                    },
                    "tooltip": {
                        "enabled": true,
                        "type": "resource",
                        "template": "<div>{{message.name}}</div>"
                    },
                    "animation": {
                        "type": "none",
                        "loop": true,
                        "autoplay": true,
                        "delay": 100,
                        "duration": 1000
                    },
                    "userProperty": {},
                    "trigger": {
                        "enabled": false,
                        "type": "alarm",
                        "script": "return message.value > 0;",
                        "effect": "style"
                    }
                },
                {
                    "type": "rect",
                    "version": "2.3.6",
                    "originX": "left",
                    "originY": "top",
                    "left": 277,
                    "top": 400.5,
                    "width": 40,
                    "height": 40,
                    "fill": "rgba(0, 0, 0, 1)",
                    "stroke": "rgba(255, 255, 255, 0)",
                    "strokeWidth": 1,
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
                    "backgroundColor": "",
                    "fillRule": "nonzero",
                    "paintFirst": "fill",
                    "globalCompositeOperation": "source-over",
                    "transformMatrix": null,
                    "skewX": 0,
                    "skewY": 0,
                    "rx": 0,
                    "ry": 0,
                    "id": "73f546ff-5873-45b6-a57c-83f7d530e8b6",
                    "name": "New shape",
                    "link": {
                        "enabled": false,
                        "type": "resource",
                        "state": "new",
                        "dashboard": {}
                    },
                    "tooltip": {
                        "enabled": true,
                        "type": "resource",
                        "template": "<div>{{message.name}}</div>"
                    },
                    "animation": {
                        "type": "none",
                        "loop": true,
                        "autoplay": true,
                        "delay": 100,
                        "duration": 1000
                    },
                    "userProperty": {},
                    "trigger": {
                        "enabled": false,
                        "type": "alarm",
                        "script": "return message.value > 0;",
                        "effect": "style"
                    }
                },
                {
                    "type": "rect",
                    "version": "2.3.6",
                    "originX": "left",
                    "originY": "top",
                    "left": 379,
                    "top": 177.5,
                    "width": 40,
                    "height": 40,
                    "fill": "rgba(0, 0, 0, 1)",
                    "stroke": "rgba(255, 255, 255, 0)",
                    "strokeWidth": 1,
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
                    "backgroundColor": "",
                    "fillRule": "nonzero",
                    "paintFirst": "fill",
                    "globalCompositeOperation": "source-over",
                    "transformMatrix": null,
                    "skewX": 0,
                    "skewY": 0,
                    "rx": 0,
                    "ry": 0,
                    "id": "085eacb0-2f5c-40e3-a9e1-13872fe8fd2b",
                    "name": "New shape",
                    "link": {
                        "enabled": false,
                        "type": "resource",
                        "state": "new",
                        "dashboard": {}
                    },
                    "tooltip": {
                        "enabled": true,
                        "type": "resource",
                        "template": "<div>{{message.name}}</div>"
                    },
                    "animation": {
                        "type": "none",
                        "loop": true,
                        "autoplay": true,
                        "delay": 100,
                        "duration": 1000
                    },
                    "userProperty": {},
                    "trigger": {
                        "enabled": false,
                        "type": "alarm",
                        "script": "return message.value > 0;",
                        "effect": "style"
                    }
                },
                {
                    "type": "rect",
                    "version": "2.3.6",
                    "originX": "left",
                    "originY": "top",
                    "left": 225,
                    "top": 230.5,
                    "width": 40,
                    "height": 40,
                    "fill": "rgba(0, 0, 0, 1)",
                    "stroke": "rgba(255, 255, 255, 0)",
                    "strokeWidth": 1,
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
                    "backgroundColor": "",
                    "fillRule": "nonzero",
                    "paintFirst": "fill",
                    "globalCompositeOperation": "source-over",
                    "transformMatrix": null,
                    "skewX": 0,
                    "skewY": 0,
                    "rx": 0,
                    "ry": 0,
                    "id": "886caf5f-3b8b-474c-9330-264b23f2efaa",
                    "name": "New shape",
                    "link": {
                        "enabled": false,
                        "type": "resource",
                        "state": "new",
                        "dashboard": {}
                    },
                    "tooltip": {
                        "enabled": true,
                        "type": "resource",
                        "template": "<div>{{message.name}}</div>"
                    },
                    "animation": {
                        "type": "none",
                        "loop": true,
                        "autoplay": true,
                        "delay": 100,
                        "duration": 1000
                    },
                    "userProperty": {},
                    "trigger": {
                        "enabled": false,
                        "type": "alarm",
                        "script": "return message.value > 0;",
                        "effect": "style"
                    }
                },
                {
                    "type": "element",
                    "version": "3.3.0",
                    "originX": "left",
                    "originY": "top",
                    "left": 690.62,
                    "top": 350.31,
                    "width": 0,
                    "height": 0,
                    "fill": "rgba(255, 255, 255, 0)",
                    "stroke": "rgba(255, 255, 255, 0)",
                    "strokeWidth": 1,
                    "strokeDashArray": null,
                    "strokeLineCap": "butt",
                    "strokeDashOffset": 0,
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
                    "backgroundColor": "",
                    "fillRule": "nonzero",
                    "paintFirst": "fill",
                    "globalCompositeOperation": "source-over",
                    "transformMatrix": null,
                    "skewX": 0,
                    "skewY": 0,
                    "rx": 0,
                    "ry": 0,
                    "id": "664f1d9c-6cff-47a5-9aaa-0510ba29442d",
                    "name": "New Shortcut Link",
                    "title": "test",
                    "description": "asfasfasfasgasfasfasfasgasfasfasfasgasfasfasfasgasfasfasfasgasfasfasfasgasfasfasfasgasfasfasfasgasfasfasfasgasfasfasfasgasfasfasfasgasfasfasfasgasfasfasfasgasfasfasfasgasfasfasfasgasfasfasfasgasfasfasfasgasfasfasfasgasfasfasfasgasfasfasfasgasfasfasfasgasfasfasfasgasfasfasfasgasfasfasfasgasfasfasfasgasfasfasfasgasfasfasfasgasfasfasfasgasfasfasfasgasfasfasfasgasfasfasfasgasfasfasfasgasfasfasfasgasfasfasfasgasfasfasfasgasfasfasfasg",
                    "shortcut": "1000004",
                    "link": {
                        "enabled": false,
                        "type": "resource",
                        "state": "new",
                        "dashboard": {}
                    },
                    "tooltip": {
                        "enabled": true,
                        "type": "resource",
                        "template": "<div>{{message.name}}</div>"
                    },
                    "animation": {
                        "type": "none",
                        "loop": true,
                        "autoplay": true,
                        "delay": 100,
                        "duration": 1000
                    },
                    "userProperty": {},
                    "trigger": {
                        "enabled": false,
                        "type": "alarm",
                        "script": "return message.value > 0;",
                        "effect": "style"
                    }
                }
            ],
            "animations": [],
            "styles": [],
            "dataSources": [],
        };

        this.state = {
            sourceUrl: 'https://www.deermember.com/api/testpdf', 
            sources,
        };
    }

    onAreaViewClick(selected) {
        window.console.warn(`Selected Hyperlink data: ${selected}`);
        this.setState({
            sourceUrl: 'http://0.0.0.0:3010/api/viewAreaLink',
            sources: {},
        });
    }

    render() {
        return (
            <AppContainer>
                <PDFViewer
                    source={{   // required
                        _id: '9e1324686886df234d42', // main pdf id
                        name: 'Hong Kong-Zhuhai-Macau Bridge',
                    }}
                    dataSources={this.state.sources}   // optional
                    preview={false}     // optional
                    sourceEndpoint={{ // source pdf image endpoint, required
                        url: this.state.sourceUrl,
                        // url: 'https://www.deermember.com/api/testpdf',
                        onError: err => {
                            alert(err);
                        },
                    }}
                    onSave={(type, data, closeCallback) => {    // save or export config data
                        closeCallback();
                        window.console.warn(type, data);
                    }}

                    areaListEndpoint={{
                        url: 'http://0.0.0.0:3010/api/testAreaLink',
                        onError: err => {
                            alert(err);
                        },
                    }}

                    onClickHyperLink={this.onAreaViewClick} 


                    groupAssignmentEndpoint={{ // group search list endpoint, required
                        url: 'http://0.0.0.0:3010/api/testGroup',
                        onError: err => {
                            alert(err);
                        },
                        singleSelection: false,    // multi select
                    }}
                    userAssignmentEndpoint={{ // user search list endpoint, required
                        url: 'http://0.0.0.0:3010/api/testUser',
                        onError: err => {
                            alert(err);
                        },
                    }}
                    comparsionListEndpoint={{ // comparsion version list endpoint, required
                        url: 'http://0.0.0.0:3010/api/testComparsion',
                        onError: err => {
                            alert(err);
                        },
                    }}
                    comparsionDetailEndpoint={{ // get the blob pdf image for the comparsion item endpoint, required
                        url: 'http://0.0.0.0:3010/api/testLoadComparsion',
                        onError: err => {
                            alert(err);
                        },
                    }}

                    floorList={[    // suppose not update frequently, options
                        {
                            _id: '9e1324686886df234d42',
                            name: 'Hong Kong-Zhuhai-Macau Bridge (First Floor)',    // labe
                        },
                        {
                            _id: '9e142fc86886df234d6d',
                            name: 'Hong Kong-Zhuhai-Macau Bridge (Second Floor)',
                        },
                        {
                            _id: '9e1324843443df2523d74',
                            name: 'Hong Kong-Zhuhai-Macau Bridge (Third Floor)',
                        },
                        {
                            _id: '84132484344dk2434d74',
                            name: 'Hong Kong-Zhuhai-Macau Bridge (Fourth Floor)',
                        },
                        {
                            _id: '6e1324843443df54d74',
                            name: 'Hong Kong-Zhuhai-Macau Bridge (Fifth Floor)',
                        },
                    ]}
                    onFloorSelect={selected => window.console.warn(`Selected Floor Plan data: ${selected}`)}   // optional
                />
            </AppContainer>
        );
    }
}

const render = () => {
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);
    const rootElement = document.getElementById('root');
    ReactDom.render(
        <AppView />,
        rootElement,
    );
};

render(PDFViewer);
if (module.hot) {
    module.hot.accept('./components/pdfviewer', () => {
        render();
    });
}
