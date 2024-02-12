import { FormattedMessage } from 'react-intl';

import {
  SOURCES,
  authorityFilesColumns,
} from './constants';

const CODES_MAX_LENGTH = 25;

const validators = {
  [authorityFilesColumns.NAME]: function validateName({ name }) {
    if (!name) {
      return <FormattedMessage id="stripes-core.label.missingRequiredField" />;
    }

    return undefined;
  },
  [authorityFilesColumns.CODES]: function validateCodes({ codes, id }, items) {
    if (!codes) {
      return <FormattedMessage id="ui-marc-authorities.settings.manageAuthoritySourceFiles.error.codes.empty" />;
    }

    if (codes.length > CODES_MAX_LENGTH) {
      return (
        <FormattedMessage
          id="ui-marc-authorities.settings.manageAuthoritySourceFiles.error.codes.length"
          values={{ maxlength: CODES_MAX_LENGTH }}
        />
      );
    }

    const codesArray = Array.isArray(codes) ? codes : [codes];

    if (codesArray.some((code => code?.match(/[\s,]/)))) {
      return <FormattedMessage id="ui-marc-authorities.settings.manageAuthoritySourceFiles.error.codes.onlyOnePrefix" />;
    }

    const allCodes = items.reduce((acc, item) => {
      if (item.id === id) {
        return acc;
      }

      if (!item.codes) {
        return acc;
      }

      return [...acc, ...item.codes];
    }, []);

    if (allCodes.includes(codes)) {
      return <FormattedMessage id="ui-marc-authorities.settings.manageAuthoritySourceFiles.error.codes.unique" />;
    }

    return undefined;
  },
  [authorityFilesColumns.START_NUMBER]: function validateStartNumber({ hridManagement, source }) {
    if (source === SOURCES.FOLIO) {
      return undefined;
    }

    const startNumber = hridManagement?.startNumber?.toString();

    if (!startNumber) {
      return <FormattedMessage id="ui-marc-authorities.settings.manageAuthoritySourceFiles.error.startNumber.empty" />;
    }

    if (startNumber[0] === '0') {
      return <FormattedMessage id="ui-marc-authorities.settings.manageAuthoritySourceFiles.error.startNumber.zeroes" />;
    }

    if (startNumber.includes(' ')) {
      return <FormattedMessage id="ui-marc-authorities.settings.manageAuthoritySourceFiles.error.startNumber.whitespace" />;
    }

    if (!startNumber.match(/^[0-9]+$/)) {
      return <FormattedMessage id="ui-marc-authorities.settings.manageAuthoritySourceFiles.error.startNumber.notNumeric" />;
    }

    if (startNumber.length > 10) {
      return <FormattedMessage id="ui-marc-authorities.settings.manageAuthoritySourceFiles.error.startNumber.moreThan10" />;
    }

    return undefined;
  },
};

export const getValidators = field => validators[field];
