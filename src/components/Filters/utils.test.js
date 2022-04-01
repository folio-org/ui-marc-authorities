import * as utils from './utils';

describe('Given Filters utils', () => {
  describe('getSelectedFacets', () => {
    describe('when there are no selected facets', () => {
      it('should return an empty array', () => {
        const filterAccordions = {
          headingType: false,
          subjectHeadings: false,
        };

        const selectedFacets = utils.getSelectedFacets(filterAccordions);

        expect(selectedFacets.length).toBe(0);
      });
    });

    describe('when there are selected facets', () => {
      it('should return an array of selected facets', () => {
        const filterAccordions = {
          headingType: true,
          subjectHeadings: false,
        };

        const selectedFacets = utils.getSelectedFacets(filterAccordions);

        expect(selectedFacets.length).toBe(1);
        expect(selectedFacets[0]).toBe('headingType');
      });
    });
  });

  describe('updateFilters', () => {
    it('should handle setFilters', () => {
      const name = 'headingType';
      const values = ['Geographic Name'];
      const setFilters = jest.fn();

      utils.updateFilters({ name, values, setFilters });

      expect(setFilters).toHaveBeenCalledTimes(1);
      expect(setFilters).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  describe('onClearFilter', () => {
    it('should handle setFilters', () => {
      const filter = 'headingType';
      const setFilters = jest.fn();

      utils.onClearFilter({ filter, setFilters });

      expect(setFilters).toHaveBeenCalledTimes(1);
      expect(setFilters).toHaveBeenCalledWith(expect.any(Function));
    });
  });
});
