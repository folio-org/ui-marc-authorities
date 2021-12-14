import { useSectionToggle } from './';
import { useFacets } from '../queries';

const useFacetFilters = ({ query, accordions }) => {
  const [openFilters, { handleSectionToggle }] = useSectionToggle(accordions);

  const onFilterToggle = (filter) => {
    handleSectionToggle(filter);
  };

  const selectedFacets = Object.keys(openFilters).reduce((acc, filterName) => {
    if (openFilters[filterName]) {
      acc.push(filterName);
    }

    return acc;
  }, []);

  const { isLoading, facets = {} } = useFacets({
    query,
    selectedFacets,
  });

  return {
    isLoading,
    facets,
    openFilters,
    onFilterToggle,
  };
};

export default useFacetFilters;
