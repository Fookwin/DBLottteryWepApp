import axios from 'axios';
import * as d3 from 'd3';

var cell_width = 20,
    odd_color = 'white',
    even_color = 'lightgrey',
    grid_line_width = 0.3,
    content_grid_line_color = 'grey',
    head_grid_line_color = 'grey',
    header_back_color = 'lightyellow',
    header_text_color = 'black';

var cornerGrids = {
    width: 3,
    height: 3,
    data: [
        { title: '期号', pos: [0, 0, 3, 3] }
    ]
};

var headerGrids = {
    width: 54,
    height: 3,
    data: [
        { title: '开奖号码', pos: [0, 0, 5, 3] },
        { title: '红球', pos: [5, 0, 33, 1] },
        { title: '前区', pos: [5, 1, 11, 1] },
        { title: '中区', pos: [16, 1, 11, 1] },
        { title: '后区', pos: [27, 1, 11, 1] },
        { title: '01', pos: [5, 2, 1, 1] },
        { title: '02', pos: [6, 2, 1, 1] },
        { title: '03', pos: [7, 2, 1, 1] },
        { title: '04', pos: [8, 2, 1, 1] },
        { title: '05', pos: [9, 2, 1, 1] },
        { title: '06', pos: [10, 2, 1, 1] },
        { title: '07', pos: [11, 2, 1, 1] },
        { title: '08', pos: [12, 2, 1, 1] },
        { title: '09', pos: [13, 2, 1, 1] },
        { title: '10', pos: [14, 2, 1, 1] },
        { title: '11', pos: [15, 2, 1, 1] },
        { title: '12', pos: [16, 2, 1, 1] },
        { title: '13', pos: [17, 2, 1, 1] },
        { title: '14', pos: [18, 2, 1, 1] },
        { title: '15', pos: [19, 2, 1, 1] },
        { title: '16', pos: [20, 2, 1, 1] },
        { title: '17', pos: [21, 2, 1, 1] },
        { title: '18', pos: [22, 2, 1, 1] },
        { title: '19', pos: [23, 2, 1, 1] },
        { title: '20', pos: [24, 2, 1, 1] },
        { title: '21', pos: [25, 2, 1, 1] },
        { title: '22', pos: [26, 2, 1, 1] },
        { title: '23', pos: [27, 2, 1, 1] },
        { title: '24', pos: [28, 2, 1, 1] },
        { title: '25', pos: [29, 2, 1, 1] },
        { title: '26', pos: [30, 2, 1, 1] },
        { title: '27', pos: [31, 2, 1, 1] },
        { title: '28', pos: [32, 2, 1, 1] },
        { title: '29', pos: [33, 2, 1, 1] },
        { title: '30', pos: [34, 2, 1, 1] },
        { title: '31', pos: [35, 2, 1, 1] },
        { title: '32', pos: [36, 2, 1, 1] },
        { title: '33', pos: [37, 2, 1, 1] },
        { title: '篮球', pos: [38, 0, 16, 1] },
        { title: '前区', pos: [38, 1, 8, 1] },
        { title: '后区', pos: [46, 1, 8, 1] },
        { title: '01', pos: [38, 2, 1, 1] },
        { title: '02', pos: [39, 2, 1, 1] },
        { title: '03', pos: [40, 2, 1, 1] },
        { title: '04', pos: [41, 2, 1, 1] },
        { title: '05', pos: [42, 2, 1, 1] },
        { title: '06', pos: [43, 2, 1, 1] },
        { title: '07', pos: [44, 2, 1, 1] },
        { title: '08', pos: [45, 2, 1, 1] },
        { title: '09', pos: [46, 2, 1, 1] },
        { title: '10', pos: [47, 2, 1, 1] },
        { title: '11', pos: [48, 2, 1, 1] },
        { title: '12', pos: [49, 2, 1, 1] },
        { title: '13', pos: [50, 2, 1, 1] },
        { title: '14', pos: [51, 2, 1, 1] },
        { title: '15', pos: [52, 2, 1, 1] },
        { title: '16', pos: [53, 2, 1, 1] }
    ]
};

