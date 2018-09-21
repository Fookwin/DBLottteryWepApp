import React, { Component, Components } from "react";
import { Steps, Button, message } from 'antd';
import './management.css';

const Information = () => (
  <div>
    <h2>Information</h2>
  </div>
);

const Comfirmation = () => (
  <div>
    <h2>Comfirmation</h2>
  </div>
);

const Notification = () => (
  <div>
    <h2>Notification</h2>
  </div>
);

const Step = Steps.Step;

const steps = [{
  title: 'Information',
  component: <Information />
}, {
  title: 'Confirmation',
  component: <Comfirmation />
}, {
  title: 'Notification',
  component: <Notification />
}];

class Management extends Component {

  constructor(props) {
    super(props);
    this.state = {
      current: 0,
    };
  }

  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  render() {
    const { current } = this.state;
    return (
      <div>
        <Steps current={current}>
          {steps.map(item => <Step key={item.title} title={item.title} />)}
        </Steps>
        <div className="steps-content">{steps[current].component}</div>
        <div className="steps-action">
          {
            current > 0 && <Button onClick={() => this.prev()}>Back to {steps[current - 1].title}</Button>
          }
          {
            current < steps.length - 1 && <Button type="primary" style={{ marginLeft: 10 }} onClick={() => this.next()}>Go to {steps[current + 1].title}</Button>
          }
        </div>
      </div>
    );
  }
};

export default Management;