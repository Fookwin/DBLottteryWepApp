import React, { Component } from "react";
import { Form, Select, Avatar, Button, Modal, List, Tooltip } from 'antd';
import AipHelper from './management-provider'

const FormItem = Form.Item;
const Option = Select.Option;

class Users extends Component {

    constructor(props) {
        super(props);

        this.state = {
            Platforms: [
                { name: 'Windows Store', index: '1' },
                { name: 'Windows Phone', index: '2' },
                { name: 'Android', index: '3' }
            ],
            Periods: [
                { name: 'One Day', scope: '1' },
                { name: 'One Week', scope: '7' },
                { name: 'One Month', scope: '30' }
            ],
            SelectedPlatform: null,
            SelectedPeriod: null,
            UserList: []
        };
    }

    handleSubmit = (e) => {
        e.preventDefault();
        AipHelper.getUsers(this.state.SelectedPlatform.index, this.state.SelectedPeriod.scope, (res) => {
            console.log(res);

            if (res) {
                this.setState({
                    UserList: res
                });
            }
        });
    }

    handlePlatformChange = (e) => {
        let platform = this.state.Platforms.find(pf => pf.name === e);
        if (platform) {
            this.setState({
                SelectedPlatform: platform
            });
        }
    }

    handlePeriodChange = (e) => {
        let period = this.state.Periods.find(pd => pd.name === e);
        if (period) {
            this.setState({
                SelectedPeriod: period
            });
        }
    }

    clearResult = (e) => {
        this.setState({
            UserList: []
        });
    }

    render() {
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

                <FormItem {...formItemLayout} label="Platform">
                    <Select onChange={this.handlePlatformChange}>
                        {
                            this.state.Platforms.map(pf => <Option key={pf.index} value={pf.name}>{pf.name}</Option>)
                        }
                    </Select>
                </FormItem>

                <FormItem {...formItemLayout} label="Period">
                    <Select onChange={this.handlePeriodChange}>
                        {
                            this.state.Periods.map(pd => <Option key={pd.name} value={pd.name}>{pd.name}</Option>)
                        }
                    </Select>
                </FormItem>

                <Button type="primary" htmlType="submit" disabled={!this.state.SelectedPeriod || !this.state.SelectedPlatform} >List</Button>
                <Modal
                    title={"" + this.state.UserList.length + " Users"}
                    visible={this.state.UserList && this.state.UserList.length > 0}
                    onOk={this.clearResult}
                    onCancel={this.clearResult}
                >
                    <List
                        grid={{ gutter: 16, column: 1 }}
                        dataSource={this.state.UserList}
                        renderItem={user => (
                            <List.Item >
                                <List.Item.Meta
                                    avatar={<Tooltip title={user.DeviceId}><Avatar style={{ backgroundColor: '#87d068' }} icon="user" /></Tooltip>}
                                    title={<p > At: {user.LastLogin} </p>}
                                    description={<p > Client: {user.ClientVersion}</p>}
                                />
                            </List.Item>
                        )} />
                </Modal>
            </Form >
        );
    }
};

const UsersForm = Form.create()(Users);
export default UsersForm;