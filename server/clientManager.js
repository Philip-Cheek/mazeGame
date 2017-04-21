"use strict";

class ClientManager {

	constructor(){
		this.queue = [];
		this.rooms = {};
	}

	requestRoom(socket){
		if (this.queue.length < 1){
			this.queue.push(socket)
			return {'status': false}
		}

		const peer = this.queue[0],
			  room = socket.id + '#' + peer.id;

		this.queue.splice(0, 1);
		socket.join(room);
		peer.join(room);

		this.rooms[socket.id] = room;
		this.rooms[peer.id] = room;

		return {'status': true, room: room};
	}

	removeRoom(room){
		for (let sock in this.rooms){
			if (this.rooms[sock] = room){
				delete this.rooms[sock];
			}
		}
	}

	leaveRoom(socketID){
		const room = this.rooms[socketID];
		if (room){ 
			delete this.rooms[socketID];
			return room;
		}
	}

	leaveQueue(socketID){
		for (let i = this.queue.length - 1; i >= 0; i--){
			if (this.queue[i].id == socketID){
				this.queue.splice(i, 1);
			}
		}
	}
}

module.exports = new ClientManager();
