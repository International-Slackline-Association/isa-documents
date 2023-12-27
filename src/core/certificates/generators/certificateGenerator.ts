import { PDFDocument } from 'pdf-lib';
import { CertificateType } from '../types';
import { certificateSpreadsheet } from '../spreadsheet';
import { pdfGenerators } from './pdfGenerators';
import { formatCertificateDate, signCertificate } from './utils';

type GenerateCertificatePayload = {
  certificateId: string;
  subject: string;
  language: string;
  skipQRCode?: boolean;
};

export const generateCertificatePDF = async (
  payload: {
    certificateType: CertificateType;
  } & GenerateCertificatePayload,
) => {
  const { certificateType, certificateId, subject, language, skipQRCode } = payload;
  let pdf: PDFDocument | undefined;
  const params = { certificateId, subject, language, skipQRCode };
  switch (certificateType) {
    case 'instructor':
      pdf = await generateInstructor(params);
      break;
    case 'rigger':
      pdf = await generateRigger(params);
      break;
    case 'world-record':
      pdf = await generateWorldRecord(params);
      break;
    default:
      throw new Error('Invalid certificate to genereate PDF ');
  }

  const bytes = await pdf!.save();
  return { pdfBytes: bytes };
};

const generateInstructor = async (payload: GenerateCertificatePayload) => {
  const { certificateId, subject, language, skipQRCode } = payload;
  const item = (await certificateSpreadsheet.getInstructors({ certId: certificateId }))[0];

  const startDate = formatCertificateDate(item.startDate!);
  const endDate = formatCertificateDate(item.endDate!);

  const { verificationUrl } = await signCertificate({
    subject,
    expireDate: endDate.date,
    skipQRCode,
    content: `"${item.name} ${item.surname}" has a valid "${item.level}" certificate valid until "${endDate.pretty}"`,
  });

  const pdf = await pdfGenerators.generateInstructorPDF(
    language,
    {
      fullname: `${item.name} ${item.surname}`.toUpperCase(),
      level: item.level!.toUpperCase(),
      startDate: startDate.formal,
      endDate: endDate.formal,
    },
    verificationUrl,
  );
  return pdf;
};

const generateRigger = async (payload: GenerateCertificatePayload) => {
  const { certificateId, subject, language, skipQRCode } = payload;
  const item = (await certificateSpreadsheet.getRiggers({ certId: certificateId }))[0];

  const startDate = formatCertificateDate(item.startDate!);
  const expireDate = formatCertificateDate(item.endDate!);

  const { verificationUrl } = await signCertificate({
    subject,
    expireDate: expireDate.date,
    skipQRCode,
    content: `"${item.name} ${item.surname}" has a valid "${item.level}" certificate valid until "${expireDate.pretty}"`,
  });

  const pdf = await pdfGenerators.generateRiggerPDF(
    language,
    {
      fullname: `${item.name} ${item.surname}`.toUpperCase(),
      level: item.level!.toUpperCase(),
      startDate: startDate.formal,
      endDate: expireDate.formal,
    },
    verificationUrl,
  );
  return pdf;
};

const generateWorldRecord = async (payload: GenerateCertificatePayload) => {
  const { certificateId, subject, language, skipQRCode } = payload;
  const item = (await certificateSpreadsheet.getWorldRecords({ certId: certificateId }))[0];

  const date = formatCertificateDate(item.date!);
  const { verificationUrl } = await signCertificate({
    subject,
    skipQRCode,
    content: `"${item.name}" has a valid WORLD RECORD certificate for category "${item.category}"`,
  });

  const pdf = await pdfGenerators.generateWorldRecordPDF(
    language,
    {
      name: item.name!,
      specs: item.specs!,
      category: item.category!,
      date: date.formal,
      recordType: item.recordType!,
    },
    verificationUrl,
  );
  return pdf;
};
