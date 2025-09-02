import app from "./app";
import { PORT } from "./lib/constants";

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});