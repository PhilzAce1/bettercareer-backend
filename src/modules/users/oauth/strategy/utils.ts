import axios from 'axios';
import CustomError from '../../../../helpers/error.js';

type exchangeCodePayload = {
    code: string
};

export const exchangeLinkedInCode = async (data: exchangeCodePayload) => {

    const { code } = data;

    try {
        if (!code) throw new CustomError({
            message: 'LinkedIn OAuth code is required.',
            statusCode: 404,
            code: 'OAUTH ERROR'
        });

        const token = await axios.post(`${process.env.LINKED_ACCESS_TOKEN_API}`, {
            grant_type: "authorization_code",
            code: data.code,
            client_id: process.env.LINKEDIN_OAUTH_CLIENT_ID,
            client_secret: process.env.LINNKEDIN_OAUTH_CLIENT_SECRET,
            redirect_uri: 'https://bettercareer-staging-api.fly.dev/api/v1/oauth/linkedin'
        }, {
            headers: {
                'content-type': 'x-www-form-urlencoded'
            }
        });

        return {
            token: token.data.access_token,
            expires_in: token.data.expires_in,
            refresh_token: token.data.refresh_token,
            refresh_token_expires_in: token.data.refresh_token_expires_in,
            scope: token.data.scope,
        };
    } catch (error: any|unknown) {
        throw new CustomError({
            message: error.message,
            statusCode: 404,
            code: '-ERROR'
        });
    }
};

export const getLinkedInUserData = async (token?: string) => {
    if (!token) throw new CustomError({
        message: 'LinkedIn user access token is required.',
        statusCode: 404,
        code: 'OAUTH ERROR'
    });

    let response = await axios.get(`${process.env.LINKED_USER_INFO_API}`, {
        headers: {
            'Authorization': `Bearer ${token}`
          } 
    });

    return {
        sub: response.data.sub,
        name: response.data.name,
        photo: response.data.picture,
        email: response.data.email,
        email_verified: response.data.email_verified,
    };
};