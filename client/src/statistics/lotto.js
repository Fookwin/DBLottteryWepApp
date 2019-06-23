import React, { Component } from "react";
import { Button, Row, Card, Skeleton, Icon, Table } from 'antd';
import AipHelper from './api-provider';
import './history.css';
import Util from '../util/util'
import { NumBall } from './components';

const { Meta } = Card;
class Lotto extends Component {

    constructor(props) {
        super(props);

        this.state = {
            issue: props.match.params.issue,
            loading: false,
            lotto: null
        };
    }

    componentDidMount() {
        this.LoadLotto();
    }

    LoadLotto = () => {

        this.setState({
            loading: true,
        });

        AipHelper.getLotterry(this.state.issue, (res) => {
            if (res) {
                console.log(res);
                this.setState({
                    loading: false,
                    lotto: res
                });
            }
        });
    }

    BonusPanel = (bonus) => {
        const dataSource = [
            {
                key: 1,
                prize: '一等奖',
                money: Util.getMoneyFormat(bonus[1]),
                amount: bonus[0] + '注',
            },
            {
                key: 2,
                prize: '二等奖',
                money: Util.getMoneyFormat(bonus[3]),
                amount: bonus[2] + '注',
            },
            {
                key: 3,
                prize: '三等奖',
                money: Util.getMoneyFormat(bonus[5]),
                amount: bonus[4] + '注',
            },
            {
                key: 4,
                prize: '四等奖',
                money: Util.getMoneyFormat(bonus[7]),
                amount: bonus[6] + '注',
            },
            {
                key: 5,
                prize: '五等奖',
                money: Util.getMoneyFormat(bonus[9]),
                amount: bonus[8] + '注',
            },
            {
                key: 6,
                prize: '六等奖',
                money: Util.getMoneyFormat(bonus[11]),
                amount: bonus[10] + '注',
            },
        ];

        const columns = [
            {
                title: '奖项',
                dataIndex: 'prize',
                key: 'prize',
                align: 'center',
            },
            {
                title: '奖金',
                dataIndex: 'money',
                key: 'money',
                align: 'center',
            },
            {
                title: '注数',
                dataIndex: 'amount',
                key: 'amount',
                align: 'center',
            },
        ];


        return (
            <Table bordered dataSource={dataSource} columns={columns} pagination={false} showHeader={false} />
        );
    }

    DetailPage = (lotto) => {
        if (!lotto) {
            return <div />;
        }

        let subs = lotto.scheme.split('+');
        let reds = subs[0].split(' ');
        let blue = subs[1];
        let myDate = new Date(lotto.date);

        return (
            <div>
                <Row>
                    开奖时间：{myDate.toLocaleDateString()} {Util.weekDays[myDate.getDay()]}
                </Row>
                <Row style={{ margin: 10 }}>
                    {
                        reds.map(red => <NumBall key={red} num={red} ball='red-ball' />)
                    }
                    <NumBall num={blue} ball='blue-ball' />
                </Row>
                <Row>
                    销售金额：{Util.getMoneyFormat(lotto.bet)}
                </Row>
                <Row>
                    奖池金额：{Util.getMoneyFormat(lotto.pool)}
                </Row >
                <Row style={{ marginTop: 10 }}>
                    {this.BonusPanel(lotto.bonus)}
                </Row >
                <Row style={{ marginTop: 10, textAlign: 'left' }}>
                    {lotto.details}
                </Row>
            </div>
        );
    }

    goPrvious = () => {

    }

    goNext = () => {

    }

    render() {
        const { issue, loading, lotto } = this.state;

        return (
            <div style={{ margin: 5 }}>
                <Card actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}>
                    <Skeleton loading={loading} avatar active>
                        <Meta
                            title={
                                <Button.Group style={{ width: '100%' }}>
                                    <Button type="default">
                                        <Icon type="left" />
                                        上一期
                                        </Button>
                                    <Button type="default">
                                        {`第 ${issue} 期`}
                                    </Button>
                                    <Button type="default">
                                        下一期
                                        <Icon type="right" />
                                    </Button>
                                </Button.Group>
                            }
                            description={this.DetailPage(lotto)}
                        />
                    </Skeleton>
                </Card>
            </div>
        );
    }
}

export default Lotto;