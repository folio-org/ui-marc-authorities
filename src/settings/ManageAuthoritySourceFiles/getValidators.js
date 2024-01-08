import { FormattedMessage } from 'react-intl';

import { authorityFilesColumns } from './constants';

const validators = {
  [authorityFilesColumns.CODES]: function validateCodes({ codes, id }, items) {
    if (!codes) {
      return <FormattedMessage id="ui-marc-authorities.settings.manageAuthoritySourceFiles.error.codes.empty" />;
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
  [authorityFilesColumns.START_NUMBER]: function validateStartNumber({ startNumber }) {
    if (!startNumber) {
      return <FormattedMessage id="ui-marc-authorities.settings.manageAuthoritySourceFiles.error.startNumber.empty" />;
    }

    if (startNumber.toString()[0] === '0') {
      return <FormattedMessage id="ui-marc-authorities.settings.manageAuthoritySourceFiles.error.startNumber.zeroes" />;
    }

    return undefined;
  },
};

export const getValidators = field => validators[field];