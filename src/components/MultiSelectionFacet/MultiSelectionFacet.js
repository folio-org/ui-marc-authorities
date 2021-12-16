import PropTypes from 'prop-types';

import {
  MultiSelection,
  Accordion,
  FilterAccordionHeader,
} from '@folio/stripes/components';

import { FacetOptionFormatter } from '../../components';

const propTypes = {
  displayClearButton: PropTypes.bool.isRequired,
  handleSectionToggle: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  isPending: PropTypes.bool.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  name: PropTypes.string.isRequired,
  onClearFilter: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    totalRecords: PropTypes.number.isRequired,
  })),
  selectedValues: PropTypes.arrayOf(PropTypes.string),
};

const MultiSelectionFacet = ({
  id,
  label,
  open,
  handleSectionToggle,
  name,
  onFilterChange,
  options,
  selectedValues,
  onClearFilter,
  displayClearButton,
  isPending,
  ...props
}) => {
  const onChange = (newOptions) => {
    onFilterChange({
      name,
      values: newOptions.map(option => option.value),
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

  let selectedOptions = [];

  if (!dataOptions.length) {
    selectedOptions = selectedValues.map(value => ({
      label: value,
      value,
      totalRecords: 0,
    }));
  } else {
    selectedOptions = dataOptions.filter(option => selectedValues.includes(option.value));
  }

  return (
    <Accordion
      label={label}
      id={id}
      open={open}
      onToggle={handleSectionToggle}
      separator={false}
      header={FilterAccordionHeader}
      onClearFilter={() => onClearFilter(name)}
      displayClearButton={displayClearButton}
    >
      <MultiSelection
        id={`${id}-multiselect`}
        name={name}
        formatter={FacetOptionFormatter}
        valueFormatter={({ option }) => option.label}
        onChange={onChange}
        dataOptions={dataOptions}
        itemToString={itemToString}
        value={selectedOptions}
        {...props}
      />
    </Accordion>
  );
};

MultiSelectionFacet.defaultProps = {
  selectedValues: [],
};

MultiSelectionFacet.propTypes = propTypes;

export default MultiSelectionFacet;
