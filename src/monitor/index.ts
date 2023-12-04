import Monitor from "./Monitor";
import express from "express";

const app = express();
app.use(express.json());

const monitor = new Monitor();
monitor.startBroadcast();

app.get('/check', async (req, res) => {
    return res.send(monitor.nodes)
});

app.listen(3000);
