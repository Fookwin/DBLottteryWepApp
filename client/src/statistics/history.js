import React, { Component } from "react";
import { Row, Col, Timeline, Badge, Modal, Icon, Tooltip } from 'antd';
import AipHelper from './api-provider';
import InfiniteScroll from 'react-infinite-scroller';
import './history.css';
import Util from '../util/util'

function NumBall({ num, ball }) {

    return (
        <svg width="40" height="40" style={{ margin: 2 }}>
            <defs>
                <linearGradient id="red-ball" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: 'red' }} />
                    <stop offset="100%" style={{ stopColor: 'darkred' }} />
                </linearGradient>
                <linearGradient id="blue-ball" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: 'blue' }} />
                    <stop offset="100%" style={{ stopColor: 'darkbllue' }} />
                </linearGradient>
            </defs>
            <g>
                <circle cx="20" cy="20" r="18" fill={"url(#" + ball + ")"} />
                <text fontSize="18px" dy=".36em" x="20" y="20" textAnchor="middle" style={{ fill: 'white' }}>{num}</text>
            </g>
        </svg>
    );
}

function LottoPage({ lotto }) {

    // get red and blue numbers
    let subs = lotto.scheme.split('+');
    let reds = subs[0].split(' ');
    let blue = subs[1];
    let myDate = new Date(lotto.date);

    return (
        <div className="polaroid">
            <Row>
                <Col span={10}>第{lotto.issue}期</Col>
                <Col span={7}>{myDate.toLocaleDateString()}</Col>
                <Col span={7}>{Util.weekDays[myDate.getDay()]}</Col>
            </Row>
            <Row>
                {
                    reds.map(red => <NumBall key={red} num={red} ball='red-ball' />)
                }
                <NumBall num={blue} ball='blue-ball' />
            </Row>
        </div>
    );
}

const pageSize = 30;
class History extends Component {

    constructor(props) {
        super(props);

        this.state = {
            Lotteries: [],
            Index: 0,
            loading: false,
            hasMore: true,
        };
    }

    componentDidMount() {
        this.LoadMore();
    }

    LoadMore = () => {
        if (this.state.hasMore) {
            let loaded = this.state.Lotteries;
            this.setState({
                loading: true,
            });

            AipHelper.getLotteries(this.state.Index, pageSize, (res) => {
                if (res) {
                    this.setState({
                        Index: res.NextIndex,
                        hasMore: res.NextIndex < 0 ? false : true,
                        Lotteries: loaded.concat(res.Lotteries),
                        loading: false,
                    });
                }
            });
        }
    }

    timeLineItem = (lot, index) => {

        if (index < 10) {
            return (
                <Timeline.Item key={lot.issue} color='darkgrey'
                    dot={<Badge count={index} showZero style={{ backgroundColor: '#fff', color: '#999', boxShadow: '0 0 0 1px #d9d9d9 inset' }}/>}>
                    <LottoPage lotto={lot} index={index} />
                </Timeline.Item>
            );
        }

        return (
            <Timeline.Item key={lot.issue} color='darkgrey'>
                <LottoPage lotto={lot} index={index} />
            </Timeline.Item>
        );
    }

    render() {

        return (
            <div className="history-container">
                <InfiniteScroll
                    initialLoad={false}
                    pageStart={0}
                    loadMore={this.LoadMore}
                    hasMore={!this.state.loading && this.state.hasMore}
                    useWindow={false}
                >
                    <Timeline pending={
                        (
                            <label>{!this.state.hasMore ? '-- end --' : 'Loading ...'}</label>
                        )
                    }>
                        {
                            this.state.Lotteries.map(this.timeLineItem)
                        }
                    </Timeline >
                </InfiniteScroll>
            </div>
        );
    }
};

export default History;