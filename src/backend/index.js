var PORT    = 3000;

var express = require('express');
var app     = express();
var utils   = require('./mysql-connector');

app.use(express.json()); 
app.use(express.static('/home/node/app/static/'));

app.get('/devices/', function(req, res, next) {
    utils.query('SELECT * FROM Devices', function(err, rta, field) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(JSON.stringify(rta)).status(200);
    }); 
});

app.get('/devices/:id', function(req, res, next) {
    utils.query('SELECT * FROM Devices WHERE id = ?',req.params.id,
        function(err, rta, field) {
            if (err) {
                res.send(err).status(400);
                return;
            }
            res.send(JSON.stringify(rta[0])).status(200);
        }
    );
});

app.post('/devices/', function(req, res, next) {
    utils.query('INSERT INTO `Devices` (`name`, `description`, `state`, `type`) VALUES (?, ?, ?, ?)',
        [req.body.name, req.body.description, req.body.state, req.body.type],
        function(err, rta, field) {
            if (err) {
                res.send(err).status(400);
                return;
            }
            res.send(JSON.stringify({ 'id': rta.insertId })).status(201);
        }
    );
});

app.put('/devices/:id', function(req, res, next) {
    utils.query('UPDATE `Devices` SET `name` = ?, `description` = ?, `state` = ?, `type` = ? WHERE id = ?',
        [req.body.name, req.body.description, req.body.state, req.body.type, req.params.id],
        function(err, rta, field) {
            if (err) {
                res.send(err).status(400);
                return;
            }
            res.send(JSON.stringify(rta)).status(200);
        }
    );
});

app.delete('/devices/:id', function(req, res, next) {
    utils.query('DELETE FROM Devices WHERE id = ?',req.params.id,
        function(err, rta, field) {
            if (err) {
                res.send(err).status(400);
                return;
            }
            res.send("deleted ok").status(200);
        }
    );
});

app.listen(PORT, function(req, res) {
    console.log("NodeJS API running correctly");
});
