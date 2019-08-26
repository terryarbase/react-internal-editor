import React from 'react';
import { Form, Input, Col, Row } from 'antd';
import i18n from 'i18next';

export default {
    render(canvasRef, form, data) {
        // console.log(form);
        const { getFieldDecorator } = form;
        return (
            <React.Fragment>
                <Form.Item label={i18n.t('common.title')} colon={false}>
                    {
                        getFieldDecorator('title', {
                            initialValue: data.title || '',
          
                        })(
                            <Input />,
                        )
                    }
                </Form.Item>
                <Form.Item label={i18n.t('common.description')} colon={false}>
                    {
                        getFieldDecorator('description', {
                            initialValue: data.description || '',
              
                        })(
                            <Input.TextArea autosize={{ minRows: 2, maxRows: 6 }} />,
                        )
                    }
                </Form.Item>
            </React.Fragment>
        );
    },
};
