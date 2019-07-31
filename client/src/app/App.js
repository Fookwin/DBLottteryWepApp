import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Diagram from "../diagram/diagram";
import History from '../statistics/history';
import Attributes from '../statistics/attributes';
import Notification from '../management/notification';
import Modification from '../management/modification';
import UserManagement from '../management/users';
import Lotto from '../statistics/lotto';
import Attribute from '../statistics/attribute';
import Help from '../help/help';
import 'antd/dist/antd.css';
import './App.css';
import { Affix, Drawer, Button, Layout, Menu, Icon } from 'antd';
import { enquireScreen } from 'enquire-js';
import Home from '../home/index';

const { Content } = Layout;
const { SubMenu } = Menu;

let isMobile;
enquireScreen((b) => {
  isMobile = b;
});

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      drawer_visible: false,
      isMobile,
    };
  }

  componentDidMount() {
    // 适配手机屏幕;
    enquireScreen((b) => {
      this.setState({ isMobile: !!b });
    });
  }

  showDrawer = () => {
    this.setState({
      drawer_visible: !this.state.drawer_visible,
    });
  };

  onClose = () => {
    this.setState({
      drawer_visible: false,
    });
  };

  getDefaultMenuKey = () => {
    return window.location.pathname.slice(1);
  }

  render() {
    return (
      <Router>
        <div >
          <Route key="home" exact path="/" component={Home} />
          <Route key="help" path="/help/:id" component={Help} />
          <Route key="history" path="/history" component={History} />
          <Route key="attributes" path="/attributes" component={Attributes} />
          <Route key="modification" path="/modification" component={Modification} />
          <Route key="notification" path="/notification" component={Notification} />
          <Route key="users" path="/users" component={UserManagement} />
          <Route key="diagram" path="/diagram" component={Diagram} />
          <Route key="lotto" path="/lotto/:issue" component={Lotto} />
          <Route key="attribute" path="/attribute/:name" component={Attribute} />
        </div>
      </Router>
    );
  }
}

export default App;