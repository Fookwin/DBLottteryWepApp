import React, { Component } from "react";
import { Timeline, Badge } from 'antd';
import AipHelper from '../util/api-helper';
import InfiniteScroll from 'react-infinite-scroller';
import './history.css';
import { LottoPage } from './components';

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

    ShowLottoDetail = (issue) => {
        window.location = `/lotto/${issue}`;
    }

    timeLineItem = (lot, index) => {

        if (index < 10) {
            return (
                <Timeline.Item key={lot.issue} color='darkgrey' onClick={() => this.ShowLottoDetail(lot.issue)}
                    dot={<Badge count={index} showZero style={{ backgroundColor: '#fff', color: '#999', boxShadow: '0 0 0 1px #d9d9d9 inset' }} />}>
                    <LottoPage lotto={lot} />
                </Timeline.Item>
            );
        }

        return (
            <Timeline.Item key={lot.issue} color='darkgrey' onClick={() => this.ShowLottoDetail(lot.issue)}>
                <LottoPage lotto={lot} />
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