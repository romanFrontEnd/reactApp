/**
 * This file provided by Facebook is for non-commercial testing and evaluation purposes only.
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http');
var parseString = require('xml2js').parseString;

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/feeds.xml', function(req, res) {

    debugger;
    console.log("debug is running");
    var data  = getFeedData()
    /*fs.readFile('feeds.xml', function(err, data) {
        res.setHeader('Content-Type', 'application/xml');
        res.send(data);
    });*/
});

app.post('/feeds.xml', function(req, res) {
    fs.readFile('feeds.xml', function(err, data) {
        parseString(data, function (err, result) {
            var fullJson = JSON.parse(JSON.stringify(result));

            var categories = JSON.stringify(fullJson["oxip"]["response"][0]);
            fs.writeFile('feed.json', categories , function(err) {
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Cache-Control', 'no-cache');
                res.send(categories);
            });
        });
    });
});



function getFeedData() {

    http.get({
        host: 'http://xmlfeeds-tst2.coral.co.uk/oxi/pub',
        path: ''
    }, function(res) {
        console.error('UData recekved', res.body);

        // explicitly treat incoming data as utf8 (avoids issues with multi-byte chars)
        res.setEncoding('utf8');
debugger;
        // incrementally capture the incoming response body
        var body = '';
        res.on('data', function(d) {
            body += d;
        });

        // do whatever we want with the response once it's done
        res.on('end', function() {
            try {
                var parsed = JSON.parse(body);
            } catch (err) {
                console.error('Unable to parse response as JSON', err);
                return cb(err);
            }


        });
    }).on('error', function(err) {
        // handle errors with the request itself
        console.error('Error with the request:', err.message);
        cb(err);
    });

}


app.listen(app.get('port'), function() {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});
