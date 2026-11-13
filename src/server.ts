import app from "./app";
import config from "./config";

app.listen(config.port, () => {
  console.log(`app is running on ${config.port}`);
});
