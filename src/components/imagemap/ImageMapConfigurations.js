import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18n from 'i18next';
import _ from 'lodash';
import { Tabs } from 'antd';
import classnames from 'classnames';

import NodeProperties from './properties/NodeProperties';
import MapProperties from './properties/MapProperties';
import Animations from './animations/Animations';
import FloorLayerPanel from './panels/FloorLayerPanel';
import CanvasList from '../canvas/CanvasList';
import Styles from './styles/Styles';
import DataSources from './datasources/DataSources';
import Icon from '../icon/Icon';
import CommonButton from '../common/CommonButton';

import PropertyDefinition from './properties/PropertyDefinition';

import SearchPanel from './panels/SearchPanel';

class ImageMapConfigurations extends Component {
    static propTypes = {
        canvasRef: PropTypes.any,
        selectedItem: PropTypes.object,
        onChange: PropTypes.func,
        onChangeAnimations: PropTypes.func,
        onChangeStyles: PropTypes.func,
        onChangeDataSources: PropTypes.func,
        animations: PropTypes.array,
        styles: PropTypes.array,
        dataSources: PropTypes.array,
    }

    state = {
        // activeKey: 'layer',
        // collapse: this.props.propertyCollapse,
    }

    handlers = {
        onChangeTab: (activeKey) => {
            this.setState({
                activeKey,
            });
        },
        // onCollapse: () => {
        //     this.setState({
        //         collapse: !this.state.collapse,
        //     });
        // },
    }

    componentWillReceiveProps({ propertyKey }) {
        // if (propertyKey && propertyKey !== this.props.propertyKey) {
        //     this.setState({
        //         activeKey: propertyKey,
        //     });
        // }
        // const {
        //     propertyCollapse: currentPropertyCollapse,
        // } = this.props;
        // if (this.props.propertyCollapse && propertyCollapse !== this.props.propertyCollapse) {
        //     this.setState({
        //         collapse: propertyCollapse,
        //     });
        // }
    }

    render() {
        const {
            onChange,
            selectedItem,
            canvasRef,
            animations,
            styles,
            dataSources,
            onChangeAnimations,
            onChangeStyles,
            onChangeDataSources,
            readOnly,
            onDownload,
            collapseAll,
            onPropertiesPanel,
            onUserAssignment,
            groupAssignmentEndpoint,
            userAssignmentEndpoint,
            areaListEndpoint,
            onGroupAssignment,
            propertyCollapse,
            propertyKey,
            switchProperties,
            isMultiSelected,
            onAreaShortcut,
            source,
            floorList,
            noSearch,
        } = this.props;
        // const { onChangeTab, onCollapse } = this.handlers;
        const className = classnames('rde-editor-configurations', {
            minimize: !propertyCollapse,
        });
        // if (selectedItem) {
        //     console.log(selectedItem.shortcut);
        // }
        return (
            <div>
                {
                    (!propertyCollapse || collapseAll) && <CommonButton
                        className="rde-action-btn"
                        shape="circle"
                        icon={'angle-double-right'}
                        onClick={onPropertiesPanel}
                        style={{ position: 'fixed', top: 7, left: 10, zIndex: 5, backgroundColor: '#e1e5e5' }}
                    />
                }
                <div className={className}>
                    <CommonButton
                        className="rde-action-btn"
                        shape="circle"
                        icon={'angle-double-left'}
                        onClick={onPropertiesPanel}
                        style={{ position: 'fixed', top: 7, left: 347, zIndex: 1000 }}
                    />
                    <Tabs
                        tabPosition="right"
                        style={{ height: '100%' }}
                        activeKey={propertyKey || 'layer'}
                        onChange={switchProperties}
                        tabBarStyle={{ marginTop: 60 }}
                    >

                        <Tabs.TabPane tab={<Icon name="solar-panel" />} key="layer">
                            <CanvasList readOnly={readOnly} canvasRef={canvasRef} selectedItem={selectedItem} />
                        </Tabs.TabPane>
                        {
                            floorList && floorList.length && <Tabs.TabPane tab={<Icon name="layer-group" />} key="floor">
                                <FloorLayerPanel
                                    canvasRef={canvasRef}
                                    source={source}
                                    floorList={floorList}
                                    onFloorSelect={this.props.onFloorSelect}
                                />
                            </Tabs.TabPane>
                        }
                        {
                            !readOnly && !!selectedItem && !!_.keys(PropertyDefinition[selectedItem.type]).length && <Tabs.TabPane tab={<Icon name="cogs" />} key="node">
                                <NodeProperties onChange={onChange} selectedItem={selectedItem} canvasRef={canvasRef} />
                            </Tabs.TabPane>
                        }
                        {
                            !!selectedItem && !isMultiSelected && <Tabs.TabPane tab={<Icon name="users" />} key="group">
                                <SearchPanel 
                                    title={i18n.t('title.groupAssignment')}
                                    placeholder={i18n.t('placeholder.group')}
                                    endpoint={groupAssignmentEndpoint}
                                    onSelect={onGroupAssignment}
                                    selected={selectedItem.groupAssignment}
                                    inlineMode
                                    multi={!groupAssignmentEndpoint.singleSelection}
                                />
                            </Tabs.TabPane>
                        }
                        {
                            !!selectedItem && !isMultiSelected && <Tabs.TabPane tab={<Icon name="user" />} key="user">
                                <SearchPanel 
                                    title={i18n.t('title.userAssignment')}
                                    placeholder={i18n.t('placeholder.individual')}
                                    endpoint={userAssignmentEndpoint}
                                    onSelect={onUserAssignment}
                                    selected={selectedItem.individualAssignment}
                                    inlineMode
                                    multi={!userAssignmentEndpoint.singleSelection}
                                />
                            </Tabs.TabPane>
                        }
                        {
                            !!selectedItem && !isMultiSelected && selectedItem.areaMode && <Tabs.TabPane tab={<Icon name="sticky-note" />} key="shortcut">
                                <SearchPanel 
                                    title={i18n.t('title.areaShortcut')}
                                    noSearch
                                    endpoint={areaListEndpoint}
                                    onSelect={onAreaShortcut}
                                    selected={selectedItem.shortcut}
                                    inlineMode
                                />
                            </Tabs.TabPane>
                        }
                    </Tabs>
                </div>
            </div>
        );
    }
}

export default ImageMapConfigurations;
