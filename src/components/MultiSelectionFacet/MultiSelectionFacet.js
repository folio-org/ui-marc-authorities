import PropTypes from 'prop-types';

import {
  MultiSelection,
} from '@folio/stripes/components';

import { FacetOptionFormatter } from '../../components';

const propTypes = {

};

const MultiSelectionFacet = ({
  name,
  onFilterChange,
  options,
  selectedValues,
  ...props
}) => {
  const onChange = (selectedOptions) => {
    onFilterChange({
      name,
      values: selectedOptions.map(option => option.value),
    });
  };

  const dataOptions = options.map(option => ({
    label: option.id,
    value: option.id,
    totalRecords: option.totalRecords,
  }));

  const itemToString = (option) => {
    return option?.label || '';
  };

  const selectedOptions = dataOptions.filter(option => selectedValues.includes(option.value));

  return (
    <MultiSelection
      name={name}
      formatter={FacetOptionFormatter}
      valueFormatter={({ option }) => option.label}
      onChange={onChange}
      dataOptions={dataOptions}
      itemToString={itemToString}
      value={selectedOptions}
      {...props}
    />
  );
};

MultiSelectionFacet.defaultProps = {
  selectedValues: [],
};

MultiSelectionFacet.propTypes = propTypes;

export default MultiSelectionFacet;