function drawGrids(container, defination) {

    let overall_width = defination.width * cell_width;
    let overall_height = defination.height * cell_width;

    let svg = d3.select(container).append("svg")
        .style("float", "left")
        .attr("width", overall_width)
        .attr("height", overall_height)
        .append("g");

    let scale_x = d3.scaleBand()
        .domain(d3.range(defination.width))
        .range([0, overall_width]);

    let scale_y = d3.scaleBand()
        .domain(d3.range(defination.height))
        .range([0, overall_height]);

    // define rows
    let header_cells = svg.selectAll(".header_cell")
        .data(defination.data)
        .enter().append("g")
        .attr("class", "header_cell")
        .attr("transform", function (d) { return "translate(" + scale_x(d.pos[0]) + "," + scale_y(d.pos[1]) + ")"; })
        .style("fill", head_grid_line_color);

    // draw rect for the cell
    header_cells.append('rect')
        .attr("width", function (d) { return scale_x.bandwidth() * d.pos[2]; })
        .attr("height", function (d) { return scale_y.bandwidth() * d.pos[3]; })
        .attr("fill", header_back_color)
        .style("stroke-width", grid_line_width)
        .style("stroke", head_grid_line_color);

    header_cells.append("text")
        .attr("font-size", "10px")
        .attr("dy", ".36em")
        .attr("x", function (d) { return scale_x.bandwidth() * d.pos[2] / 2; })
        .attr("y", function (d) { return scale_y.bandwidth() * d.pos[3] / 2; })
        .attr("text-anchor", "middle")
        .style("fill", header_text_color)
        .text(function (d, i) { return d.title; });
}

function drawLeftColumn(container, data) {

    let issue_count = data.length,
        overall_width = cell_width * 3,
        overall_height = cell_width * issue_count;

    if (!data) {
        throw new Error('Please pass data');
    }

    if (!Array.isArray(data) || !data.length || !Array.isArray(data[0])) {
        throw new Error('It should be a 2-D array');
    }

    let svg = d3.select(container).append("svg")
        .style("float", "left")
        .attr("width", overall_width)
        .attr("height", overall_height)
        .append("g");

    let scale_y = d3.scaleBand()
        .domain(d3.range(issue_count))
        .range([0, overall_height]);

    // define rows
    let data_rows = svg.selectAll(".row")
        .data(data)
        .enter().append("g")
        .attr("class", "row")
        .attr("transform", function (d, i) { return "translate(0," + scale_y(i) + ")"; })
        .style("fill", function (d, i) { return i % 2 === 0 ? odd_color : even_color; });

    drawIssuecolumn(data_rows, overall_width, 0, scale_y);
}

function drawIssuecolumn(rows, issue_width, offset_x, scale_y) {
    var issue_cell = rows.selectAll(".issue_cell")
        .data(function (d) { return [d[0]]; })
        .enter().append("g")
        .attr("class", "issue_cell");

    // draw rect for the cell
    issue_cell.append('rect')
        .attr("x", offset_x)
        .attr("width", issue_width)
        .attr("height", scale_y.bandwidth())
        .style("stroke-width", grid_line_width)
        .style("stroke", content_grid_line_color);

    issue_cell.append("text")
        .attr("font-size", "8px")
        .attr("dy", ".36em")
        .attr("x", offset_x + issue_width / 2)
        .attr("y", scale_y.bandwidth() / 2)
        .attr("text-anchor", "middle")
        .style("fill", 'grey')
        .text(function (d) { return d; });
}

function drawLottoColumn(rows, lotto_width, offset_x, scale_y) {

    var lotto_cell = rows.selectAll(".lotto_cell")
        .data(function (d) { return [{ reds: getLottoStr(d.slice(1, 7)), blue: formatNumberAs00(d[7]) }]; })
        .enter().append("g")
        .attr("class", "lotto_cell");

    // draw rect for the cell
    lotto_cell.append('rect')
        .attr("x", offset_x)
        .attr("width", lotto_width)
        .attr("height", scale_y.bandwidth())
        .style("stroke-width", grid_line_width)
        .style("stroke", content_grid_line_color);

    let lotto_text = lotto_cell.append("text")
        .attr("font-size", "8px")
        .attr("dy", ".36em")
        .attr("x", offset_x + lotto_width / 2)
        .attr("y", scale_y.bandwidth() / 2)
        .attr("text-anchor", "middle")
        .style("fill", 'darkred')
        .text(function (d, i) { return d.reds; });

    lotto_text.append("tspan")
        .attr("text-anchor", "left")
        .style("fill", 'darkblue')
        .text(function (d, i) { return d.blue; });
}

