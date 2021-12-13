import PropTypes from 'prop-types';

import {
  MultiSelection,
} from '@folio/stripes-components';

import { FacetOptionFormatter } from '../../components';

const propTypes = {

};

const MultiSelectionFacet = ({
  name,
  onFilterChange,
  options,
  ...props
}) => {
  const onChange = (values) => {
    const valueIds = values.map(value => value.value);

    onFilterChange({
      name,
      values: valueIds,
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

  return (
    <MultiSelection
      name={name}
      formatter={FacetOptionFormatter}
      onChange={onChange}
      dataOptions={dataOptions}
      itemToString={itemToString}
      {...props}
    />
  );
};

MultiSelectionFacet.propTypes = propTypes;

export default MultiSelectionFacet;
