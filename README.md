# React Internal Editor 1.0.1
[![npm](https://img.shields.io/npm/v/react-image.svg?style=flat-square)](https://www.npmjs.com/package/react-image) [![npm](https://img.shields.io/npm/l/react-image.svg?style=flat-square)](https://www.npmjs.com/package/react-image) [![npm](https://img.shields.io/npm/dt/react-image.svg?style=flat-square)](https://www.npmjs.com/package/fabric) [![npm](https://img.shields.io/npm/dt/react-image.svg?style=flat-square)](https://salgum1114.github.io/react-design-editor)

React Internal Editor is a easy assignment editor tool for the internal building operations, which is using React.js + ant.design + fabric.js + react-pdf + react-design-editor + material-ui

# Highlighting Features

  - Shortcut Layer Control
  - Region Comparsion (Dormer Window)
  - Export Layer Configurations (full layers)
  - Layer Assignments (Individual or Group)
  - Vector Drawings (Circle, Triangle, Path, Square)
  - Layer Panel (Grouping, Duplication)
  - Floor Panel

# Important Concept Behinds

The project was using react-pdf and fabricjs to edit the pdf file, while the huge performance challenge for the browser loading and loading the pdf in mobile browser, thus we has changed to use image source control for replacing the pdf manipulation in client's browser. Also, you need to reference the followings by doing the stuffs at the server-side before getting the start for this plugin

 - Convert all of pages from the PDF document after upload
```jsx
const PDFImage = require("pdf-image").PDFImage;
const pdfImage = new PDFImage('./floors.pdf');
pdfImage.convertFile().then(function (imagePaths) {
    // [ /tmp/slide-0.png, /tmp/slide-1.png ]
    // save the relationships for those image (e.g. floor relationship)
});
```
See [pdf-image](https://www.npmjs.com/package/pdf-image) for more info and all of the dependencies for the `pdf-image`.

  - Version Comparsion Cropping
```jsx
const gm = require('gm').subClass({
    imageMagick: true,
    appPath: '/usr/local/bin/',
});
// read from the local directory or remote server using (http request)
const cacheFilePath = './floors.pdf';
gm(cacheFilePath).crop(
    width,    // width, sending from InternalEditor
    height,    // height, sending from InternalEditor
    left,    // x coordinate, sending from InternalEditor
    top,    // y coordinate, sending from InternalEditor
).stream((err, stdout, stderr) => {
    // pipe as the write steam to the client-side
    stdout.pipe(res);
    req.on('end', () => {
        // remove the cache file if the file is downloaded from the remote server
        fs.unlinkSync(cacheFilePath);
    });
});
```
See [gm](https://www.npmjs.com/package/gm) for more info and all of the dependencies for the `gm`.

## Getting started

InternalEditor requires [Node.js](https://nodejs.org/) v8.0+ to run.

1. Install the dependencies and devDependencies and start the server.

```sh
$ cd react-internal-editor
$ npm install
$ npm start
```

2. Install the latest babel7 dependencies for `react-internal-editor` and preapre the static babel configuration file, and prepare the properly loaders in your project

```sh
$ npm install @babel/runtime@7.5.5 @babel/preset-env@7.5.5 @babel/core@7.5.5 @babel/preset-react@7.0.0 --save-dev
```

### .babelrc

```jsx
{
    "presets": [
        "@babel/preset-env", 
        "@babel/preset-react"
    ],
    "plugins": [
        ["@babel/transform-runtime"]
    ]
}
```

### webpack.config.js

```jsx
module: {
    rules: [
      .....
      .....
      .....
      {
          // important url loader for the svg fonts in `react-internal-editor`
          test: /\.(ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: 'url-loader',
          options: {
              publicPath: './',
              name: 'fonts/[hash].[ext]',
              limit: 10000,
          },
      },
      {
        test: /\.(css|less)$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',  // important less loader for the `react-internal-editor`
            options: {
              javascriptEnabled: true,
            }
          },
        ]
      }
    ]
}
```

3. InternalEditor relies on some endpoints for partially operations.

```jsx
import InternalEditor from 'react-internal-editor';

// On Shortcut View Clicking
onAreaViewClick(selected) {
    window.console.warn(`Selected Hyperlink data: ${selected}`);
    this.setState({
        // change the pdf image url, to fetch the target floor image
        // or do other stuffs
        sourceUrl: 'http://0.0.0.0:3010/api/viewAreaLink',
    });
}

// Save or export layer's config data
onExportConfig(type, data, closeCallback) {
    // callback the editor to close the save panel, required
    closeCallback();
    window.console.warn(type, data);
}

<InternalEditor
    source={{   // required
        _id: '9e1324686886df234d42', // main pdf id
        name: 'Hong Kong-Zhuhai-Macau Bridge',
    }}
    dataSources={this.state.sources}   // optional
    preview={false}     // optional
    language='en-US'
    sourceEndpoint={{ // source pdf image endpoint, required
        url: this.state.sourceUrl,
        // url: 'https://www.deermember.com/api/testpdf',
        onError: err => {
            alert(err);
        },
    }}
    onSave=this.onExportConfig,
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
```

### Component Options
Property    |   Type        |   Default     |   Description
:-----------------------|:--------------|:--------------|:--------------------------------
source | object       | undefined     | Required. A source infomation including target id and name for the configuation export use, you can also store it at your own component state. e.g. `{ id: "", name: "" }`
dataSources | object       | undefined     | Required. A layer configurations toward the source pdf.  e.g. `{ workarea: {}, objects: [], "animations": [], "styles": [], "dataSources": [], }`
preview | boolean       | false     | Optional. the editor turns on preview mode, where the panels will be disabled in readonly mode 
sourceEndpoint | object       | undefined     | Required. providing the source endpoint api service for fetching the target PDF Image to the editor, onError callback also provides for any error occurs.  e.g. `{ url: "", onError: () => {}, }`
onSave | function       | undefined     | Required. layer export callback and the type of save will be also returned either `save` or 'saveAs' with the `source.id`
areaListEndpoint | object       | undefined     | Required. providing the shortcut area endpoint api service for fetching the target area item to be selected, while there is the different area item belonging to the current chosen floor. also, onError callback provides for any error occurs.  e.g. `{ url: "", onError: () => {}, }`
onClickHyperLink | function       | undefined     | Required. area shortcut callback for the view action, should handle the data configuration changing after the callback for the other target area of the floor
groupAssignmentEndpoint | object       | undefined     | Required. providing the group endpoint api service for fetching the group list to the assignment panel in the editor, onError callback also provides for any error occurs.  e.g. `{ url: "", onError: () => {}, }`
userAssignmentEndpoint | object       | undefined     | Required. providing the user endpoint api service for fetching the individual user list to the assignment panel in the editor, onError callback also provides for any error occurs.  e.g. `{ url: "", onError: () => {}, }`
comparsionListEndpoint | object       | undefined     | Required. providing the version endpoint api service for fetching the version list to the comparsion panel in the editor towards the chosen floor, onError callback also provides for any error occurs.  e.g. `{ url: "", onError: () => {}, }`
comparsionDetailEndpoint | object       | undefined     | Required. providing the version details endpoint api service for cropping the target region towards the chosen version in `comparsionListEndpoint`, onError callback also provides for any error occurs.  e.g. `{ url: "", onError: () => {}, }`
floorList | array       | []     | Optional. the floor list for the current building project, each of building project should has many floors  e.g. `[ { _id: "", name: "" } ]`
onFloorSelect | function       | []     | Optional. the floor clicking callback, the other layer configuration data and floor image should be also fetched from `sourceEndpoint.url` to `dataSources` with `source: { _id: "", name: "" }`

### Layer Configuration Example

```jsx
const dataSources = {
    "workarea": {
        "width": 900,
        "height": 900
    },
    "objects": [
        // basic workarea object, required
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
    ],
    "animations": [],
    "styles": [],
    "dataSources": [],
};
```
## Development

```sh
$ cd react-internal-editor
$ npm install
$ npm start
```
Open [http://0.0.0.0:3030](http://0.0.0.0:3030) to view `react-internal-editor`

## Depolyment

```sh
$ cd react-internal-editor
$ npm run publish
```

## Todos

1. Features
  - Job Assignments Control
  - Area Separation
  - Job Accomplishment

2. Environment 
  - Migrate to React 16.9.0 with context hooks
  - Upgrade Material-ui will the latest core set
  - Remove useless code for 'react-designer-editor'

## Dependencies

`react-internal-editor` has some external dependencies, which are the usual `react`, `react-dom`, `ant.design`, `material-ui`, `i18next` and `fabric`, as well as `design-editor`.

## Changelogs

#### Verion 1.0.1 (28/08/2019)
- Downgrade React.js to v16.4.0 from v16.9.0
- Add publishing script for the distribution release using babel-cil
- Remove Slider from @material-ui/code, use [react-rangeslider](https://www.npmjs.com/package/react-rangeslider) instead.
- Remove pdf-lib and react-pdf dependencies
- Add babel.config.js instead of .babelrc static configuration file

## License

`react-internal-editor` is available under the MIT License