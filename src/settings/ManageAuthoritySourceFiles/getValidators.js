import { FormattedMessage } from 'react-intl';

import { authorityFilesColumns } from './constants';

const CODES_MAX_LENGTH = 25;

const validators = {
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
  [authorityFilesColumns.START_NUMBER]: function validateStartNumber({ hridManagement }) {
    if (!hridManagement?.startNumber) {
      return <FormattedMessage id="ui-marc-authorities.settings.manageAuthoritySourceFiles.error.startNumber.empty" />;
    }

    if (hridManagement?.startNumber.toString()[0] === '0') {
      return <FormattedMessage id="ui-marc-authorities.settings.manageAuthoritySourceFiles.error.startNumber.zeroes" />;
    }

    return undefined;
  },
};

export const getValidators = field => validators[field];
