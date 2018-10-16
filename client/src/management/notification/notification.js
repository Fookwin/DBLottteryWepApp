import React, { Component } from "react";
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd';
import AipHelper from '../management-provider'

const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;

class Notification extends Component {

    constructor(props) {
        super(props);

        this.state = {
            templates: [],
            templates_status: "Loading templates ...",
            templates_disabled: true
        };

        this.queryTemplates();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);

                AipHelper.notify(values, (res) => {
                    console.log(res);
                    alert(res);
                })
            }
        });
    }

    queryTemplates = (e) => {
        AipHelper.getNotificationTemplates(temps => {
            if (temps) {
                this.setState({
                    templates: temps,
                    templates_status: "Select an existing template.",
                    templates_disabled: false
                });
            }
        });
    }

    handleProvinceChange = (e) => {
        let temp = this.state.templates.find(temp => temp.Key === e);
        if (temp) {
            this.props.form.setFieldsValue({
                title: temp.Value.Title,
                message: temp.Value.Content
            });
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };

        return (
            <Form style={{ padding: 10 }} onSubmit={this.handleSubmit}>

                <FormItem {...formItemLayout} label="Template">
                    <Select onChange={this.handleProvinceChange} placeholder={ this.state.templates_status } disabled={this.state.templates_disabled}>
                        {
                            this.state.templates.map(temp => <Option key={temp.Key} value={temp.Key}>{temp.Key}</Option>)
                        }
                    </Select>
                </FormItem>

                <FormItem {...formItemLayout} label="Title">
                    {
                        getFieldDecorator('title', {
                            rules: [{ required: true, message: 'Please input the title!' }]
                        })(
                            <Input placeholder="Title" />
                        )
                    }
                </FormItem>
                <FormItem {...formItemLayout} label="Message">
                    {
                        getFieldDecorator('message', {
                            rules: [{ required: true, message: 'Please input the message!' }]
                        })(
                            <TextArea placeholder="Message" />
                        )
                    }
                </FormItem>

                <Button type="primary" htmlType="submit">Notify</Button>

            </Form>
        );
    }
};

const NotificationForm = Form.create()(Notification);
export default NotificationForm;