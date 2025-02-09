import { Response } from "express";

interface SendResponseParams {
    res: Response;
    status: string;
    data?: any;
    message: string;
    statusCode?: number;
    apiVersion?: string;
}

const sendResponse = ({
    res,
    status,
    data,
    message,
    statusCode = 200,
    apiVersion = "No Version",
}: SendResponseParams): Response => {
    return res.status(statusCode).json({
        status,
        data,
        message,
        apiVersion,
    });
};

export default sendResponse;
