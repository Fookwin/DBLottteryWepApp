import React, { Component } from "react";
import { Row, Col, Timeline, Badge, Modal, Icon, Tooltip } from 'antd';
import AipHelper from './api-provider';
import './history.css';
import { LottoPage, NumBall } from './components';

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
                    lotto: res.data
                });
            }
        });
    }

    render() {
        return (
            <div>
                ID: {this.state.issue}
            </div>
        );
    }
}

export default Lotto;