import { server }  from "./app";

const PORT = process.env.PORT || 3000;

server.server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});