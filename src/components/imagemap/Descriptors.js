const descriptors = {
	"TEXT": [
		{
			"name": "Text",
			"description": "",
            "localeKey": "text",
			"type": "text",
			"icon": {
                "prefix": "fas",
                "name": "font"
            },
            "option": {
                "type": "textbox",
                "text": "",
                "width": 60,
                "height": 30,
                "fontSize": 32,
                "name": "New text"
            }
		}
	],
	"SHAPE": [
		{
			"name": "Triangle",
			"description": "",
			"type": "shape",
            "localeKey": "triangle",
			"icon": {
                "prefix": "fas",
                "name": "play",
                "style": {
                    "transform": "rotate(270deg)"
                }
            },
            "option": {
                "type": "triangle",
                "width": 30,
                "height": 30,
                "name": "New shape"
            }
        },
        {
			"name": "Rectangle",
			"description": "",
            "localeKey": "rectangle",
			"type": "shape",
			"icon": {
                "prefix": "fas",
                "name": "stop"
            },
            "option": {
                "type": "rect",
                "width": 40,
                "height": 40,
                "name": "New shape"
            }
        },
        {
			"name": "Circle",
			"description": "",
            "localeKey": "circle",
			"type": "shape",
			"icon": {
                "prefix": "fas",
                "name": "circle"
            },
            "option": {
                "type": "circle",
                "radius": 30,
                "name": "New shape"
            }
		}
	],
	"DRAWING": [
		{
			"name": "Polygon",
			"description": "",
			"type": "drawing",
            "localeKey": "polygon",
			"icon": {
                "prefix": "fas",
                "name": "draw-polygon"
            },
            "option": {
                "type": "polygon",
                "name": "New polygon"
            }
        },
        {
            "name": "Line",
            "description": "",
            "localeKey": "line",
            "type": "drawing",
			"icon": {
                "prefix": "fas",
                "name": "minus"
            },
            "option": {
                "type": "line",
                "name": "New line"
            }
        },
        {
            "name": "Arrow",
            "description": "",
            "localeKey": "arrow",
            "type": "drawing",
			"icon": {
                "prefix": "fas",
                "name": "long-arrow-alt-right"
            },
            "option": {
                "type": "arrow",
                "name": "New arrow"
            }
        }
	],
    "DORMER": [
        {
            "name": "Dormer",
            "description": "",
            "localeKey": "dormer",
            "type": "image",
            "icon": {
                "prefix": "fab",
                "name": "codepen"
            },
            "option": {
                "type": "image",
                "ignored": true,
                "width": 350,
                "height": 120,
                "name": "New Comparsion Pane",
                "src": "data:image/png;base64,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"
            },
            "hideMenu": true
        }
    ],
    "LINKAREA": [
        {
            "name": "Linkarea",
            "description": "",
            "localeKey": "linkarea",
            "type": "dom_element",
            "icon": {
                "prefix": "fas",
                "name": "sticky-note"
            },
            "option": {
                "type": "element",
                "lockScalingX": true,
                "lockScalingY": true,
                "lockRotation": true,
                "hasControls": false,
                "width": 0,
                "height": 0,
                "title": "",
                "description": "",
                "code": {
                    "html": "<div class=\"area\" style=\"{{__styleMode__}}\">\n  <div class=\"title\">{{__tlabel__}} {{__title__}}</div>\n  <div class=\"desc\">\n  {{__desc__}}\n  </div>\n  <div class=\"link\">\n    <div class=\"edit_evt\">{{__editlabel__}}</div>\n  <div class=\"view_evt\" style=\"display: {{__viewMode__}}\">{{__linklabel__}}</div>  \n</div>\n</div>",
                    "css": ".area {\n  position: relative;\n  width: 310px;\n  height: auto;\n  background: #fff;\n  border-radius: 5px;\n  padding: 15px;\n  border: 1px solid #f5f5f5;\n}\n.area .title{\n  text-align: left;\n  text-transform: uppercase;\n  margin: 0 0 10px 0;\n  font-weight: bolder;\n  font-size: 18px;\n}\n.area .desc{\n  word-break: break-word;\n  text-align: left;\n    color: #666666;\n}\n.area .link{\n  color: #1650ad;\n  text-align: right;\n  margin-top: 10px;\n  cursor: pointer;\n}\n.area .link div {\n    display: inline-block;\n    margin-left: 10px;\n}\n.area::before,\n.area::after {\n  content: '';\n  position: absolute;\n  bottom: 10px;\n  width: 40%;\n  height: 10px;\n  box-shadow: 0 5px 14px rgba(0,0,0,.9);\n  z-index: -1;\n  transition: all .3s ease-in-out;\n}\n.area::before {\n  left: 15px;\n  transform: skew(-5deg) rotate(-5deg);\n}\n.area::after {\n  right: 15px;\n  transform: skew(5deg) rotate(5deg);\n}\n",
                    "js": ""
                },
                "name": "New Shortcut Link"
            },
            "hideMenu": true
        }
    ]
}

export default descriptors;
