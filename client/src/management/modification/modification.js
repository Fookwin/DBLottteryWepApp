import React, { Component } from "react";
import { Form, Input, Icon, Row, Col, Button, DatePicker, TimePicker, Modal, Spin } from 'antd';
import moment from 'moment';
import { isArray } from "util";
import AipHelper from '../management-provider'

const { TextArea } = Input;
const FormItem = Form.Item;
const time_format = 'HH:mm';
const ButtonGroup = Button.Group;

const bonous = [1, 2, 3, 4, 5, 6];
const versions = [
    ["latestIssue", "最新期号"],
    ["latestLotteryVersion", "最新开奖"],
    ["releaseDataVersion", "发布数据"],
    ["historyDataVersion", "历史数据"],
    ["attributeDataVersion", "属性数据"],
    ["attributeTemplateVersion", "属性模板"],
    ["helpContentVersion", "帮助文档"],
    ["matrixDataVersion", "旋转矩阵"]
];

const recommandationCategories = [
    ["blueExcludes", "蓝杀"],
    ["blueIncludes", "蓝胆"],
    ["redExcludes", "红杀"],
    ["redIncludes", "红胆"]
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
        let number = parseInt(value, 10);
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
        let number = parseInt(value, 10);
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
                        <Input type="number" placeholder="期号" addonBefore="期号" value={this.state.issue} onChange={(e) => this.handleStringChange("issue", e.target.value)} />
                    </Col>
                    <Col span={12}>
                        <DatePicker placeholder="开奖时间" value={moment(this.state.date)} onChange={(e) => this.handleDateChange("date", e)} />
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={20}>
                        <Input addonBefore="奖号" placeholder="00 00 00 00 00 00+00" value={this.state.scheme}
                            onChange={(e) => this.handleStringChange("scheme", e.target.value)}
                        />
                    </Col>
                    <Col span={4}>
                        <Button><Icon type="check" /></Button>
                    </Col>
                </Row>
                <Input type="number" addonBefore="奖池" placeholder="奖池" value={this.state.pool} onChange={(e) => this.handleNumberChange("pool", e.target.value)} />
                <Input type="number" addonBefore="销售" placeholder="销售" value={this.state.bet} onChange={(e) => this.handleNumberChange("bet", e.target.value)} />
                奖金分布：
                {
                    bonous.map((index) =>
                        <Row key={"row" + index} gutter={8}>
                            <Col span={12}>
                                <Input type="number" value={this.state.bonus[(index - 1) * 2]} addonBefore={"数量" + index}
                                    onChange={(e) => this.handleBonuChange((index - 1) * 2, e.target.value)}
                                />
                            </Col>
                            <Col span={12}>
                                <Input type="number" value={this.state.bonus[(index - 1) * 2 + 1]} addonBefore={"奖金" + index}
                                    onChange={(e) => this.handleBonuChange((index - 1) * 2 + 1, e.target.value)}
                                />
                            </Col>
                        </Row>
                    )
                }
                开奖详情:
                <TextArea placeholder="详情" value={this.state.details} onChange={(e) => this.handleStringChange("details", e.target.value)} />
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
        let number = parseInt(value, 10);
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
                    versions.map((version) =>
                        <Input type="number" key={version[0]}
                            addonBefore={version[1]} value={this.state[version[0]]}
                            onChange={(e) => this.handleNumberChange(version[0], e.target.value)}
                        />
                    )
                }
            </div>
        );
    }
}

class LottoNextInfo extends React.Component {
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
            "cutOffTime": value.cutOffTime,
            "date": value.date,
            "issue": value.issue
        };
    }

    handleStringChange = (vname, strVal) => {

        let changedValue = {};
        changedValue[vname] = strVal;

        if (!('value' in this.props)) {
            this.setState(changedValue);
        }

        this.triggerChange(changedValue);
    }

    handleTimeChange = (vname, time) => {

        if (!time || !time.isValid()) {
            return;
        }

        let preDate = moment(this.state[vname]);
        preDate.set({
            'hour': time.get('hour'),
            'minute': time.get('minute')
        });

        let changedValue = {};
        changedValue[vname] = preDate._d;

        if (!('value' in this.props)) {
            this.setState(changedValue);
        }

        this.triggerChange(changedValue);
    }

    handleDateChange = (date) => {

        if (!date || !date.isValid()) {
            return;
        }

        // need to change both date and cutoff
        let newDate = moment(this.state.date).set({
            'year': date.year(),
            'month': date.month(),
            'date': date.date()
        });

        let newCutoff = moment(this.state.cutOffTime).set({
            'year': date.year(),
            'month': date.month(),
            'date': date.date()
        });

        let changedValue = {
            'date': newDate._d,
            'cutOffTime': newCutoff._d
        };

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
                        <Input type="number" placeholder="期号" addonBefore="期号" value={this.state.issue} onChange={(e) => this.handleStringChange("issue", e.target.value)} />
                    </Col>
                    <Col span={12}>
                        <DatePicker placeholder="开奖时间" value={moment(this.state.date)} onChange={(e) => this.handleDateChange(e)} />
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={12}>
                        截止:<TimePicker value={moment(this.state.cutOffTime)} format={time_format} onChange={(e) => this.handleTimeChange("cutOffTime", e)} />
                    </Col>
                    <Col span={12}>
                        开奖:<TimePicker value={moment(this.state.date)} format={time_format} onChange={(e) => this.handleTimeChange("date", e)} />
                    </Col>
                </Row>
            </div >
        );
    }
}