function drawContent(container, data) {
    let lotte_width = cell_width * 5,
        red_cell_count = 33,
        blue_cell_count = 16,
        issue_count = data.length,
        overall_width = cell_width * (red_cell_count + blue_cell_count) + lotte_width,
        overall_height = cell_width * issue_count;

    if (!data) {
        throw new Error('Please pass data');
    }

    if (!Array.isArray(data) || !data.length || !Array.isArray(data[0])) {
        throw new Error('It should be a 2-D array');
    }

    let svg = d3.select(container).append("svg")
        .style("float", "left")
        .attr("width", overall_width)
        .attr("height", overall_height)
        .append("g");

    let scale_y = d3.scaleBand()
        .domain(d3.range(issue_count))
        .range([0, overall_height]);

    // define rows
    let data_rows = svg.selectAll(".row")
        .data(data)
        .enter().append("g")
        .attr("class", "row")
        .attr("transform", function (d, i) { return "translate(0," + scale_y(i) + ")"; })
        .style("fill", function (d, i) { return i % 2 === 0 ? odd_color : even_color; });

    let red_field_scale_x = d3.scaleBand()
        .domain(d3.range(red_cell_count))
        .range([lotte_width, lotte_width + cell_width * red_cell_count]);

    let blue_field_scale_x = d3.scaleBand()
        .domain(d3.range(blue_cell_count))
        .range([lotte_width + red_cell_count * cell_width, overall_width]);

    // draw the connection lines
    drawBlueConnection(svg, data, blue_field_scale_x, scale_y);
    drawRedField(data_rows, red_field_scale_x, scale_y);
    drawBlueField(data_rows, blue_field_scale_x, scale_y);
    drawLottoColumn(data_rows, lotte_width, 0, scale_y);
}

function drawBlueConnection(svg, data, scale_x, scale_y) {
    // form the data for connection
    let connection_data = [],
        offset_y = scale_y.bandwidth() / 2,
        offset_x = scale_x.bandwidth() / 2,
        shorter_len = scale_y.bandwidth() - 4;

    data.forEach(function (val, index) {
        if (index > 0) {
            connection_data[index - 1] = calculateLinePoints(scale_x(data[index - 1][7] - 1), 0, scale_x(val[7] - 1), scale_y.bandwidth(), shorter_len);
        }
    });

    // draw the connection line between rows
    let red_connection = svg.selectAll(".red_connection")
        .data(connection_data)
        .enter().append("g")
        .attr("class", "red_connection")
        .attr("transform", function (d, i) { return "translate(" + offset_x + "," + (scale_y(i) + offset_y) + ")"; });

    red_connection.append('line')
        .attr("x1", function (d) { return d.x1; })
        .attr("y1", function (d) { return d.y1; })
        .attr("x2", function (d) { return d.x2; })
        .attr("y2", function (d) { return d.y2; })
        .attr("transform-origin", "center")
        .style("stroke-width", 1)
        .style('stroke', 'darkblue');

    function calculateLinePoints(x1, y1, x2, y2, shorter) {
        let disX = x2 - x1,
            disY = y2 - y1,
            distance = Math.sqrt(disX * disX + disY * disY),
            lineLength = distance - shorter,
            scale = lineLength / distance,
            halfX = (x1 + x2) / 2,
            halfY = (y1 + y2) / 2;

        return {
            x1: halfX - disX * scale / 2,
            x2: halfX + disX * scale / 2,
            y1: halfY - disY * scale / 2,
            y2: halfY + disY * scale / 2
        };
    }
}

