import React, { Component } from "react";
import { Button } from 'antd';
import './management.css';
import Notification from './notification/notification';
import Modification from './modification/modification';

const Comfirmation = () => (
  <div>
    <h2>Comfirmation</h2>
  </div>
);

const steps = [{
  title: 'Modification',
  component: <Modification />
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