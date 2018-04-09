"use strict";
module.exports = function builder() {

    let xmlbuilder = require('xmlbuilder'),
        path = require('path'),
        fs = require('fs');

    const middleLength = 5,
        pinNameSize = 2,
        pinDirectionSize = 1,
        pinLineStrokeWidth = 0.2,
        pinCircleStrokeWidth = 0.1,
        rangeBoxScale = 2.0;

    exports.convertESymbolToSVG = function _convertESymbolToSVG(symbol, saveTo) {
        let svg = xmlbuilder.create('svg'),
            group = svg.ele('g'),
            viewExtends = { left: -10, top: -10, right: 10, bottom: 10 };

        svg.att('xmlns', 'http://www.w3.org/2000/svg');

        symbolToSVG(symbol, group, viewExtends);

        // set view box, extend a little.
        setViewExtends(svg, viewExtends, rangeBoxScale);
        generateSVGAndPNGThumbnail(svg.toString(), symbol.name, saveTo);
    };

    function symbolToSVG(symbol, parent, rangeBox, gateName) {

        let symbolName = symbol.name,
            pins = symbol.pins,
            wires = symbol.wires,
            texts = symbol.texts,
            wireGroup = parent.ele('g'),
            pinGroup = parent.ele('g');

        // draw wires
        wireGroup.att('stroke', "darkred");

        for (let pos in wires) {
            let wire = wires[pos],
                line = wireGroup.ele('line');

            line.att('x1', wire.x1);
            line.att('y1', -wire.y1);
            line.att('x2', wire.x2);
            line.att('y2', -wire.y2);
            line.att('stroke-width', wire.width);

            rangeBox.left = Math.min(wire.x1, rangeBox.left);
            rangeBox.top = Math.min(-wire.y1, rangeBox.top);
            rangeBox.right = Math.max(wire.x2, rangeBox.right);
            rangeBox.bottom = Math.max(-wire.y2, rangeBox.bottom);

            // TODO: handle curve and layer...
        }

        // draw texts
        for (let pos in texts) {
            let textAtts = texts[pos],
                textVal = texts[pos].value,
                svgtext = parent.ele('text');

            if (gateName && textVal === '>NAME')
                textVal = gateName;

            svgtext.att('x', textAtts.x);
            svgtext.att('y', parseFloat(-textAtts.y));
            svgtext.att('font-size', textAtts.size);
            svgtext.att('fill', 'dimgray');
            svgtext.text(textVal);

            // TODO: handle layer...
        }

        // draw pins
        for (let pos in pins) {
            let pin = pins[pos],
                pinContainer = pinGroup.ele('g'),
                pinLine = pinContainer.ele('line'),
                pinName = pinContainer.ele('text'),
                pinDirection = pinContainer.ele('text'),
                pinCircle = pinContainer.ele('circle'),
                pinLength = middleLength;

            // TODO: handle following
            // this.shape = obj.shape;
            // this.length = obj.length;
            // this.visible = obj.visible;
            // this.angle = obj.angle;
            // this.mirror = obj.mirror;

            // calculate start and end point
            let startX = parseFloat(pin.x) + pinLength,
                startY = -pin.y,
                stopX = pin.x,
                stopY = -pin.y,
                nameOffset = 2.5,
                direction = pin.direction || 'io',
                swapLevel = pin.swapLevel || '0';

            if (pin.angle === "180") {
                startX = pin.x - pinLength;
                stopX = pin.x;
                nameOffset = -7.5;
            }

            pinLine.att('x1', startX);
            pinLine.att('y1', startY);
            pinLine.att('x2', stopX);
            pinLine.att('y2', stopY);
            pinLine.att('stroke-width', pinLineStrokeWidth);
            pinLine.att('stroke', 'darkred');

            pinName.att('x', startX + nameOffset);
            pinName.att('y', startY + pinNameSize / 2);
            pinName.att('font-size', pinNameSize);
            pinName.att('fill', 'dimgray');
            pinName.text(pin.name);

            pinDirection.att('x', stopX);
            pinDirection.att('y', stopY - pinDirectionSize / 2);
            pinDirection.att('font-size', pinDirectionSize);
            pinDirection.att('fill', 'green');
            pinDirection.text(direction + ' ' + swapLevel);

            pinCircle.att('cx', stopX);
            pinCircle.att('cy', stopY);
            pinCircle.att('r', 1);
            pinCircle.att('stroke', 'green');
            pinCircle.att('stroke-width', pinCircleStrokeWidth);
            pinCircle.att('fill', 'none');

            // function
            if (pin.function === 'clk') {
                let pinFun = pinContainer.ele('polyline');

                pinFun.att('points', '' + (startX + 2) + ',' + startY + ' ' + startX + ',' + (stopY - 1) + ' ' + startX + ',' + (startY + 1) + ' ' + (startX + 2) + ',' + startY);
                pinFun.att('stroke', 'darkred');
                pinFun.att('stroke-width', pinLineStrokeWidth);
                pinFun.att('fill', 'white');
            } else if (pin.function === 'dot') {
                let pinFun = pinContainer.ele('circle');

                pinFun.att('cx', startX + 1);
                pinFun.att('cy', startY);
                pinFun.att('r', 1);
                pinFun.att('stroke', 'darkred');
                pinFun.att('stroke-width', pinLineStrokeWidth);
                pinFun.att('fill', 'white');
            }
        }
    };

    exports.convertEPackageToSVG = function _convertEPackageToSVG(ePackage, saveTo) {
        let svg = xmlbuilder.create('svg'),
            group = svg.ele('g'),
            viewExtends = { left: -10, top: -10, right: 10, bottom: 10 };

        svg.att('xmlns', 'http://www.w3.org/2000/svg');

        packageToSVG(ePackage, group, viewExtends);

        // set view box, extend a little.
        setViewExtends(svg, viewExtends, rangeBoxScale);

        generateSVGAndPNGThumbnail(svg.toString(), ePackage.name, saveTo);
    };

    function packageToSVG(ePackage, parent, rangeBox) {
        let symbolName = ePackage.name,
            pads = ePackage.pads,
            wires = ePackage.wires,
            texts = ePackage.texts,
            smds = ePackage.smds,
            rectangles = ePackage.rectangles,
            circles = ePackage.circles,
            wireGroup = parent.ele('g'),
            padGroup = parent.ele('g');

        // draw wires
        wireGroup.att('stroke', "dimgray");

        for (let pos in wires) {
            let wire = wires[pos],
                line = wireGroup.ele('line');

            line.att('x1', wire.x1);
            line.att('y1', -wire.y1);
            line.att('x2', wire.x2);
            line.att('y2', -wire.y2);
            line.att('stroke-width', wire.width);

            // TODO: handle curve and layer...

            rangeBox.left = Math.min(wire.x1, rangeBox.left);
            rangeBox.top = Math.min(-wire.y1, rangeBox.top);
            rangeBox.right = Math.max(wire.x2, rangeBox.right);
            rangeBox.bottom = Math.max(-wire.y2, rangeBox.bottom);
        }

        // draw texts
        for (let pos in texts) {
            let textAtts = texts[pos],
                textVal = texts[pos].value,
                svgtext = parent.ele('text');

            svgtext.att('x', textAtts.x);
            svgtext.att('y', -textAtts.y);
            svgtext.att('font-size', textAtts.size);
            svgtext.att('fill', 'dimgray');
            svgtext.text(textVal);
            if (textAtts.rotation !== 0) {
                svgtext.att('transform', 'rotate(' + -textAtts.rotation + ',' + textAtts.x + ',' + -textAtts.y + ')');
            }

            // TODO: handle layer...
        }

        // draw rectangles
        for (let pos in rectangles) {
            let rect = rectangles[pos],
                svgrect = parent.ele('rect');

            svgrect.att('x', rect.x1);
            svgrect.att('y', rect.y1);
            svgrect.att('width', Math.abs(rect.x2 - rect.x1));
            svgrect.att('height', Math.abs(rect.y2 - rect.y1));
            svgrect.att('fill', 'dimgray');

            // TODO: handle layer...
        }

        // draw smds
        for (let pos in smds) {
            let smd = smds[pos],
                svgrect = parent.ele('rect');

            svgrect.att('x', smd.x - smd.dx / 2);
            svgrect.att('y', smd.y - smd.dy / 2);
            svgrect.att('width', smd.dx);
            svgrect.att('height', smd.dy);
            svgrect.att('fill', 'darkred');
            svgrect.att('opacity', '0.5');

            //TODO: handle layer...
        }

        // draw circles
        for (let pos in circles) {
            let circle = circles[pos],
                svgCircle = parent.ele('circle');

            svgCircle.att('cx', circle.x);
            svgCircle.att('cy', -circle.y);
            svgCircle.att('r', circle.radius);
            svgCircle.att('stroke', 'dimgray');
            svgCircle.att('stroke-width', circle.width);
            svgCircle.att('fill', 'none');

            //TODO: handle layer...
        }

        // draw pads
        // for (let pos in pads) {
        //     let pad = pads[pos],
        //         padContainer = pinGroup.ele('g'),
        //         padRect = pinContainer.ele('rect'),
        //         padCircle = pinContainer.ele('circle'),
        //         pinDirection = pinContainer.ele('text'),
        //         pinCircle = pinContainer.ele('circle'),
        //         pinLength = middleLength; 

        //     // TODO: handle following
        //     // this.shape = obj.shape;
        //     // this.length = obj.length;
        //     // this.visible = obj.visible;
        //     // this.angle = obj.angle;
        //     // this.mirror = obj.mirror;

        //     // calculate start and end point
        //     let startX = parseFloat(pin.x) + pinLength,
        //         startY = -pin.y,
        //         stopX = pin.x,
        //         stopY = -pin.y,
        //         nameOffset = 2.5,
        //         direction = pin.direction || 'io',
        //         swapLevel = pin.swapLevel || '0';

        //     if (pin.angle === "180") {
        //         startX = pin.x - pinLength;
        //         stopX = pin.x;
        //         nameOffset = -7.5;
        //     }

        //     pinLine.att('x1', startX);
        //     pinLine.att('y1', startY);
        //     pinLine.att('x2', stopX);
        //     pinLine.att('y2', stopY);
        //     pinLine.att('stroke-width', pinLineStrokeWidth);
        //     pinLine.att('stroke', 'darkred'); 

        //     pinName.att('x', startX + nameOffset);
        //     pinName.att('y', startY + pinNameSize / 2 );
        //     pinName.att('font-size', pinNameSize);
        //     pinName.att('fill', 'dimgray');
        //     pinName.text(pin.name);

        //     pinDirection.att('x', stopX);
        //     pinDirection.att('y', stopY - pinDirectionSize / 2);
        //     pinDirection.att('font-size', pinDirectionSize);
        //     pinDirection.att('fill', 'green');
        //     pinDirection.text(direction + ' ' + swapLevel);

        //     pinCircle.att('cx', stopX);
        //     pinCircle.att('cy', stopY);
        //     pinCircle.att('r', 1);
        //     pinCircle.att('stroke', 'green');
        //     pinCircle.att('stroke-width', pinCircleStrokeWidth);
        //     pinCircle.att('fill', 'none');

        //     // function
        //     if (pin.function === 'clk') {
        //         let pinFun = pinContainer.ele('polyline');

        //         pinFun.att('points', '' + (startX + 2) + ',' + startY + ' ' + startX + ',' + (stopY - 1) + ' ' + startX + ',' + (startY + 1) + ' ' + (startX + 2) + ',' + startY);
        //         pinFun.att('stroke', 'darkred');
        //         pinFun.att('stroke-width', pinLineStrokeWidth);
        //         pinFun.att('fill', 'white');
        //     } else if (pin.function === 'dot') {
        //         let pinFun = pinContainer.ele('circle');

        //         pinFun.att('cx', startX + 1);
        //         pinFun.att('cy', startY);
        //         pinFun.att('r', 1);
        //         pinFun.att('stroke', 'darkred');
        //         pinFun.att('stroke-width', pinLineStrokeWidth);
        //         pinFun.att('fill', 'white');
        //     }
        // }
    };

    exports.convertEPackageToSketchSVG = function (ePackage, saveTo) {
        let svg = xmlbuilder.create('svg'),
            group = svg.ele('g'),
            viewExtends = { left: -10, top: -10, right: 10, bottom: 10 };

        svg.att('xmlns', 'http://www.w3.org/2000/svg');

        packageToSketchSVG(ePackage, group, viewExtends);

        // set view box, extend a little.
        setViewExtends(svg, viewExtends, rangeBoxScale);
        // name: sketch-400x.svg
        let svgFilePath = path.join(saveTo, 'sketch-' + ePackage.name + '.svg');
        fs.writeFileSync(svgFilePath, svg.toString());
        console.log(svgFilePath + ' saved.');
    };

    // package to sketch svg
    function packageToSketchSVG(ePackage, parent, rangeBox) {
        let symbolName = ePackage.name,
            pads = ePackage.pads,
            wires = ePackage.wires,
            texts = ePackage.texts,
            smds = ePackage.smds,
            rectangles = ePackage.rectangles,
            circles = ePackage.circles,
            wireGroup = parent.ele('g'),
            padGroup = parent.ele('g');

        // draw wires
        wireGroup.att('stroke', "dimgray");

        for (let pos in wires) {
            let wire = wires[pos],
                line = wireGroup.ele('line');

            line.att('x1', wire.x1);
            line.att('y1', -wire.y1);
            line.att('x2', wire.x2);
            line.att('y2', -wire.y2);
            line.att('stroke-width', wire.width);

            // TODO: handle curve and layer...

            rangeBox.left = Math.min(wire.x1, rangeBox.left);
            rangeBox.top = Math.min(-wire.y1, rangeBox.top);
            rangeBox.right = Math.max(wire.x2, rangeBox.right);
            rangeBox.bottom = Math.max(-wire.y2, rangeBox.bottom);
        }

        // draw circles
        for (let pos in circles) {
            let circle = circles[pos],
                svgCircle = parent.ele('circle');

            svgCircle.att('cx', circle.x);
            svgCircle.att('cy', -circle.y);
            svgCircle.att('r', circle.radius);
            svgCircle.att('stroke', 'dimgray');
            svgCircle.att('stroke-width', circle.width);
            svgCircle.att('fill', 'none');

            //TODO: handle layer...
        }
        // draw smds
        for (let pos in smds) {
            let smd = smds[pos],
                svgrect = parent.ele('rect');

            svgrect.att('x', smd.x - smd.dx / 2);
            svgrect.att('y', smd.y - smd.dy / 2);
            svgrect.att('width', smd.dx);
            svgrect.att('height', smd.dy);
            svgrect.att('fill', 'darkred');
            svgrect.att('opacity', '0.5');

            //TODO: handle layer...
        }
    };

    exports.convertEDeviceToSVG = function _convertEDeviceToSVG(device, saveTo) {
        let svg = xmlbuilder.create('svg'),
            group = svg.ele('g'),
            viewExtends = { left: -10, top: -10, right: 10, bottom: 10 };

        svg.att('xmlns', 'http://www.w3.org/2000/svg');

        deviceToSVG(device, group, viewExtends);

        // set view box, extend a little.
        setViewExtends(svg, viewExtends, rangeBoxScale);

        generateSVGAndPNGThumbnail(svg.toString(), device.name, saveTo);
    }

    function deviceToSVG(device, parent, rangeBox) {

        let deviceName = device.name,
            gates = device.gates;

        // draw gates
        for (let pos in gates) {
            let gate = gates[pos],
                svgAdd = parent.ele('text'),
                svgSwap = parent.ele('text');

            // add level
            svgAdd.att('x', gate.x - 30);
            svgAdd.att('y', parseFloat(-gate.y - 30));
            svgAdd.att('font-size', '2');
            svgAdd.att('fill', 'darkgreen');
            svgAdd.text('Add=' + (gate.addLevel || 'next'));

            // swap level
            svgSwap.att('x', gate.x - 30);
            svgSwap.att('y', parseFloat(-gate.y - 32));
            svgSwap.att('font-size', '2');
            svgSwap.att('fill', 'darkgreen');
            svgSwap.text('Swap=' + (gate.swapLevel || '0'));

            // draw this symbol
            let symbolGroup = parent.ele('g'),
                symbolRangeBox = {left: -10, top: -10, right: 10, bottom: 10};
            symbolToSVG(gate.symbol, symbolGroup, symbolRangeBox, gate.name);

            // transform the symbol to gate position
            symbolGroup.att('transform', 'translate(' + gate.x + ',' + gate.y + ')');

            rangeBox.left = Math.min(rangeBox.left, symbolRangeBox.left + parseFloat(gate.x));
            rangeBox.right = Math.max(rangeBox.right, symbolRangeBox.right + parseFloat(gate.x));
            rangeBox.top = Math.min(rangeBox.top, symbolRangeBox.top + parseFloat(gate.y));
            rangeBox.bottom = Math.max(rangeBox.bottom, symbolRangeBox.bottom + parseFloat(gate.y));
        }
    };

    function generateSVGAndPNGThumbnail(svgString, fileName, saveTo) {

        let svgFilePath = path.join(saveTo, fileName + '.svg');
        fs.writeFileSync(svgFilePath, svgString);
        console.log(svgFilePath + ' saved.');
        
        //let pngFilePath = path.join(saveTo, fileName + '.png'); 
        // pnfs.readFile(svgFilePath)
        //     .then(svg2png)
        //     .then(buffer => fs.writeFile(pngFilePath, buffer))
        //     .catch(e => console.error(e));

        // let svgBuffer = Buffer.from(svgString);  
        // svg2png(svgBuffer)
        //     .then(buffer => pnfs.writeFile(pngFilePath, buffer, function (error) {
        //         if (error) {
        //             console.log(error);
        //         } else {
        //             console.log(pngFilePath + ' saved.');
        //         }
        //     }));
    }

    function setViewExtends(svgNode, rangeBox, scale) {

        rangeBox.left *= scale;
        rangeBox.right *= scale;
        rangeBox.top *= scale;
        rangeBox.bottom *= scale;

        let width = rangeBox.right - rangeBox.left,
            height = rangeBox.bottom - rangeBox.top;

        svgNode.att('width', width);
        svgNode.att('height', height);
        svgNode.att('viewBox', '' + rangeBox.left + ' ' + rangeBox.top + ' ' + width + ' ' + height);
    }

    function getPinName(originalName) {
        var orFlag = originalName.indexOf('!');
        if (orFlag === -1)
            return { name: originalName, index: -1 };


    }

    return exports;
};