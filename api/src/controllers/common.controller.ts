import httpStatus from "http-status";
import sendMail from "../utils/sendMail";
import sanitiseReqBody from '../helpers/sanetize';
import ApiError from "../utils/APIError";
import { Request, Response } from 'express';

export const sendMailForMessage = async (req: Request, res: Response) => {
    try {
        let sanitiseBody: any = {};
        for (let key in req.body) {
          let unsafeValue = req.body[key];
          let safeValue = await sanitiseReqBody(unsafeValue);
          sanitiseBody[key] = safeValue;
        } 
        const {name, message} = sanitiseBody;
        let htmlContent = `<h2>${name},</h2><p>${message}</p>`;
        await sendMail({ email: 'karankhatik.dev@gmail.com', subject: "Some one contacting you", bodyHtml:htmlContent  });
        res.status(httpStatus.OK).json({
            success: true,
            message: "Message sent successfully"
        })
    } catch (error) {        
        res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            message: "Request failed. Please check your request and try again.",
        });
    }
}