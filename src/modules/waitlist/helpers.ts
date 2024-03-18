import { fileTypeFromBuffer } from 'file-type';
import React from 'react';
import { Resend } from 'resend';
import {
  WaitListEmail,
  WaitlistEmailProps,
} from './emails/waitlist.js';

export const isValidPDF = async (fileBuffer?: Buffer) => {
  if (!Buffer.isBuffer(fileBuffer)) return false;

  const PDF_MIME = 'application/pdf';
  const fileType = await fileTypeFromBuffer(fileBuffer);
  return fileType?.mime === PDF_MIME;
};

type WaitListEmailParams = WaitlistEmailProps & {
  email: string;
};

export const sendWaitlistEmail = async (
  params: WaitListEmailParams,
) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  return resend.emails.send({
    subject: 'Waitlist',
    from: process.env.RESEND_FROM as string,
    to: [params.email],
    react: <React.ReactElement>WaitListEmail({
      name: params.name,
    }),
  });
};
