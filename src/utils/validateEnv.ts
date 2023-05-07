import {cleanEnv, port, str} from "envalid";

export default cleanEnv(process.env, {
    DB_CONNECTION_STRING_URI: str(),
    PORT: port()
});
