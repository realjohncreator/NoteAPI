import mongoose from "mongoose";
import app from "./app";
import env from "./utils/validateEnv";

// Server Config
const port = env.PORT;

// Db Config
const DB_URI = env.DB_CONNECTION_STRING_URI;
mongoose.connect(DB_URI)
    .then(() => {
        console.log("Database connection established successfully!");
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => console.log(error));
