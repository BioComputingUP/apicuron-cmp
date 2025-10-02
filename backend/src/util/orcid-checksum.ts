import {
  registerDecorator,
  ValidatorConstraintInterface,
} from 'class-validator';

const OrcidRegex = /^(\d{4}-){3}\d{3}(\d|X)$/;

export function isValidOrcid(orcid_id: string): boolean {
  const strippedOrcid = orcid_id.trim();
  //   Quick regex check to see if the format is correct
  if (!OrcidRegex.test(strippedOrcid)) {
    return false;
  }
  const digitsString = strippedOrcid.split('-').join('');

  // obtain the individual digits of the orcid id in an array (split by dash. regroup and then split entire string)
  const orcid_digits: string[] = digitsString.split('');
  //   Split the digits from the last checksum digit
  const [digits, checksum]: [number[], string] = [
    orcid_digits.slice(0, -1).map((x) => parseInt(x)),
    orcid_digits.slice(-1)[0],
  ];
  //   Convert checksum to number (X is 10)
  const checksumNumber: number = checksum === 'X' ? 10 : parseInt(checksum);

  //   Calculate the checksum according to the ISO/IEC 7064:2003 standard
  const sum = digits.reduce((prev, curr) => (prev + curr) * 2, 0);
  const check_value: number = (12 - (sum % 11)) % 11;

  return check_value == checksumNumber;
}

export const OrcidValidator: ValidatorConstraintInterface = {
  validate: isValidOrcid,
  defaultMessage: () => {
    return `Failed Orcid Checksum validation on ($value)`;
  },
};

export function IsOrcid(): PropertyDecorator {
  // eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
  return (target: Object, propertyName: string | symbol) => {
    registerDecorator({
      name: 'IsOrcid',
      target: target.constructor,
      propertyName: propertyName.toString(),
      constraints: [],
      validator: OrcidValidator,
    });
  };
}
