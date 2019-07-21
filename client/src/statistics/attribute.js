import React, { Component } from "react";
import { Divider, Spin, Typography, Icon } from 'antd';
import AipHelper from '../util/api-helper';
import { StatePanel } from './components';
import './attribute.css';

const { Title } = Typography;
class Attribute extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: props.match.params.name,
            loading: false,
            attribute: null,
        };
    }

    componentDidMount() {
        this.LoadAttribute(this.state.name);
    }

    LoadAttribute = (name) => {

        this.setState({
            loading: true,
        });

        AipHelper.getAttribute(name, (res) => {
            if (res) {
                console.log(res);
                this.setState({
                    loading: false,
                    attribute: res,
                });
            }
        });
    }

    goHelp = () => {
        window.location = `/help/${this.state.attribute.HID}`;
    }

    render() {
        const { loading, attribute, } = this.state;
        const { States, Display } = attribute || { States: [] };

        return (
            <div className='attribute-container'>
                <Divider><Title type='secondary' level={4}>{Display}  <Icon type="question-circle" onClick={this.goHelp} /></Title></Divider>
                <Spin spinning={loading} size="large">
                    {
                        States.map(state => <StatePanel key={state.Expression} state={state} title={`${Display} = ${state.Expression}`} />)
                    }
                </Spin>
            </div>
        );
    }
}

export default Attribute;