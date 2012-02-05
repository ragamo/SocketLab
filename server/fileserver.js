var serverConfig = {
	host: '192.168.1.36',
	port: 2000	
};

/**
 * HTTP SERVER
 */	
var http = require('http'),
	fs = require('fs');
	
var server = http.createServer(function (req, res) {
	fs.readFile('../'+req.url, "binary", function(err, data){
		res.writeHead(200);
		if (err) {
			res.end('File not found');
		} else {
			if (data) res.write(data);
			res.end();
		}
	});
});

/**
 * SOCKET IO
 */
var io = require('socket.io').listen(server, { transports: ['websocket']}),
	players = {};

//Set up events
//From: https://github.com/cubiq/socket-balls/blob/master/server.js
io.sockets.on('connection', function (socket) { 
	// Send to the new user the list of active players
	socket.emit('playerslist', { list: players });

	// Add the new user to the list of players
	players[socket.id] = { x:0, y:0 }

	// Broadcast the new user to all players
	socket.broadcast.emit('new', { id: socket.id }, [socket.id]);

	socket.on('message', function (message) {
		if (message.type != 'position') {
			return;
		}

		// Broadcast the new user position
		players[message.id] = { x: message.x, y: message.y };
		//socket.broadcast({ type: 'position', id: message.id, x: message.x, y: message.y }, [client.id]);
		socket.emit('position', { list: players });
	});
	
	socket.on('disconnect', function () {
		// Remove the user from the list of players
		delete players[this.id];

		// Broadcast the logged out user's id
		socket.broadcast.emit('leave', { id: this.id });
	});
 
});

/**
 * START SERVER
 */
server.listen(serverConfig.port, serverConfig.host);
console.log('Server running at http://'+serverConfig.host+':'+serverConfig.port+'/');