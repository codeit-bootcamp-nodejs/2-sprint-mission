import { PORT } from "./lib/constants";
import http from "http";
import app from './app';

const httpServer = http.createServer(app);

httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export { httpServer }