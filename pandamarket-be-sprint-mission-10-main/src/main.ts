import server from './app';
import { PORT } from './lib/constants';

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