class LottoRecommendation extends React.Component {
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
            "blueExcludes": value.blueExcludes || [],
            "blueIncludes": value.blueIncludes || [],
            "redExcludes": value.redExcludes || [],
            "redIncludes": value.redIncludes || []
        };
    }

    handleNubmerArrayChange = (vname, strVal) => {

        try {
            let arrayVal = JSON.parse("[" + strVal + "]");
            if (!isArray(arrayVal))
                return;

            let changedValue = {};
            changedValue[vname] = arrayVal;

            if (!('value' in this.props)) {
                this.setState(changedValue);
            }

            this.triggerChange(changedValue);
        }
        catch (ex) {

        }
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
                    recommandationCategories.map((cat) =>
                        <Input key={cat[0]}
                            addonBefore={cat[1]} value={this.state[cat[0]]}
                            onChange={(e) => this.handleNubmerArrayChange(cat[0], e.target.value)}
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
            lotterReleaseInfo: {},
            showConfirmDialog: false,
            loading: true,
            lottoDataLoaded: false
        };

        // query new release
        this.onResync();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);

                this.setState({ showConfirmDialog: true });
            }
        });
    }

    handleConfirmSubmit = () => {
        this.setState({ showConfirmDialog: false });
        // AipHelper.notify(values, (res) => {
        //     console.log(res);
        //     alert(res);
        // })
    }

    handleCancelSubmit = () => {
        this.setState({ showConfirmDialog: false });
    }

    _refrshFields = (data) => {
        this.props.form.setFieldsValue({
            lottery: data.lottery,
            next: data.next,
            recommendation: data.recommendation,
            dataVersion: data.dataVersion
        });
    }

    onResync = (e) => {
        this.setState({ loading: true });
        AipHelper.getLatestIssueInfo(info => {
            if (info) {
                this.setState({ lotterReleaseInfo: info, lottoDataLoaded: true });
                this._refrshFields(info);
            }
            this.setState({ loading: false });
        });
    }

    onSyncToWeb = (e) => {
        if (!this.state.lotterReleaseInfo || !this.state.lotterReleaseInfo.lottery.issue)
            return;

        this.setState({ loading: true });
        AipHelper.syncLottoDetailFromWeb(this.state.lotterReleaseInfo.lottery.issue, info => {
            if (info) {
                this.setState({ lotterReleaseInfo: info });
                this._refrshFields(info);
            }
            this.setState({ loading: false });
        });
    }

    onCreateNewRelease = (e) => {
        
        this.setState({ loading: true });
        AipHelper.createNewLottoRelease({
            issue: this.state.lotterReleaseInfo.next.issue,
            date: this.state.lotterReleaseInfo.next.date
        }, (info) => {
            if (info) {
                this.setState({ lotterReleaseInfo: info, lottoDataLoaded: true });
                this._refrshFields(info);
            }
            this.setState({ loading: false });
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
            <Spin spinning={this.state.loading} size="large">
                <Form style={{ padding: 10 }} onSubmit={this.handleSubmit}>
                    <ButtonGroup>
                        <Button icon="sync" onClick={this.onResync}></Button>
                        <Button icon="form" disabled={!this.state.lottoDataLoaded} onClick={this.onSyncToWeb}></Button>
                        <Button icon="plus" onClick={this.onCreateNewRelease}></Button>
                    </ButtonGroup>
                    <FormItem {...formItemLayout} label="当期">
                        {
                            getFieldDecorator("lottery", {
                                initialValue: this.state.lotterReleaseInfo.lottery,
                                rules: [{ required: true, message: 'Please input the lottery!' }]
                            })(
                                <LottoDetail />
                            )
                        }
                    </FormItem>
                    <FormItem {...formItemLayout} label="推荐">
                        {
                            getFieldDecorator("recommendation", {
                                initialValue: this.state.lotterReleaseInfo.recommendation,
                                rules: [{ required: true, message: 'Please input the recommendation!' }]
                            })(
                                <LottoRecommendation />
                            )
                        }
                    </FormItem>
                    <FormItem {...formItemLayout} label="下期">
                        {
                            getFieldDecorator("next", {
                                initialValue: this.state.lotterReleaseInfo.next,
                                rules: [{ required: true, message: 'Please input the next release info!' }]
                            })(
                                <LottoNextInfo />
                            )
                        }
                    </FormItem>
                    <FormItem {...formItemLayout} label="版本">
                        {
                            getFieldDecorator("dataVersion", {
                                initialValue: this.state.lotterReleaseInfo.dataVersion,
                                rules: [{ required: true, message: 'Please input the version!' }]
                            })(
                                <LottoVersions />
                            )
                        }
                    </FormItem>
                    <Button type="primary" htmlType="submit">Notify</Button>
                    <Modal
                        title="Confirm the infomration"
                        visible={this.state.showConfirmDialog}
                        onOk={this.handleConfirmSubmit}
                        onCancel={this.handleCancelSubmit}
                    >
                        <p>期号：{this.state.lotterReleaseInfo.lottery ? this.state.lotterReleaseInfo.lottery.issue : ""} </p>
                        <p>日期：{this.state.lotterReleaseInfo.lottery ? this.state.lotterReleaseInfo.lottery.date : ""} </p>
                        <p>奖号：{this.state.lotterReleaseInfo.lottery ? this.state.lotterReleaseInfo.lottery.scheme : ""} </p>
                    </Modal>
                </Form>
            </Spin>
        );
    }
};

const ModificationForm = Form.create()(Modification);
export default ModificationForm;