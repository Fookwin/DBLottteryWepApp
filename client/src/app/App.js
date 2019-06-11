import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Diagram from "../diagram/diagram";
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

const routers = [{
  key: "home",
  name: "Home",
  path: "/home",
  icon: "user",
  component: Home
}, {
  key: "modification",
  name: "Modification",
  path: "/modification",
  icon: "user",
  component: Modification
}, {
  key: "notification",
  name: "Notification",
  path: "/notification",
  icon: "user",
  component: Notification
},{
  key: "users",
  name: "Users",
  path: "/users",
  icon: "user",
  component: UserManagement
}, {
  key: "diagram",
  name: "Diagram",
  path: "/diagram",
  icon: "user",
  component: Diagram
},
];

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
    let selectedItem = routers.find((item) => item.path === window.location.pathname);

    return selectedItem ? selectedItem.key : "home";
  }

  render() {
    return (
      <Router>
        <Layout style={{ height: '100%' }} className="scrollable-container" ref={(node) => { this.container = node; }}>
          <Drawer title="福盈双色球" placement="left" closable={false} onClose={this.onClose} visible={this.state.drawer_visible}>
            <Menu theme="light" mode="inline" defaultSelectedKeys={[this.getDefaultMenuKey()]} onClick={this.onClose}>
              <Menu.Item key="home"><Link to="/home"><Icon type="user" /><span>Home</span></Link></Menu.Item>
              <SubMenu key="management" title={<span><Icon type="mail" /><span>Management</span></span>}>
                <Menu.Item key="modification"><Link to="/modification"><Icon type="user" /><span>Modification</span></Link></Menu.Item>
                <Menu.Item key="notification"><Link to="/notification"><Icon type="user" /><span>Notification</span></Link></Menu.Item>
                <Menu.Item key="users"><Link to="/users"><Icon type="user" /><span>Users</span></Link></Menu.Item>
              </SubMenu>
              <Menu.Item key="diagram"><Link to="/diagram"><Icon type="user" /><span>Daigram</span></Link></Menu.Item>
            </Menu>
          </Drawer>
          <Layout>
            <Content className="layout-container">
              <Route key="home" path="/home" component={Home} />
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