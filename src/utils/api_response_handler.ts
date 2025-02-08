import { Response } from 'express';

interface SendResponseParams {
    res: Response;
    status: string;
    data: any;
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
    apiVersion
}: SendResponseParams) => {
    const obj = {
        status,
        data,
        message,
        apiVersion: apiVersion || 'No Version'
    };

    // If you want to encrypt the data, you can uncomment the following lines:
    // const encData = CryptoJS.AES.encrypt(JSON.stringify(obj), 'secretcorsymo').toString();
    // return res.status(statusCode).json({ encryptedData: encData });

    return res.status(statusCode).json(obj);
};

export default sendResponse;