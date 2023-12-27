import { Field } from 'react-final-form';

import { Checkbox } from '@folio/stripes/components';

import { authorityFilesColumns } from './constants';

/* eslint-disable react/prop-types */
export const getFieldComponents = selectableFieldLabel => ({
  [authorityFilesColumns.SELECTABLE]: ({ fieldProps }) => (
    <Field
      {...fieldProps}
      component={Checkbox}
      aria-label={selectableFieldLabel}
    />
  ),
});
