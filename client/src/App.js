import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Diagram from "./routes/diagram";
import 'antd/dist/antd.css';
import './App.css';
import { Layout, Menu, Icon } from 'antd';

const { Header, Sider, Content } = Layout;

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
        <Layout>
          <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
            <div className="logo" />
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
              <Menu.Item key="2">
                <Icon type="user" /><span><Link to="/">Home</Link></span>
              </Menu.Item>
              <Menu.Item key="1">
                <Icon type="user" /><span><Link to="/diagram">Diagram</Link></span>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Header style={{ background: '#fff', padding: 0 }}>
              <Icon className="trigger" type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} onClick={this.toggle} />
            </Header>
            <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
              <Route exact path="/" component={Home} />
              <Route path="/diagram" component={Diagram} />
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