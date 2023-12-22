import { FormattedMessage } from 'react-intl';

import { Checkbox } from '@folio/stripes/components';

import { authorityFilesColumns, SOURCES } from './constants';

/* eslint-disable react/prop-types, react/no-multi-comp */
export const getAuthorityFormatter = ({ selectableFieldLabel }) => ({
  [authorityFilesColumns.CODES]: ({ codes }) => (Array.isArray(codes) ? codes.join(',') : codes),
  [authorityFilesColumns.SELECTABLE]: ({ selectable }) => (
    <Checkbox
      checked={selectable}
      disabled
      aria-label={selectableFieldLabel}
    />
  ),
  [authorityFilesColumns.START_NUMBER]: ({ hridManagement }) => hridManagement?.startNumber,
  [authorityFilesColumns.SOURCE]: ({ source }) => {
    if (source === SOURCES.FOLIO) {
      return SOURCES.FOLIO.toUpperCase();
    }

    if (source === SOURCES.LOCAL) {
      return <FormattedMessage id="ui-marc-authorities.settings.manageAuthorityFiles.column.source.local" />;
    }

    return source;
  },
});