function drawRedField(rows, scale_x, scale_y) {

    // define the red number cells
    let red_cell = rows.selectAll(".red_cell")
        .data(function (d) { return d.slice(8, 41); })
        .enter().append("g")
        .attr("class", "red_cell")
        .attr("transform", function (d, i) { return "translate(" + scale_x(i) + ", 0)"; });

    // draw rect for cell
    red_cell.append('rect')
        .attr("width", scale_x.bandwidth())
        .attr("height", scale_y.bandwidth())
        .style("stroke-width", grid_line_width)
        .style("stroke", content_grid_line_color);

    red_cell.append("text")
        .attr("font-size", "10px")
        .attr("dy", ".36em")
        .attr("x", scale_x.bandwidth() / 2)
        .attr("y", scale_y.bandwidth() / 2)
        .attr("text-anchor", "middle")
        .style("fill", 'grey')
        .text(function (d, i) { return formatNumberAs00(d); });

    // draw circle for hint number
    let hint_red_cell = rows.selectAll(".hint_red_cell")
        .data(function (d) { return d.slice(1, 7); })
        .enter().append("g")
        .attr("class", "hint_red_cell")
        .attr("transform", function (d, i) { return "translate(" + scale_x(d - 1) + ", 0)"; })
        .on('mouseover', function (d) {
            d3.select(this).select("circle").style("fill", 'grey');
        })
        .on('mouseout', function (d) {
            d3.select(this).select("circle").style("fill", 'darkred');
        });

    hint_red_cell.append('circle')
        .attr("cx", scale_x.bandwidth() / 2)
        .attr("cy", scale_y.bandwidth() / 2)
        .attr("r", scale_x.bandwidth() / 2 - 2)
        .style("stroke-width", 0)
        .style("fill", 'darkred');

    hint_red_cell.append("text")
        .attr("font-size", "10px")
        .attr("dy", ".36em")
        .attr("x", scale_x.bandwidth() / 2)
        .attr("y", scale_y.bandwidth() / 2)
        .attr("text-anchor", "middle")
        .style("fill", 'white')
        .text(function (d, i) { return formatNumberAs00(d); });
}

function drawBlueField(rows, scale_x, scale_y) {

    // define the blue number cells
    let blue_cell = rows.selectAll(".blue_cell")
        .data(function (d) { return d.slice(41, 58); })
        .enter().append("g")
        .attr("class", "blue_cell")
        .attr("transform", function (d, i) { return "translate(" + scale_x(i) + ", 0)"; });

    // draw rect for cell
    blue_cell.append('rect')
        .attr("width", scale_x.bandwidth())
        .attr("height", scale_y.bandwidth())
        .style("stroke-width", grid_line_width)
        .style("stroke", content_grid_line_color);

    blue_cell.append("text")
        .attr("font-size", "10px")
        .attr("dy", ".36em")
        .attr("x", scale_x.bandwidth() / 2)
        .attr("y", scale_y.bandwidth() / 2)
        .attr("text-anchor", "middle")
        .style("fill", 'grey')
        .text(function (d, i) { return formatNumberAs00(d); });

    // draw circle for hint number
    let hint_blue_cell = rows.selectAll(".hint_blue_cell")
        .data(function (d) { return [d[7]]; })
        .enter().append("g")
        .attr("class", "hint_blue_cell")
        .attr("transform", function (d, i) { return "translate(" + scale_x(d - 1) + ", 0)"; })
        .on('mouseover', function (d) {
            d3.select(this).select("circle").style("fill", 'grey');
        })
        .on('mouseout', function (d) {
            d3.select(this).select("circle").style("fill", 'darkblue');
        });

    hint_blue_cell.append('circle')
        .attr("cx", scale_x.bandwidth() / 2)
        .attr("cy", scale_y.bandwidth() / 2)
        .attr("r", scale_x.bandwidth() / 2 - 2)
        .style("stroke-width", 0)
        .style("fill", 'darkblue');

    hint_blue_cell.append("text")
        .attr("font-size", "10px")
        .attr("dy", ".36em")
        .attr("x", scale_x.bandwidth() / 2)
        .attr("y", scale_y.bandwidth() / 2)
        .attr("text-anchor", "middle")
        .style("fill", 'white')
        .text(function (d) { return formatNumberAs00(d); });
}

function formatNumberAs00(num) {
    const num_pad = '00';
    var str = "" + num;
    return num_pad.substring(0, num_pad.length - str.length) + str;
}

function getLottoStr(reds) {
    let str = '';
    reds.forEach(function (value) { str += formatNumberAs00(value) + ' ' });
    return str;
}

function DrawDiagram(cb) {
    drawGrids('#cornerBlock', cornerGrids);
    drawGrids('#headerBlock', headerGrids);

    // get the data from service.
    axios.get('/api/v1/sql/obmission/?count=30')
    .then(response =>  {
        console.log(response);

        let data = response.data.data;
        drawLeftColumn('#issuesBlock', data);
        drawContent('#contentBlock', data);

        cb();
    });
}

export default DrawDiagram;