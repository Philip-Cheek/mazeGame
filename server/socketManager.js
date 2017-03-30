"use strict";

const mazeGen = require('./mazeGen.js'),
      clientManager = require('./clientManager.js');

let bMazes = fillBMazes();


module.exports = function(server){

	const io = require("socket.io").listen(server);

	io.sockets.on('connection', function(socket){

		sendBMaze(socket);

		socket.on('requestMaze', function(size){
			const maze = new mazeGen(size);
			socket.emit('incomingMaze', maze);
		});

		socket.on('connectTwoP', function(){
			const connect = clientManager.requestRoom(socket);

			if (connect.status){ 
				io.sockets.in(connect.room).emit("connectedTwoP", connect.room);
			}
		})

		socket.on('updatePlayerCoord', function(data){
			if (data.coord.length == 2){
				socket.broadcast.to(data.room).emit('enemyUpdate', data.coord);
			}
		})

		socket.on('playerWin', function(room){
			socket.broadcast.to(room).emit('enemyFinish');
		});

		socket.on('requestMazeForRoom', function(data){
			const maze = new mazeGen(data.size);
			io.sockets.in(data.room).emit('incomingMaze', maze);
		});
			

	});

	return io;
}

function sendBMaze(socket){
	if (!bMazes || bMazes.length < 3){ 
		bMazes = fillBMazes() 	
	}

	const bMaze = bMazes[
		Math.floor(Math.random() * bMazes.length)
	];

	socket.emit('backgroundMaze', bMaze);
}


function fillBMazes(){
	return [
		new mazeGen(100),
		new mazeGen(100),
		new mazeGen(100)
	]
}