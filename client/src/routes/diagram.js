import React, { Component } from "react";
import '../styles/diagram.css'
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
                    <div style={{float:'left', width:60}} id="cornerBlock"></div>
                    <div style={{float:'left', width:'calc(100% - 60px)', overflow:'hidden'}} id="headerBlock"></div>
                </div>
                <div style={{clear:'left'}}>
                    <div style={{float:'left', width:60, 'maxHeight':'calc(100vh - 60)px', overflow:'hidden'}} id="issuesBlock"></div>
                    <div style={{float:'left', width:'calc(100% - 60px)', overflow:'auto', 'maxHeight':'calc(100vh - 60px)'}} id="contentBlock" onScroll={this.onContentScroll}></div>
                </div>  
            </div>
        );
    }
};

export default Diagram;