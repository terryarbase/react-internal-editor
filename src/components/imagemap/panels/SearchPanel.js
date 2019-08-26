import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Input } from 'antd';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { withStyles } from '@material-ui/core/styles';

import Icon from '../../icon/Icon';

import request from '../../../utils/request';

const SearchPanelStyles = () => ({
    
});

class SearchPanel extends Component {
    constructor(props) {
        super(props);
        this.targetField = '_id';
        this.displayField = 'name';
        this.state = {
            loading: false,
            list: [],
            keyword: null,
        };
        this.timer = null;
        const funcs = [
            'fetchList',
            'onSelect',
            'renderList',
            'onChange',
            'renderMenu',
        ];
        _.forEach(funcs, func => this[func] = this[func].bind(this));
    }

    componentWillMount() {
        this.fetchList();
    }

    onChange({ target: { value } }) {
        if (!this.timer) {
            this.fetchList();
            // wait for 3 second until end of keyword input
            this.timer = setInterval(() => {
                this.fetchList();
            }, 3000);
        }
        this.setState({
            keyword: value,
        })
    }

    fetchList() {
        this.setState({
            loading: true,
        });
        // start request call
        const {
            endpoint,
        } = this.props;
        let option = {
            ...endpoint,
        };
        const {
            keyword,
        } = this.state;
        if (keyword) {
            option = {
                ...option,
                data: {
                    ...option.data,
                    keyword,
                },
            };
        }
        request.get(option).then(response => {
        // request.post(endpoint.url, option).then(response => {
            if (response.data) {
                this.setState({
                    list: response.data.data,
                });
            }
        }).catch(err => {
            window.console.error(err);
            if (endpoint.onError) {
                endpoint.onError(err);
            }
        }).finally(() => {
            this.setState({
                loading: false,
            });
            clearInterval(this.timer);
            this.timer = null;
        });
    
    }

    onSelect(item, wasSelected) {
        const {
            onSelect,
            onClose,
            multi,
            fullset,
        } = this.props;
        let selected = item[this.targetField];
        if (multi) {
            selected = this.props.selected || [];
            // remove if was selected
            if (wasSelected) {
                selected = _.filter(selected, s => s !== item[this.targetField]);
            // append to the 
            } else {
                selected = [
                    ...selected,
                    item[this.targetField],
                ];
            }
        } else if (fullset) {
            selected = item;
        }
        // console.log(item, item[this.targetField]);
        onSelect(selected);
        if (onClose) {
            onClose();
        }
    }

    isSelected(selected, item) {
        let selectedItems = selected;
        if (!_.isArray(selected) && selected) {
            selectedItems = [ selected ];
        }
        return _.includes(selectedItems, item[this.targetField]);
    }

    renderMenu() {
        const {
            list,
        } = this.state;
        const {
            mapCheckmark,
            checkmarks={},
            selected: currentSelected,
        } = this.props;
        // console.log('>>>>>> ', this.props);
        return (
            <MenuList>
                {
                    _.map(list, (l, idx) => {
                        const isSelected = this.isSelected(currentSelected, l);
                        return (
                            <MenuItem
                                selected={isSelected}
                                key={idx}
                                onClick={() => this.onSelect(l, isSelected)}
                            >
                                <div>{l[this.displayField]}</div>
                                {
                                    !mapCheckmark && isSelected && <Icon name="check-circle" />
                                }
                                {
                                    mapCheckmark && !checkmarks[l._id] && <Icon name="download" />
                                }
                            </MenuItem>
                        );
                    })
                }
            </MenuList>
        );
    }

    renderList() {
        if (this.props.popMode) {
            return (
                <ClickAwayListener onClickAway={this.props.onClose}>
                    {
                        this.renderMenu()
                    }
                </ClickAwayListener>
            );
        }
        return this.renderMenu();
    }

    renderBody = () => {
        const {
            title,
            listMode,
            inlineMode,
            multi,
            noSearch,
            selected=[],
        } = this.props;
        let titleClassname = 'list-mode';
        let listClassname = ['rde-editor-searchpanel-container-list'];
        if (inlineMode) {
            titleClassname = 'inline-mode';
            listClassname = [
                ...listClassname,
                'inline-mode',
            ];
        }

        return (
            <div>
                {
                    title && <h2 className={titleClassname}>
                        {title}
                        {
                            multi && ` (${selected.length})`
                        }
                    </h2>
                }
                {
                    !listMode && !noSearch && <div className="rde-editor-searchpanel-container-input">
                        <Input
                            placeholder={this.props.placeholder}
                            className="rde-editor-searchpanel-input"
                            onChange={this.onChange}
                        />
                    </div>
                }
                <div className={listClassname.join(' ')}>
                    {
                        this.state.loading ? <CircularProgress className='rde-editor-searchpanel-container-loader' /> : this.renderList()
                    }
                </div>
            </div>
        );
    }

    render() {
        const {
            inlineMode,
        } = this.props;

        if (!inlineMode) {
            return (
                <Paper id="menu-list-grow" className="rde-editor-searchpanel-container list">
                    {this.renderBody()}
                </Paper>
            );
        }

        return (
            <div className="rde-editor-searchpanel-container inline">
                {
                    this.renderBody()
                }
            </div>
        );
    }
}

export default withStyles(SearchPanelStyles)(SearchPanel);
