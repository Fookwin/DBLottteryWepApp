import React, { Component } from "react";
import { Timeline, Badge, Spin} from 'antd';
import AipHelper from './api-provider';
import './attributes.css';

class Attributes extends Component {

    constructor(props) {
        super(props);

        this.state = {
            Attributes: null,
            loading: false,
        };
    }

    componentDidMount() {
        this.LoadAttributes();
    }

    LoadAttributes = () => {
        if (!this.state.Attributes) {
            this.setState({
                loading: true,
            });

            AipHelper.getAttributes((res) => {
                if (res) {
                    this.setState({
                        Attributes: res,
                    });
                }

                this.setState({
                    loading: false,
                });
            });
        }
    }

    ShowAttributeDetail = (attri) => {
        window.location = `/attribute/${attri}`;
    }

    render() {

        return (
            <div className="attributes-container">
                <Spin spinning={this.state.loading} size="large">
                </Spin>
            </div>
        );
    }
};

export default Attributes;