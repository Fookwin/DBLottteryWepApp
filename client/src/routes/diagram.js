import React, { Component } from "react";
import '../styles/diagram.css';
import DrawDiagram from './diagram-provider'
import $ from 'jquery';

class Diagram extends Component {

    constructor(props) {
        super(props);
        this.onContentScroll = this.onContentScroll.bind(this);
    }

    onContentScroll = e => {
        // get the position of content scroll
        var left = $("#contentBlock").scrollLeft(),
            top = $("#contentBlock").scrollTop();
    
        // adjust the position of the header and left colummn
        $("#headerBlock").scrollLeft(left);
        $("#issuesBlock").scrollTop(top);
    }

    componentDidMount() {
        DrawDiagram(function () {
        });
    }
  
    componentWillUnmount() {
    }

    render() {
        return (
            <div>
                <div>
                    <div id="cornerBlock"></div>
                    <div id="headerBlock"></div>
                </div>
                <div id="contentContainer">
                    <div id="issuesBlock"></div>
                    <div id="contentBlock" onScroll={this.onContentScroll}></div>
                </div>  
            </div>
        );
    }
};

export default Diagram;