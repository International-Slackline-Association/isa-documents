import WORLD_RECORD_EN from './templates/world-record-en.pdf';
import INSTRUCTOR_EN from './templates/instructor-en.pdf';
import RIGGER_EN from './templates/rigger-en.pdf';
import ATHLETIC_AWARD_EN from './templates/athletic-award-en.pdf';
import ATHLETE_EXCELLENCE from './templates/athlete-excellence-en.pdf';
import ISA_MEMBER from './templates/isa-member-en.pdf';
import HONORARY_MEMBER_EN from './templates/honorary-member-en.pdf';

import { CertificateType } from 'core/spreadsheets/types';

export const blankPDFTemplate = (certificateType: CertificateType, language: string) => {
  switch (certificateType) {
    case 'instructor':
      return INSTRUCTOR_EN;
    case 'rigger':
      return RIGGER_EN;
    case 'world-record':
      return WORLD_RECORD_EN;
    case 'athletic-award':
      return ATHLETIC_AWARD_EN;
    case 'athlete-excellence':
      return ATHLETE_EXCELLENCE;
    case 'isa-membership':
      return ISA_MEMBER;
    case 'honorary-member':
      return HONORARY_MEMBER_EN;
    default:
      throw new Error(`Cannot find pdf template for certificate type ${certificateType}`);
  }
};
