"use strict";

class ClientManager {

	constructor(){
		this.queue = [];
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

		return {'status': true, room: room};
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
