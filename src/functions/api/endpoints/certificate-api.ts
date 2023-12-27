import express, { Request, Response } from 'express';
import { catchExpressJsErrorWrapper, validateApiPayload, verifyTrustedServiceRequest } from '../utils';
import { certificateSpreadsheet } from 'core/certificates/spreadsheet';
import {
  GenerateCertificatePostBody,
  ListCertificatesQueryParams,
  generateCertificatePostBodySchema,
  listCertificatesQueryParamsSchema,
} from './schema';
import { generateCertificatePDF } from 'core/certificates/generators/certificateGenerator';
import { CertificateType } from 'core/certificates/types';
import { uploadPDFToS3 } from 'core/aws/s3';

const listCertificates = async (req: Request<any, any, any, ListCertificatesQueryParams>, res: Response) => {
  verifyTrustedServiceRequest(req);

  const query = validateApiPayload(req.query, listCertificatesQueryParamsSchema);

  const certs = await certificateSpreadsheet.getAllItems({
    isaId: query.userId,
    email: query.email,
  });

  res.json({ items: certs });
};

const generateCertificate = async (req: Request<any, any, GenerateCertificatePostBody>, res: Response) => {
  verifyTrustedServiceRequest(req);

  const body = validateApiPayload(req.body, generateCertificatePostBodySchema);

  const { pdfBytes } = await generateCertificatePDF({
    certificateType: body.certificateType as CertificateType,
    certificateId: body.certificateId,
    subject: body.subject,
    language: body.language,
  });

  const buffer = Buffer.from(pdfBytes);
  const { presignedUrl } = await uploadPDFToS3(`certificates/${body.certificateId}-${body.language}.pdf`, buffer);

  res.json({ downloadUrl: presignedUrl });
};

export const certificateApi = express.Router();
certificateApi.get('/', catchExpressJsErrorWrapper(listCertificates));
certificateApi.post('/generate', catchExpressJsErrorWrapper(generateCertificate));
