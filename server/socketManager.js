"use strict";

const mazeGen = require('./mazeGen.js');
let bMazes = fillBMazes();


module.exports = function(server){

	const io = require("socket.io").listen(server);

	io.sockets.on('connection', function(socket){

		sendBMaze(socket);

		socket.on('requestMaze', function(size){
			const maze = new mazeGen(size);
			socket.emit('incomingMaze', maze);
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