import React, { Component } from "react";
import { Form, Select, Timeline, Button, Modal, Icon, Tooltip } from 'antd';
import AipHelper from './api-provider';
import InfiniteScroll from 'react-infinite-scroller';

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
                            this.state.Lotteries.map(lot => (
                                <Timeline.Item key={lot.issue}
                                    dot={<Icon type="clock-circle-o" style={{ fontSize: '16px' }} />} color="red">
                                    <span><p>{lot.issue}</p><h3>{lot.numbers}</h3></span>
                                </Timeline.Item>
                            ))
                        }
                    </Timeline >
                </InfiniteScroll>
            </div>
        );
    }
};

export default History;