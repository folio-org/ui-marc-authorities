import PropTypes from 'prop-types';

import { AcqCheckboxFilter } from '@folio/stripes-acq-components';

import { REFERENCES_OPTIONS } from '../../../constants';

export const ReferencesFilter = ({
  activeFilters,
  closedByDefault = true,
  disabled,
  id,
  onChange,
  name,
}) => (
  <AcqCheckboxFilter
    activeFilters={activeFilters}
    closedByDefault={closedByDefault}
    disabled={disabled}
    id={id}
    labelId="ui-marc-authorities.search.references"
    name={name}
    onChange={onChange}
    options={REFERENCES_OPTIONS}
  />
);

ReferencesFilter.propTypes = {
  activeFilters: PropTypes.arrayOf(PropTypes.string),
  closedByDefault: PropTypes.bool,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
