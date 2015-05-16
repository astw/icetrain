var jwt = require("jwt-simple");

var secret = "this is my secret";

module.exports = function (req, res) {
    
    console.log(JSON.stringify(req.headers));

    res.json(jobs);
};



var jobs = [
    'Cook',
    'SupperHero',
    'Unicorn Wisperer',
    'Toast Inspector'
];