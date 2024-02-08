import { Field } from 'react-final-form';

import {
  Checkbox,
  TextField,
} from '@folio/stripes/components';

import { authorityFilesColumns } from './constants';

/* eslint-disable react/no-multi-comp, react/prop-types */
export const getFieldComponents = fieldLabels => ({
  [authorityFilesColumns.NAME]: ({ fieldProps, name, rowIndex, fieldIndex }) => (
    <Field
      {...fieldProps}
      component={TextField}
      aria-label={`${fieldLabels[name]} ${rowIndex}`}
      placeholder={fieldLabels[name]}
      marginBottom0
      autoFocus={fieldIndex === 0}
    />
  ),
  [authorityFilesColumns.CODES]: ({ fieldProps, name, rowIndex }) => (
    <Field
      {...fieldProps}
      aria-label={`${fieldLabels[name]} ${rowIndex}`}
      component={TextField}
      placeholder={fieldLabels[name]}
      marginBottom0
    />
  ),
  [authorityFilesColumns.START_NUMBER]: ({ fieldProps, name, rowIndex }) => (
    <Field
      {...fieldProps}
      aria-label={`${fieldLabels[name]} ${rowIndex}`}
      component={TextField}
      placeholder={fieldLabels[name]}
      marginBottom0
    />
  ),
  [authorityFilesColumns.BASE_URL]: ({ fieldProps, name, rowIndex }) => (
    <Field
      {...fieldProps}
      aria-label={`${fieldLabels[name]} ${rowIndex}`}
      component={TextField}
      placeholder={fieldLabels[name]}
      marginBottom0
    />
  ),
  [authorityFilesColumns.SELECTABLE]: ({ fieldProps, name, rowIndex }) => (
    <Field
      {...fieldProps}
      type="checkbox"
      aria-label={`${fieldLabels[name]} ${rowIndex}`}
      component={Checkbox}
    />
  ),
});
