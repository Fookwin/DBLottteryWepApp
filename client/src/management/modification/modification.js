import React, { Component } from "react";
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete, DatePicker, TimePicker, InputNumber } from 'antd';
import moment from 'moment';
import AipHelper from '../management-provider'
import { FormComponentProps } from 'antd/lib/form';

const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;
const { MonthPicker } = DatePicker;
const time_format = 'HH:mm';


const testData = {
    "dataVersion": {
        "attributeDataVersion": 1,
        "attributeTemplateVersion": 2,
        "helpContentVersion": 1,
        "historyDataVersion": 8,
        "latestIssue": 2018124,
        "latestLotteryVersion": 3,
        "matrixDataVersion": 2,
        "releaseDataVersion": 1
    },
    "lottery": {
        "bet": 378069006,
        "bonus": [
            4,
            9291791,
            127,
            168968,
            1887,
            3000,
            89987,
            200,
            1604786,
            10,
            11942343,
            5
        ],
        "date": "2018-10-23 00:00:00",
        "details": "出球顺序：091322191425+02。本期一等奖中奖地：山东1注湖南1注广东1注青海1注。",
        "issue": 2018124,
        "pool": 894677451,
        "scheme": "09 13 14 19 22 25+02"
    },
    "next": {
        "cutOffTime": "2018-10-25 20:00:00",
        "date": "2018-10-25 21:15:00",
        "issue": 2018125
    },
    "recommendation": {
        "blueExcludes": [
            3,
            4,
            7
        ],
        "blueIncludes": [
            9
        ],
        "redExcludes": [
            3,
            7,
            9,
            15,
            30,
            31
        ],
        "redIncludes": [
            12,
            16
        ]
    }
};

const bonous = [1, 2, 3, 4, 5, 6];
const versions = [
    "attributeDataVersion",
    "attributeTemplateVersion",
    "helpContentVersion",
    "historyDataVersion",
    "latestIssue",
    "latestLotteryVersion",
    "matrixDataVersion",
    "releaseDataVersion"
];

class LottoDetail extends React.Component {
    static getDerivedStateFromProps(nextProps) {
        // Should be a controlled component.
        if ('value' in nextProps) {
            let newProps = {
                ...(nextProps.value || {}),
            };
            return newProps;
        }
        return null;
    }

    constructor(props) {
        super(props);

        const value = props.value || {};
        this.state = {
            "bet": value.bet,
            "bonus": value.bonus || [
                0,
                0,
                0,
                0,
                0,
                3000,
                0,
                200,
                0,
                10,
                0,
                5
            ],
            "date": value.date,
            "details": value.details,
            "issue": value.issue,
            "pool": value.pool,
            "scheme": value.scheme
        };
    }

    handleNumberChange = (vname, value) => {
        let number = parseInt(value);
        if (isNaN(number)) {
            return;
        }

        let changedValue = {};
        changedValue[vname] = number;

        if (!('value' in this.props)) {
            this.setState(changedValue);
        }

        this.triggerChange(changedValue);
    }

    handleBonuChange = (index, value) => {
        let number = parseInt(value);
        if (isNaN(number)) {
            return;
        }

        let bonus = [];
        bonus.push(...this.state.bonus);
        bonus[index] = number;

        let changedValue = { "bonus": bonus };

        if (!('value' in this.props)) {
            this.setState(changedValue);
        }

        this.triggerChange(changedValue);
    }

    handleDateChange = (vname, date) => {

        if (!date || !date._d) {
            return;
        }

        let changedValue = {};
        changedValue[vname] = date._d;

        if (!('value' in this.props)) {
            this.setState(changedValue);
        }

        this.triggerChange(changedValue);
    }

    handleStringChange = (vname, strVal) => {

        let changedValue = {};
        changedValue[vname] = strVal;

        if (!('value' in this.props)) {
            this.setState(changedValue);
        }

        this.triggerChange(changedValue);
    }

    triggerChange = (changedValue) => {
        // Should provide an event to pass value to Form.
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(Object.assign({}, this.state, changedValue));
        }
    }

    render() {

        return (
            <div>
                <Row gutter={8}>
                    <Col span={12}>
                        <Input type="number" placeholder="期号" addonBefore="期号" defaultValue={this.state.issue} onChange={(e) => this.handleStringChange("issue", e.target.value)} />
                    </Col>
                    <Col span={12}>
                        <DatePicker placeholder="开奖时间" defaultValue={moment(this.state.date)} onChange={(e) => this.handleDateChange("date", e)} />
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={20}>
                        <Input addonBefore="奖号" placeholder="00 00 00 00 00 00+00" defaultValue={this.state.scheme}
                            onChange={(e) => this.handleSchemeChange("scheme", e.target.value)}
                        />
                    </Col>
                    <Col span={4}>
                        <Button><Icon type="check" /></Button>
                    </Col>
                </Row>
                <Input type="number" addonBefore="奖池" placeholder="奖池" defaultValue={this.state.pool} onChange={(e) => this.handleNumberChange("pool", e.target.value)} />
                <Input type="number" addonBefore="销售" placeholder="销售" defaultValue={this.state.bet} onChange={(e) => this.handleNumberChange("bat", e.target.value)} />
                奖金分布：
                {
                    bonous.map((index) =>
                        <Row key={"row" + index} gutter={8}>
                            <Col span={12}>
                                <Input type="number" defaultValue={this.state.bonus[(index - 1) * 2]} addonBefore={"数量" + index}
                                    onChange={(e) => this.handleBonuChange((index - 1) * 2, e.target.value)}
                                />
                            </Col>
                            <Col span={12}>
                                <Input type="number" defaultValue={this.state.bonus[(index - 1) * 2 + 1]} addonBefore={"奖金" + index}
                                    onChange={(e) => this.handleBonuChange((index - 1) * 2 + 1, e.target.value)}
                                />
                            </Col>
                        </Row>
                    )
                }
                开奖详情:
                <TextArea placeholder="详情" defaultValue={this.state.details} onChange={(e) => this.handleStringChange("details", e.target.value)} />
            </div>
        );
    }
}

