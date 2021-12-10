import {
  MultiSelection,
} from '@folio/stripes-components';

import PropTypes from 'prop-types';

const propTypes = {

};

const MultiSelectionFacet = ({
  ...props
}) => {
  return (
    <MultiSelection
      id="accessTypeFilterSelect"
      ariaLabel={label}
      dataOptions={dataOptions}
      name="access-type"
      onChange={handleStandaloneFilterChange}
      selectedValues={accessTypesList}
      disabled={!searchByAccessTypesEnabled}
      aria-labelledby="accessTypesFilter-label"
      value={[]}
    />
  );
};

MultiSelectionFacet.propTypes = propTypes;

export default MultiSelectionFacet;
