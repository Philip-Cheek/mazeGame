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
		console.log(this.queue.length);
		socket.join(room);
		peer.join(room);

		return {'status': true, room: room};
	}
}

module.exports = new ClientManager();
