const app = require('express')();
const http = require("http");
const socketio = require("socket.io");

const server = http.createServer(app);
const io = socketio.listen(server);
const script = `
	<script src="/socket.io/socket.io.js"></script>
	<script>
		io().on('reload', () => location.reload())
	</script>
`;

let markupCopy;
app.get('/', (req, res) => res.send(markupCopy));

module.exports.init = markup => {
	markupCopy = script + markup;
	server.listen(3000);
	console.log('live on', 3000);
}

module.exports.update = markup => {
	markupCopy = script + markup;
	io.emit('reload');
}
