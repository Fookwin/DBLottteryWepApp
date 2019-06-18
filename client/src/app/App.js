import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Diagram from "../diagram/diagram";
import History from '../statistics/history';
import Notification from '../management/notification';
import Modification from '../management/modification';
import UserManagement from '../management/users';
import 'antd/dist/antd.css';
import './App.css';
import { Affix, Drawer, Button, Layout, Menu, Icon } from 'antd';

const { Content } = Layout;
const { SubMenu } = Menu;

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
);

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      drawer_visible: false,
    };
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
        <Layout style={{ height: '100%' }} className="scrollable-container" ref={(node) => { this.container = node; }}>
          <Drawer title="福盈双色球" placement="left" closable={false} onClose={this.onClose} visible={this.state.drawer_visible}>
            <Menu theme="light" mode="inline" defaultSelectedKeys={[this.getDefaultMenuKey()]} onClick={this.onClose}>
              <Menu.Item key="home"><Link to="/home"><Icon type="user" /><span>Home</span></Link></Menu.Item>
              <SubMenu key="statistics" title={<span><Icon type="mail" /><span>Statistics</span></span>}>
                <Menu.Item key="history"><Link to="/history"><Icon type="user" /><span>History</span></Link></Menu.Item>
              </SubMenu>
              <Menu.Item key="diagram"><Link to="/diagram"><Icon type="user" /><span>Daigram</span></Link></Menu.Item>
              <SubMenu key="management" title={<span><Icon type="mail" /><span>Management</span></span>}>
                <Menu.Item key="modification"><Link to="/modification"><Icon type="user" /><span>Modification</span></Link></Menu.Item>
                <Menu.Item key="notification"><Link to="/notification"><Icon type="user" /><span>Notification</span></Link></Menu.Item>
                <Menu.Item key="users"><Link to="/users"><Icon type="user" /><span>Users</span></Link></Menu.Item>
              </SubMenu>
            </Menu>
          </Drawer>
          <Layout>
            <Content className="layout-container">
              <Route key="home" path="/home" component={Home} />
              <Route key="history" path="/history" component={History} />
              <Route key="modification" path="/modification" component={Modification} />
              <Route key="notification" path="/notification" component={Notification} />
              <Route key="users" path="/users" component={UserManagement} />
              <Route key="diagram" path="/diagram" component={Diagram} />
              <Affix style={{ position: 'absolute', left: 'calc(100% - 40px)', top: 'calc(100% - 40px)' }}>
                <Button className="float-menu-btn" icon={!this.state.drawer_visible ? 'menu-unfold' : 'menu-fold'} onClick={this.showDrawer} />
              </Affix>
            </Content>
          </Layout>
        </Layout>
      </Router>
    );
  }
}

export default App;