import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { isObjectId } from '../../utils/isObjectId';

export function validateOnObjectId(text: string) {
  const res = isObjectId(text);
  return res ? true : false;
}

@ValidatorConstraint()
export class IsPropObjectId implements ValidatorConstraintInterface {
  validate(text: string) {
    return validateOnObjectId(text);
  }
}

@ValidatorConstraint()
export class isEmptyOrObjectId implements ValidatorConstraintInterface {
  validate(text: string) {
    if (text.length) {
      try {
        return validateOnObjectId(text);
      } catch (error) {
        return false;
      }
    }

    if (text.length === 0) return true;

    return false;
  }
}
