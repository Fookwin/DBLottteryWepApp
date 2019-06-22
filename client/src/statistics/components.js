import React from "react";
import Util from '../util/util'
import './components.css';
import { Row, Col } from 'antd';

function NumBall({ num, ball }) {

    return (
        <svg width="40" height="40" style={{ margin: 2 }}>
            <defs>
                <linearGradient id="red-ball" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: 'red' }} />
                    <stop offset="100%" style={{ stopColor: 'darkred' }} />
                </linearGradient>
                <linearGradient id="blue-ball" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: 'blue' }} />
                    <stop offset="100%" style={{ stopColor: 'darkbllue' }} />
                </linearGradient>
            </defs>
            <g>
                <circle cx="20" cy="20" r="18" fill={"url(#" + ball + ")"} />
                <text fontSize="18px" dy=".36em" x="20" y="20" textAnchor="middle" style={{ fill: 'white' }}>{num}</text>
            </g>
        </svg>
    );
}

function LottoPage({ lotto }) {

    if (!lotto) {
        return (<div />);
    }

    // get red and blue numbers
    let subs = lotto.scheme.split('+');
    let reds = subs[0].split(' ');
    let blue = subs[1];
    let myDate = new Date(lotto.date);

    return (
        <div className="polaroid">
            <Row>
                <Col span={10}>第{lotto.issue}期</Col>
                <Col span={7}>{myDate.toLocaleDateString()}</Col>
                <Col span={7}>{Util.weekDays[myDate.getDay()]}</Col>
            </Row>
            <Row>
                {
                    reds.map(red => <NumBall key={red} num={red} ball='red-ball' />)
                }
                <NumBall num={blue} ball='blue-ball' />
            </Row>
        </div>
    );
}

export {
    NumBall,
    LottoPage
}