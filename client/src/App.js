import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Diagram from "./routes/diagram";
import Management from "./routes/management";
import 'antd/dist/antd.css';
import './App.css';
import { Layout, Menu, Icon } from 'antd';

const { Sider, Content } = Layout;

class App extends React.Component {
  state = {
    collapsed: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  render() {
    return (
      <Router>
        <Layout style={{ height: '100%' }}>
          <Sider theme="light" trigger={null} collapsible collapsed={this.state.collapsed}>
            <Icon className="trigger" type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} onClick={this.toggle} />
            <Menu theme="light" mode="inline" defaultSelectedKeys={['home']}>
              <Menu.Item key="home">
                <Link to="/home"><Icon type="user" /><span>Home</span></Link>
              </Menu.Item>
              <Menu.Item key="management">
                <Link to="/management"><Icon type="user" /><span>Management</span></Link>
              </Menu.Item>
              <Menu.Item key="diagram">
                <Link to="/diagram"><Icon type="user" /><span>Diagram</span></Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Content style={{ margin: '2px', padding: 0, background: '#fff', height: '100%' }}>
              <Route exact path="/home" component={Home} />
              <Route path="/diagram" component={Diagram} />
              <Route path="/management" component={Management} />
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