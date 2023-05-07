import express, {NextFunction, Request, Response} from "express";
import "dotenv/config";
import noteRoutes from "./routes/notes";
import morgan from "morgan";
import createHttpError, {isHttpError} from "http-errors";
import cors from "cors";

const app = express();

// middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.options("*", cors());

// routes
app.use("/api/notes", noteRoutes);

// 404 handler
app.use((req, res, next) => {
    next(createHttpError(404, "Page not found!"));
});

// Error handler
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    let errorMessage = "An unknown error occurred";
    let statusCode = 500;
    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({
        message: errorMessage
    });
});
export default app;                                                                  
