import { PORT } from './lib/constants';
import { createServer } from 'http';
import socketService from './services/socketService';
import app from "./main"

const server = createServer(app);
socketService.initialize(server);

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});