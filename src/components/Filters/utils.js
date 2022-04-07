import omit from 'lodash/omit';

export const getSelectedFacets = (filterAccordions) => {
  return Object.keys(filterAccordions).filter(accordion => filterAccordions[accordion]);
};

export const updateFilters = ({ name, values, setFilters }) => {
  setFilters(currentFilters => {
    return {
      ...currentFilters,
      [name]: values,
    };
  });
};

export const onClearFilter = ({ filter, setFilters }) => {
  setFilters(currentFilters => omit(currentFilters, filter));
};
