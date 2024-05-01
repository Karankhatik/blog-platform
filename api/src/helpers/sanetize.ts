import * as httpStatus from "http-status";
import { JSDOM } from 'jsdom';
const { window } = new JSDOM('');
import DOMPurify from 'dompurify';

const createDOMPurify = DOMPurify(window);

interface SanitiseConfig {
    ALLOWED_TAGS: string[];
    ALLOWED_ATTR: string[];
    ALLOW_DATA_ATTR: boolean;
    FORBID_SCRIPTS: boolean;
    FORBID_TAGS: string[];
}

const sanitiseReqBody = async (data: any): Promise<any> => {
    try {
        const config: SanitiseConfig = {
            ALLOWED_TAGS: [], // don't allow any tags
            ALLOWED_ATTR: [], // don't allow any attributes
            ALLOW_DATA_ATTR: false, // disallow data-* attributes
            FORBID_SCRIPTS: true, // forbid <script> tags and event attributes
            FORBID_TAGS: ['style'], // forbid <style> tags
        };

        const sanitiseInput = async (input: any): Promise<any> => {
            if (input === null || input === undefined) {
                return null;
            } else if (Array.isArray(input)) {
                const sanitizedInput: any[] = [];
                for (let i = 0; i < input.length; i++) {
                    const sanitizedValue = await sanitiseInput(input[i]);
                    sanitizedInput.push(sanitizedValue);
                }
                return sanitizedInput;
            } else if (typeof input === 'object') {
                const sanitizedInput: { [key: string]: any } = {};
                for (const key in input) {
                    if (Object.prototype.hasOwnProperty.call(input, key)) {
                        const sanitizedValue = await sanitiseInput(input[key]);
                        sanitizedInput[key] = sanitizedValue;
                    }
                }
                return sanitizedInput;
            } else if (typeof input === 'string') {
                const sanitizedValue = createDOMPurify.sanitize(input, config);
                const maliciousPayloadRegex = /javascript:/gi;
                const sanitizedValueWithoutMaliciousPayload = sanitizedValue.replace(maliciousPayloadRegex, '');
                if (input.length === 0)
                    return '';
                else
                    return sanitizedValueWithoutMaliciousPayload.trim() || null;
            } else {
                return input;
            }
        };

        const cleanData = await sanitiseInput(data);

        if (cleanData === null || cleanData === undefined) {
            return null;
        } else if (Array.isArray(cleanData)) {
            return cleanData.length > 0 ? cleanData : [];
        } else if (typeof cleanData === 'object') {
            return Object.keys(cleanData).length > 0 ? cleanData : {};
        } else {
            return cleanData;
        }
    } catch (error) {
        console.error("Internal server error: ", error);
        throw new Error("Internal server error");
    }
};

export default sanitiseReqBody;
