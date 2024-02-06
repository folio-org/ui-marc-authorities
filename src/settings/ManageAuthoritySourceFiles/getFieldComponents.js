import { Field } from 'react-final-form';

import {
  Checkbox,
  TextField,
} from '@folio/stripes/components';

import { authorityFilesColumns } from './constants';

/* eslint-disable react/prop-types */
/* eslint-disable react/no-multi-comp */
export const getFieldComponents = fieldLabels => ({
  [authorityFilesColumns.NAME]: ({ fieldProps, name, rowIndex, fieldIndex, error }) => (
    <Field
      name={fieldProps.name}
      component={TextField}
      aria-label={`${fieldLabels[name]} ${rowIndex}`}
      placeholder={fieldLabels[name]}
      marginBottom0
      autoFocus={fieldIndex === 0}
      error={error?.fieldErrors?.[name]}
    />
  ),
  [authorityFilesColumns.CODES]: ({ fieldProps, name, rowIndex, error }) => (
    <Field
      name={fieldProps.name}
      aria-label={`${fieldLabels[name]} ${rowIndex}`}
      component={TextField}
      placeholder={fieldLabels[name]}
      marginBottom0
      error={error?.fieldErrors?.[name]}
    />
  ),
  [authorityFilesColumns.START_NUMBER]: ({ fieldProps, name, rowIndex, error }) => (
    <Field
      name={fieldProps.name}
      aria-label={`${fieldLabels[name]} ${rowIndex}`}
      component={TextField}
      placeholder={fieldLabels[name]}
      marginBottom0
      error={error?.fieldErrors?.[name]}
    />
  ),
  [authorityFilesColumns.BASE_URL]: ({ fieldProps, name, rowIndex, error }) => (
    <Field
      name={fieldProps.name}
      aria-label={`${fieldLabels[name]} ${rowIndex}`}
      component={TextField}
      placeholder={fieldLabels[name]}
      marginBottom0
      error={error?.fieldErrors?.[name]}
    />
  ),
  [authorityFilesColumns.SELECTABLE]: ({ fieldProps, name, rowIndex }) => (
    <Field
      name={fieldProps.name}
      type="checkbox"
      aria-label={`${fieldLabels[name]} ${rowIndex}`}
      component={Checkbox}
    />
  ),
});
