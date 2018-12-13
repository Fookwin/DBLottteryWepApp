import React, { Component } from "react";
import { Form, Input, Row, Col, Button, DatePicker, TimePicker, Modal, Spin } from 'antd';
import moment from 'moment';
import { isArray } from "util";
import AipHelper from '../management-provider'

const { TextArea } = Input;
const FormItem = Form.Item;
const time_format = 'HH:mm';
const ButtonGroup = Button.Group;

const bonous = [1, 2, 3, 4, 5, 6];
const versions = [
    ["latestIssue", "当期期号"],
    ["latestLotteryVersion", "当期开奖"],
    ["releaseDataVersion", "当期信息"],
    ["attributeDataVersion", "当期属性"],
    ["historyDataVersion", "历史数据"],
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
        if (isNaN(number) || number < 0) {
            number = null;
        }

        let changedValue = {};
        changedValue[vname] = number;

        this.triggerChange(changedValue);
    }

    handleBonuChange = (index, value) => {
        let number = parseInt(value, 10);
        if (isNaN(number) || number < 0) {
            number = null;
        }

        let bonus = [];
        bonus.push(...this.state.bonus);
        bonus[index] = number;

        let changedValue = { "bonus": bonus };

        this.triggerChange(changedValue);
    }

    handleDateChange = (vname, date) => {

        if (!date || !date._d) {
            return;
        }

        let changedValue = {};
        changedValue[vname] = date.format('YYYY-MM-DD HH:mm:ss');

        this.triggerChange(changedValue);
    }

    handleSchemeChange = (vname, strVal) => {

        // format string
        let formatted = this._formatScheme(strVal);

        this.handleDetailsChange(vname, formatted);
    }

    handleDetailsChange = (vname, strVal) => {

        // format string
        let changedValue = {};
        changedValue[vname] = strVal;

        this.triggerChange(changedValue);
    }

    _formatScheme = (original) => {
        var copyText = original.trim();
        if (copyText.length === 14 && copyText.indexOf(' ') < 0) {
            var newText = copyText.slice(0, 2);
            for (var i = 1; i < 6; ++i) {
                newText += ' ' + copyText.slice(i * 2, i * 2 + 2);
            }

            newText += '+' + copyText.slice(12);

            return newText;
        }

        // trim the tail longer than 20
        if (copyText.length > 20)
            return copyText.substring(0, 20);

        return copyText;
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
                        <Input type="number" placeholder="期号" addonBefore="期号" value={this.state.issue} onChange={(e) => this.handleNumberChange("issue", e.target.value)} />
                    </Col>
                    <Col span={12}>
                        <DatePicker placeholder="开奖时间" value={moment(this.state.date)} onChange={(e) => this.handleDateChange("date", e)} />
                    </Col>
                </Row>
                <Input addonBefore="奖号" placeholder="00 00 00 00 00 00+00" value={this.state.scheme} onChange={(e) => this.handleSchemeChange("scheme", e.target.value)} />
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
                <TextArea placeholder="详情" value={this.state.details} onChange={(e) => this.handleDetailsChange("details", e.target.value)} />
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
            attributeDataVersion: value.attributeDataVersion,
            attributeTemplateVersion: value.attributeTemplateVersion,
            helpContentVersion: value.helpContentVersion,
            historyDataVersion: value.historyDataVersion,
            latestIssue: value.latestIssue,
            latestLotteryVersion: value.latestLotteryVersion,
            matrixDataVersion: value.matrixDataVersion,
            releaseDataVersion: value.releaseDataVersion
        };
    }

    handleNumberChange = (vname, value) => {
        let number = parseInt(value, 10);
        if (isNaN(number) || number < 0) {
            number = null;
        }

        let changedValue = {};
        changedValue[vname] = number;

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
        changedValue[vname] = preDate.format('YYYY-MM-DD HH:mm:ss');

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
            'date': newDate.format('YYYY-MM-DD HH:mm:ss'),
            'cutOffTime': newCutoff.format('YYYY-MM-DD HH:mm:ss')
        };

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

        let arrayVal;
        try {
            arrayVal = JSON.parse("[" + strVal + "]");
            if (!isArray(arrayVal))
                arrayVal = strVal; // keep the user input anyway that will report error when do validation.
        }
        catch (ex) {
            arrayVal = strVal; // keep the user input anyway that will report error when do validation.
        }

        let changedValue = {};
        changedValue[vname] = arrayVal;

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
            originalData: {},
            updatedData: null,
            showConfirmDialog: false,
            loading: false,
            lottoDataLoaded: false,
            lotteDataChanged: false,
            releaseInfoChanged: false,
            dataVersionChanged: false
        };

        // query new release
        //this.onResync();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);

                this.setState({ updatedData: values, showConfirmDialog: true });
            }
        });
    }

    handleConfirmSubmit = () => {
        AipHelper.preCommitReleaseChange(this.state.updatedData, (res) => {
            console.log(res);
            this.setState({ showConfirmDialog: false });
        });
    }

    handleCancelSubmit = () => {
        this.setState({ updatedData: null, showConfirmDialog: false });
    }

    onResync = (e) => {
        if (!this.state.loading)
            this.setState({ loading: true });

        AipHelper.getLatestIssueInfo(info => {
            if (info) {
                // reset the data and the flags.
                this.setState({
                    originalData: info,
                    lottoDataLoaded: true,
                    lotteDataChanged: false,
                    releaseInfoChanged: false,
                    dataVersionChanged: false
                });

                this.props.form.setFieldsValue({
                    lottery: info.lottery,
                    next: info.next,
                    recommendation: info.recommendation,
                    dataVersion: info.dataVersion
                });
            }
            this.setState({ loading: false });
        });
    }

    onSyncToWeb = (e) => {

        // cache current data
        let originalData = this.state.originalData;
        if (!originalData || !originalData.lottery.issue)
            return;

        this.setState({ loading: true });
        AipHelper.syncLottoDetailFromWeb(this.state.originalData.lottery.issue, lottoInfo => {
            if (lottoInfo) {
                this.setState({ originalData: Object.assign(originalData, { lottery: lottoInfo }) });
                this.props.form.setFieldsValue({
                    lottery: lottoInfo
                });
                this.onLotteryDataChanged();
            }
            this.setState({ loading: false });
        });
    }

    onCreateNewRelease = (e) => {

        // cache current version info
        let versions = this.state.originalData.dataVersion;
        let nextInfo = {
            issue: this.state.originalData.next.issue,
            date: this.state.originalData.next.date
        };

        this.setState({ loading: true });
        AipHelper.createNewLottoRelease(nextInfo, (info) => {
            if (info) {

                let newData = {
                    lottery: info.lottery,
                    next: info.next,
                    recommendation: info.recommendation,
                    dataVersion: Object.assign(versions, {
                        latestIssue: nextInfo.issue,
                        latestLotteryVersion: 1, // set 1 as the init version.
                        attributeDataVersion: 1, // set 1 as the init version.
                        releaseDataVersion: 1 // set 1 as the init version.
                    })
                };

                this.setState({
                    originalData: newData,
                    lotteDataChanged: true,
                    releaseInfoChanged: true,
                    dataVersionChanged: true
                });
                this.props.form.setFieldsValue(newData);
            }
            this.setState({ loading: false });
        });
    }

    onLotteryDataChanged = () => {

        if (!this.state.lotteDataChanged) {
            // increase the lottery version accordingly
            let currentVersion = this.props.form.getFieldValue("dataVersion");
            currentVersion.latestLotteryVersion++;

            this.setState({ dataVersionChanged: true });
            this.props.form.setFieldsValue({
                dataVersion: currentVersion
            });
        }

        this.setState({ lotteDataChanged: true });
    }

    onReleaseDataChanged = () => {

        if (!this.state.releaseInfoChanged) {
            // increase the lottery version accordingly
            let currentVersion = this.props.form.getFieldValue("dataVersion");
            currentVersion.releaseDataVersion++;

            this.setState({ dataVersionChanged: true });
            this.props.form.setFieldsValue({
                dataVersion: currentVersion
            });
        }

        this.setState({ releaseInfoChanged: true });
    }

    onDataVersionChanged = () => {
        this.setState({ dataVersionChanged: true });
    }

    lotteryValidator = (rule, value, callback) => {
        var scheme = value.scheme;

        // the scheme must be the format as xx xx xx xx xx xx+xx
        if (scheme.length !== 20)
            return callback("Invalid Lottery Scheme.");

        if (scheme[17] !== '+')
            return callback("Invalid Lottery Scheme.");

        var nums = scheme.split(/[ +]+/).map(n => Number(n));
        if (nums.length !== 7)
            return callback("Invalid Lottery Scheme.");

        // check each number
        var validated = nums.filter((n, i) => {
            if (!n)
                return false;

            if (i === 6) {
                return n > 0 && n <= 16;
            } else {
                if (n < 1 || n > 33)
                    return false;

                if (i !== 0) {
                    return n > nums[i - 1];
                }

                return true;
            }
        });

        if (validated.length !== 7)
            return callback("Invalid Lottery Scheme.");

        return callback();
    }

    recommendValidator = (rule, value, callback) => {
        if (!isArray(value.blueExcludes) || !isArray(value.blueIncludes) || !isArray(value.redExcludes) || !isArray(value.redIncludes))
            return callback("Invalid Recommended Numbers.");

        return callback();
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

        let releaseContent = this.state.originalData;

        return (
            <Spin spinning={this.state.loading} size="large">
                <Form style={{ padding: 3 }} onSubmit={this.handleSubmit}>

                    <ButtonGroup style={{ marginBottom: 10 }}>
                        <Button icon="sync" onClick={this.onResync}>同步</Button>
                        <Button icon="cloud-download" disabled={!this.state.lottoDataLoaded} onClick={this.onSyncToWeb}>填充</Button>
                        <Button icon="plus" disabled={!this.state.lottoDataLoaded} onClick={this.onCreateNewRelease}>添加</Button>
                        <Button type="primary" icon="check" htmlType="submit"
                            disabled={!this.state.lotteDataChanged && !this.state.releaseInfoChanged && !this.state.dataVersionChanged}
                        >提交</Button>
                    </ButtonGroup>

                    <FormItem {...formItemLayout} label="当期">
                        {
                            getFieldDecorator("lottery", {
                                initialValue: releaseContent.lottery,
                                rules: [{ required: true, message: 'Please input the lottery!' }, { validator: this.lotteryValidator }]
                            })(
                                <LottoDetail onChange={this.onLotteryDataChanged} />
                            )
                        }
                    </FormItem>
                    <FormItem {...formItemLayout} label="推荐">
                        {
                            getFieldDecorator("recommendation", {
                                initialValue: releaseContent.recommendation,
                                rules: [{ required: true, message: 'Please input the recommendation!' }, { validator: this.recommendValidator }]
                            })(
                                <LottoRecommendation onChange={this.onReleaseDataChanged} />
                            )
                        }
                    </FormItem>
                    <FormItem {...formItemLayout} label="下期">
                        {
                            getFieldDecorator("next", {
                                initialValue: releaseContent.next,
                                rules: [{ required: true, message: 'Please input the next release info!' }]
                            })(
                                <LottoNextInfo onChange={this.onReleaseDataChanged} />
                            )
                        }
                    </FormItem>
                    <FormItem {...formItemLayout} label="版本">
                        {
                            getFieldDecorator("dataVersion", {
                                initialValue: releaseContent.dataVersion,
                                rules: [{ required: true, message: 'Please input the version!' }]
                            })(
                                <LottoVersions onChange={this.onDataVersionChanged} />
                            )
                        }
                    </FormItem>
                    <Modal
                        title="Confirm the infomration"
                        visible={this.state.showConfirmDialog}
                        onOk={this.handleConfirmSubmit}
                        onCancel={this.handleCancelSubmit}
                    >
                        <p>期号：{this.state.updatedData ? this.state.updatedData.lottery.issue : ""} </p>
                        <p>日期：{this.state.updatedData ? this.state.updatedData.lottery.date : ""} </p>
                        <p>奖号：{this.state.updatedData ? this.state.updatedData.lottery.scheme : ""} </p>
                    </Modal>
                </Form>
            </Spin>
        );
    }
};

const ModificationForm = Form.create()(Modification);
export default ModificationForm;