class LottoVersions extends React.Component {
    static getDerivedStateFromProps(nextProps) {
        // Should be a controlled component.
        if ('value' in nextProps) {
            let newProps = {
                ...(nextProps.value || {}),
            };
            return newProps;
        }
        return null;
    }

    constructor(props) {
        super(props);

        const value = props.value || {};
        this.state = {
            attributeDataVersion: value.attributeDataVersion || 0,
            attributeTemplateVersion: value.attributeTemplateVersion || 0,
            helpContentVersion: value.helpContentVersion || 0,
            historyDataVersion: value.historyDataVersion || 0,
            latestIssue: value.latestIssue || 0,
            latestLotteryVersion: value.latestLotteryVersion || 0,
            matrixDataVersion: value.matrixDataVersion || 0,
            releaseDataVersion: value.releaseDataVersion || 0
        };
    }

    handleNumberChange = (vname, value) => {
        let number = parseInt(value);
        if (isNaN(number)) {
            return;
        }

        let changedValue = {};
        changedValue[vname] = number;

        if (!('value' in this.props)) {
            this.setState(changedValue);
        }

        this.triggerChange(changedValue);
    }

    triggerChange = (changedValue) => {
        // Should provide an event to pass value to Form.
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(Object.assign({}, this.state, changedValue));
        }
    }

    render() {

        return (
            <div>
                {
                    versions.map((version_name) =>
                        <Input type="number" key={version_name}
                            addonBefore={version_name} defaultValue={this.state[version_name]}
                            onChange={(e) => this.handleNumberChange(version_name, e.target.value)}
                        />
                    )
                }
            </div>
        );
    }
}

class Modification extends Component {

    constructor(props) {
        super(props);

        this.state = {

        };

        //this.queryTemplates();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);

                // AipHelper.notify(values, (res) => {
                //     console.log(res);
                //     alert(res);
                // })
            }
        });
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

                <FormItem {...formItemLayout} label="当期">
                    {
                        getFieldDecorator("lottery", {
                            rules: [{ required: true, message: 'Please input the lottery!' }]
                        })(
                            <LottoDetail />
                        )
                    }
                </FormItem>
                <FormItem {...formItemLayout} label="下期">
                    <Row gutter={8}>
                        <Col span={12}>
                            {
                                getFieldDecorator('next_issue', {
                                    rules: [{ required: true, message: 'Please input the issue!' }]
                                })(
                                    <Input addonBefore="期号" placeholder="0" />
                                )
                            }
                        </Col>
                        <Col span={12}>
                            {
                                getFieldDecorator('next_date', {
                                    rules: [{ type: 'object', required: true, message: 'Please input the date!' }]
                                })(
                                    <DatePicker placeholder="0000/00/00" />
                                )
                            }
                        </Col>
                    </Row>
                    <Row gutter={8}>
                        <Col span={12}>
                            {
                                getFieldDecorator('next_cutoff_time', {
                                    rules: [{ required: true, message: 'Please input the cutoff time!' }]
                                })(
                                    <div>
                                        截止:<TimePicker defaultValue={moment('20:00', time_format)} format={time_format} />
                                    </div>
                                )
                            }
                        </Col>
                        <Col span={12}>
                            {
                                getFieldDecorator('next_release_time', {
                                    rules: [{ required: true, message: 'Please input the release time!' }]
                                })(
                                    <div>
                                        开奖:<TimePicker defaultValue={moment('21:15', time_format)} format={time_format} />
                                    </div>
                                )
                            }
                        </Col>
                    </Row>
                    {
                        getFieldDecorator('next_recommended_reds', {
                            rules: [{ required: true, message: 'Please input 红胆!' }]
                        })(
                            <Input addonBefore="红胆" placeholder="0" />
                        )
                    }
                    {
                        getFieldDecorator('next_killed_reds', {
                            rules: [{ required: true, message: 'Please input 红杀!' }]
                        })(
                            <Input addonBefore="红杀" placeholder="0" />
                        )
                    }
                    {
                        getFieldDecorator('next_recommended_blues', {
                            rules: [{ required: true, message: 'Please input 蓝胆!' }]
                        })(
                            <Input addonBefore="蓝胆" placeholder="0" />
                        )
                    }
                    {
                        getFieldDecorator('next_killed_blues', {
                            rules: [{ required: true, message: 'Please input 蓝杀!' }]
                        })(
                            <Input addonBefore="蓝杀" placeholder="0" />
                        )
                    }
                </FormItem>
                <FormItem {...formItemLayout} label="版本">
                    {
                        getFieldDecorator("dataVersion", {
                            rules: [{ required: true, message: 'Please input the version!' }]
                        })(
                            <LottoVersions />
                        )
                    }
                </FormItem>
                <Button type="primary" htmlType="submit">Notify</Button>

            </Form>
        );
    }
};

const ModificationForm = Form.create()(Modification);
export default ModificationForm;