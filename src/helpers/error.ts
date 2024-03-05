import { FastifyError } from '@fastify/error';

interface CustomErrorParams {
    name?: string;
    message: string;
    statusCode: number;
    code: string;
}

export default class CustomError extends Error implements FastifyError {
    code: string;
    statusCode?: number;
    message: string;

    constructor({message, statusCode, code}: CustomErrorParams) {
        super(message)
        this.message = message;
        this.statusCode = statusCode;
        this.code = code || 'ERROR';
    }

};
