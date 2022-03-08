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
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  name: PropTypes.string.isRequired,
  onClearFilter: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string,
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
  ...props
}) => {
  const onChange = (newOptions) => {
    onFilterChange({
      name,
      values: newOptions.map(option => option.value),
    });
  };

  const missingValuesInOptions = selectedValues
    .filter(selectedValue => !options.find(option => {
      return option.label
        ? option.label === selectedValue
        : option.id === selectedValue;
    }))
    .map(value => ({
      label: value,
      value,
      totalRecords: 0,
    }));

  // include options returned from backend
  // if some selected options are missing from response we're adding them here with 0 results
  const dataOptions = [...options.map(option => ({
    label: option.label || option.id,
    value: option.label || option.id,
    totalRecords: option.totalRecords,
  })), ...missingValuesInOptions];

  const itemToString = (option) => {
    return option?.label || '';
  };

  const selectedOptions = dataOptions.filter(option => selectedValues.includes(option.value));

  return (
    <Accordion
      label={label}
      id={id}
      open={open}
      onToggle={handleSectionToggle}
      header={FilterAccordionHeader}
      headerProps={{
        label,
      }}
      onClearFilter={() => onClearFilter(name)}
      displayClearButton={displayClearButton}
    >
      <MultiSelection
        id={`${id}-multiselect`}
        label={label}
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
