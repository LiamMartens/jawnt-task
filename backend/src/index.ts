import { config } from "dotenv";
import createApp from "./app.js";

config({ path: ".env" });

const app = createApp();
const port = 8000;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
