import {
  useCallback,
  useContext,
} from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { MultiSelectionFacet } from '../../MultiSelectionFacet';
import { useSectionToggle } from '../../../hooks';
import { useFacets } from '../../../queries';
import { FILTERS } from '../../../constants';
import { AuthoritiesSearchContext } from '../../../context';
import {
  getSelectedFacets,
  onClearFilter,
  updateFilters,
} from '../utils';
import { ReferencesFilter } from '../ReferencesFilter/ReferencesFilter';

const propTypes = {
  cqlQuery: PropTypes.string,
};

const BrowseFilters = ({ cqlQuery }) => {
  const intl = useIntl();
  const {
    filters,
    setFilters,
  } = useContext(AuthoritiesSearchContext);

  const [filterAccordions, { handleSectionToggle }] = useSectionToggle({
    [FILTERS.HEADING_TYPE]: false,
    [FILTERS.SUBJECT_HEADINGS]: false,
  });

  const selectedFacets = getSelectedFacets(filterAccordions);

  const { isLoading, facets = {} } = useFacets({
    query: cqlQuery,
    selectedFacets,
  });

  const applyFilters = useCallback(({ name, values }) => {
    updateFilters({ name, values, setFilters });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ReferencesFilter
        activeFilters={filters?.[FILTERS.REFERENCES]}
        closedByDefault
        disabled={isLoading}
        id={FILTERS.REFERENCES}
        onChange={applyFilters}
        name={FILTERS.REFERENCES}
      />
      <MultiSelectionFacet
        id={FILTERS.HEADING_TYPE}
        label={intl.formatMessage({ id: `ui-marc-authorities.search.${FILTERS.HEADING_TYPE}` })}
        name={FILTERS.HEADING_TYPE}
        open={filterAccordions[FILTERS.HEADING_TYPE]}
        options={facets[FILTERS.HEADING_TYPE]?.values}
        selectedValues={filters[FILTERS.HEADING_TYPE]}
        onFilterChange={applyFilters}
        onClearFilter={(filter) => onClearFilter({ filter, setFilters })}
        displayClearButton={!!filters[FILTERS.HEADING_TYPE]?.length}
        handleSectionToggle={handleSectionToggle}
        isPending={isLoading}
      />
    </>
  );
};

BrowseFilters.propTypes = propTypes;

BrowseFilters.defaultProps = {
  cqlQuery: '',
};

export default BrowseFilters;
