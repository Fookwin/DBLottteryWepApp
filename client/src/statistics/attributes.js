import React, { Component } from "react";
import { Divider, List, Icon, Collapse, Button, Spin } from 'antd';
import AipHelper from './api-provider';
import { StatePanel } from './components';
import './attributes.css';

const { Panel } = Collapse;

class Attributes extends Component {

    constructor(props) {
        super(props);

        this.state = {
            Attributes: {},
            Recommendation: [],
            loading: false,
            Filters: [
                0, // HitCount
                0, // HitProbability
                -100, // IdealProbility
                -100, // AverageOmission
                0, // MaxOmission
                0, // ImmediateOmission
                8, // ProtentialEnergy
            ]
        };
    }

    componentDidMount() {
        this.LoadAttributes();
    }

    LoadAttributes = () => {
        this.setState({
            loading: true,
        });

        AipHelper.getAttributes((res) => {
            if (res) {
                // get recommandataion according to the settings
                this.setState({
                    Attributes: res,
                    Recommendation: this.GetRecommandation(res.Categories)
                });
            }

            this.setState({
                loading: false,
            });
        });
    }

    GetRecommandation = (categories) => {
        let states = [];
        categories.forEach(cat => {
            cat.Attributes.forEach(attri => {
                attri.States.forEach(state => {
                    let matrix = state.Value.split(',');
                    if (!matrix.find((val, inx) => val < this.state.Filters[inx])) {
                        states.push({
                            Key: attri.Name,
                            State: state,
                            Title:`${attri.Display} = ${state.Expression}`,
                            ProtentialEnergy: matrix[6]
                        })
                    }
                });
            });
        });

        return states.sort((a, b) => b.ProtentialEnergy - a.ProtentialEnergy);
    }

    ShowAttributeDetail = (attri) => {
        window.location = `/attribute/${attri}`;
    }

    render() {
        let { Attributes, Recommendation } = this.state;
        let categories = Attributes.Categories || [];

        return (
            <div className="attributes-container">
                <Divider>异常属性</Divider>
                <Spin spinning={this.state.loading} size="large">
                    {
                        Recommendation.map(item => <StatePanel key={item.Key} state={item.State} title={item.Title} clickFunc={() => this.ShowAttributeDetail(item.Key)}/>)
                    }
                </Spin>
                <Divider>全部属性</Divider>
                {
                    categories.map(cat => {
                        return <Collapse
                            key={cat.Name}
                            expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
                        >
                            <Panel className='category-panel' header={cat.Display}>
                                <List
                                    grid={{
                                        gutter: 3,
                                        xs: 2,
                                        sm: 3,
                                        md: 4,
                                        lg: 4,
                                        xl: 6,
                                        xxl: 6,
                                    }}
                                    dataSource={cat.Attributes}
                                    renderItem={attri => (
                                        <List.Item>
                                            <Button onClick={() => this.ShowAttributeDetail(attri.Name)}>{attri.Display}</Button>
                                        </List.Item>
                                    )}
                                />
                            </Panel>
                        </Collapse>
                    })
                }
            </div>
        );
    }
};

export default Attributes;