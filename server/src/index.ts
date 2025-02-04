import app from "./app";

const PORT = process.env.PORT;

const initServer = async () => {
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });
}

initServer();
