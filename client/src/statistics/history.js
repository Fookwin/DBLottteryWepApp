import React, { Component } from "react";
import { Form, Select, Timeline, Button, Modal, List, Tooltip } from 'antd';
import AipHelper from './api-provider';

const pageSize = 10;
class History extends Component {

    constructor(props) {
        super(props);

        this.state = {
            Lotteries: [],
            Index: 0,
            LoadedAll: false
        };

    }

    componentDidMount() {
        this.LoadMore();
    }

    LoadMore = () => {
        if (!this.state.LoadedAll) {
            AipHelper.getLotteries(this.state.Index, pageSize, (res) => {
                if (res) {
                    let loaded = this.state.Lotteries;
                    this.setState({
                        Index: res.NextIndex,
                        LoadedAll: res.NextIndex < 0 ? true : false,
                        Lotteries: loaded.concat(res.Lotteries)
                    });
                }
            });
        }
    }

    render() {

        return (
            <div className="history-container">
                <Timeline style={{ padding: 10 }} pending={
                    (
                        <div>
                            <label hidden={!this.state.LoadedAll}>-- end --</label>
                            <button hidden={this.state.LoadedAll} onClick={this.LoadMore}>Load More</button>
                        </div>
                    )
                }>
                    {
                        this.state.Lotteries.map(lot => (
                            <Timeline.Item key={lot.issue}>
                                <span><p>{lot.issue}</p><h3>{lot.numbers}</h3></span>
                            </Timeline.Item>
                        ))
                    }
                </Timeline >
            </div>
        );
    }
};

export default History;