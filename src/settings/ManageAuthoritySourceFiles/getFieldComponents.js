import { Field } from 'react-final-form';

import {
  Checkbox,
  TextField,
} from '@folio/stripes/components';

import { authorityFilesColumns } from './constants';

/* eslint-disable react/prop-types */
/* eslint-disable react/no-multi-comp */
export const getFieldComponents = (selectableFieldLabel, intl) => ({
  [authorityFilesColumns.NAME]: ({ fieldProps }) => (
    <Field
      {...fieldProps}
      component={TextField}
      placeholder={intl.formatMessage({ id: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.column.name' })}
      marginBottom0
    />
  ),
  [authorityFilesColumns.CODES]: ({ fieldProps }) => (
    <Field
      {...fieldProps}
      component={TextField}
      placeholder={intl.formatMessage({ id: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.column.codes' })}
      marginBottom0
    />
  ),
  [authorityFilesColumns.START_NUMBER]: ({ fieldProps }) => (
    <Field
      {...fieldProps}
      component={TextField}
      placeholder={intl.formatMessage({ id: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.column.startNumber' })}
      marginBottom0
    />
  ),
  [authorityFilesColumns.BASE_URL]: ({ fieldProps }) => (
    <Field
      {...fieldProps}
      component={TextField}
      placeholder={intl.formatMessage({ id: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.column.baseUrl' })}
      marginBottom0
    />
  ),
  [authorityFilesColumns.SELECTABLE]: ({ fieldProps }) => (
    <Field
      {...fieldProps}
      component={Checkbox}
      type="checkbox"
      aria-label={selectableFieldLabel}
      marginBottom0
    />
  ),
});
