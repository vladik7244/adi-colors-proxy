const express = require('express');
const app = express();
const morgan = require('morgan');
const request = require('request');
const cors = require('cors');

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'));
app.use(cors());

const port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
const ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';


app.get('/', function (req, res) {
  res.render('index.html', {pageCountMessage: null});
});

app.get('/colors', function (req, res, next) {
  request(`http://www.wix.com/_api/onboarding-custom-pallete-server-webapp/coloring/colorMatches?color=${req.query.color}&limit=${req.query.limit || 6}`, (err, response, body) => {
    if (err) {
      res.send({
        error: true,
      })
    }
    res.send(body);
  });
});

// error handling
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app;
