import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Diagram from "../diagram/diagram";
import Management from "../management/management";
import 'antd/dist/antd.css';
import './App.css';
import { Affix, Drawer, Button, Layout, Menu, Icon } from 'antd';

const { Content } = Layout;

const routers = [{
  key: "home",
  name: "Home",
  path: "/home",
  icon: "user",
  component: Home
}, {
  key: "management",
  name: "Management",
  path: "/management",
  icon: "user",
  component: Management
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
      visible: false,
    };
  }

  showDrawer = () => {
    this.setState({
      visible: !this.state.visible,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
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
          <Drawer title="福盈双色球" placement="left" closable={false} onClose={this.onClose} visible={this.state.visible}>
            <Menu theme="light" mode="inline" defaultSelectedKeys={[this.getDefaultMenuKey()]} onClick={this.onClose}>
              {
                routers.map((item) =>
                  <Menu.Item key={item.key}>
                    <Link to={item.path}><Icon type={item.icon} /><span>{item.name}</span></Link>
                  </Menu.Item>
                )
              }
            </Menu>
          </Drawer>
          <Layout>
            <Content style={{ margin: '2px', padding: 0, background: '#fff', height: '100%' }}>
              {
                routers.map((item) => <Route key={item.key} path={item.path} component={item.component} />)
              }
              <Affix style={{ position: 'absolute', left: 'calc(100% - 60px)', top: 'calc(100% - 40px)' }}>
                <Button onClick={this.showDrawer}><Icon type={!this.state.visible ? 'menu-unfold' : 'menu-fold'} /></Button>
              </Affix>
            </Content>
          </Layout>
        </Layout>
      </Router>
    );
  }
}

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
);

export default App;