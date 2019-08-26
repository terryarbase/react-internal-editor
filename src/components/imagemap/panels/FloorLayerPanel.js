import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import i18n from 'i18next';

import { List } from 'antd';
import Tooltip from '@material-ui/core/Tooltip';

import Icon from '../../icon/Icon';
import Scrollbar from '../..//common/Scrollbar';
import { FlexBox, FlexItem } from '../../flex';

class FloorLayerPanel extends Component {
    static propTypes = {
        canvasRef: PropTypes.any,
        floorList: PropTypes.array,
        onFloorSelect: PropTypes.func,
        source: PropTypes.object,
    }

    onFloorSelect = (selected, item) => {
        if (selected) {
            return null;
        }

        this.props.onFloorSelect(item);
    }

    renderFloorLayer = () => {
        const {
            floorList,
            source,
            onFloorSelect,
        } = this.props;
        // console.log(source, floorList);
        return _.map(floorList, (fl, idx) => {
            let styles = [
                'rde-editor-floorpanel-container-item',
            ];
            let selected = fl._id === source._id;
            const top = (idx * 10) + (30 * idx);
            const zIndex = floorList.length - idx;
            if (selected) {
                styles = [
                    ...styles,
                    'selected',
                ];
            }
            return (
                <Tooltip key={idx} title={fl.name}>
                    <div
                        className={styles.join(' ')}
                        style={{
                            top,
                            zIndex,
                        }}
                        onClick={() => this.onFloorSelect(selected, fl)}
                    >
                        <div className="rde-editor-floorpanel-container-item-wrapper">
                            {
                                selected && <Icon name="eye" />
                            }
                        </div>
                    </div>
                </Tooltip>
            );
        });
    }

    renderEmptyList = () => {
        return (
            <FlexBox
                justifyContent="center"
                alignItems="center"
                style={{ width: '100%', height: '100%', color: 'rgba(0, 0, 0, 0.45)', fontSie: 16, padding: 16 }}
            >
                <List />
            </FlexBox>
        );
    }

    render() {
        return (
            <Scrollbar>
                {
                    this.props.floorList && this.props.floorList.length ? 
                    <FlexBox style={{ height: '100%', paddingBottom: '60px' }} flexDirection="column">
                        <h2 className="rde-editor-floorpanel-title">
                            {i18n.t('title.floor')}
                        </h2>
                        <div className="rde-editor-floorpanel-container">
                            {this.renderFloorLayer()}
                        </div>
                    </FlexBox> : this.renderEmptyList()
                }
                
            </Scrollbar>
        );
    }
}

export default FloorLayerPanel;
