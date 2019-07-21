import React, { Component } from "react";
import { Divider, Spin, Typography } from 'antd';
import AipHelper from '../util/api-helper';
import './help.css';

const { Title, Text, Paragraph } = Typography;
class Help extends Component {

    constructor(props) {
        super(props);

        this.state = {
            id: props.match.params.id,
            loading: false,
            topic: null,
        };
    }

    componentDidMount() {
        this.LoadHelp(this.state.id);
    }

    LoadHelp = (id) => {

        this.setState({
            loading: true,
        });

        AipHelper.getHelp(id, (res) => {
            if (res) {
                console.log(res);
                this.setState({
                    loading: false,
                    topic: res,
                });
            }
        });
    }

    render() {
        const { loading, topic, } = this.state;
        const { Title, Description, Items } = topic || { Title: '', Description: '', Items: [] };

        return (
            <Spin spinning={loading} size="large">
                <Typography className='help-container' >
                    <Divider><Typography.Title type='secondary' level={3}>{Title}</Typography.Title></Divider>
                    <Paragraph> {Description} </Paragraph>
                    <Divider><Typography.Title type='secondary' level={4}>名词解释</Typography.Title></Divider>
                    <Paragraph>
                        {
                            Items.map((item, inx) => <li key={inx}><Text>{item}</Text></li>)
                        }
                    </Paragraph>
                </Typography>
            </Spin>
        );
    }
}

export default Help;