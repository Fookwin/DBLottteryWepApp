exports.index = function (req, res) {
    res.render('index.html');
};

exports.manage = function (req, res) {
    res.render('manage.html');
};

exports.diagram = function (req, res) {
    res.render('diagram.html');
};