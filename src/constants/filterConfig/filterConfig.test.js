import { REFERENCES_VALUES_MAP } from '../references';
import {
  filterConfig,
  FILTERS,
} from './filterConfig';

jest.mock('../../utils', () => ({
  buildDateRangeQuery: () => jest.fn().mockReturnValue('called buildDateRangeQuery'),
}));

describe('filterConfig', () => {
  describe('createdDate filter', () => {
    it('should call buildDateRangeQuery', () => {
      const filter = filterConfig.find(config => config.name === 'createdDate');

      expect(filter.parse()).toEqual('called buildDateRangeQuery');
    });
  });

  describe('updatedDate filter', () => {
    it('should call buildDateRangeQuery', () => {
      const filter = filterConfig.find(config => config.name === 'updatedDate');

      expect(filter.parse()).toEqual('called buildDateRangeQuery');
    });
  });

  describe('headingType filter', () => {
    it('should return correct search string', () => {
      const filter = filterConfig.find(config => config.name === 'headingType');

      const searchString = filter.parse(['val1', 'val2']);

      expect(searchString).toEqual('(headingType==("val1" or "val2"))');
    });
  });

  describe('references filter', () => {
    it('should return correct search string when \'excludeSeeFrom\' is selected', () => {
      const filter = filterConfig.find(config => config.name === FILTERS.REFERENCES);

      const searchString = filter.parse([REFERENCES_VALUES_MAP.excludeSeeFrom]);

      expect(searchString).toEqual('(authRefType==("Authorized" or "Auth/Ref"))');
    });

    it('should return correct search string when \'excludeSeeFromAlso\' is selected', () => {
      const filter = filterConfig.find(config => config.name === FILTERS.REFERENCES);

      const searchString = filter.parse([REFERENCES_VALUES_MAP.excludeSeeFromAlso]);

      expect(searchString).toEqual('(authRefType==("Authorized" or "Reference"))');
    });

    it('should return correct search string when both \'excludeSeeFrom\' and \'excludeSeeFromAlso\' are selected', () => {
      const filter = filterConfig.find(config => config.name === FILTERS.REFERENCES);

      const searchString = filter.parse([
        REFERENCES_VALUES_MAP.excludeSeeFrom,
        REFERENCES_VALUES_MAP.excludeSeeFromAlso,
      ]);

      expect(searchString).toEqual('(authRefType==("Authorized"))');
    });
  });

  describe('subjectHeadings filter', () => {
    it('should return correct search string', () => {
      const filter = filterConfig.find(config => config.name === 'subjectHeadings');

      const searchString = filter.parse(['val1', 'val2']);

      expect(searchString).toEqual('(subjectHeadings==("val1" or "val2"))');
    });
  });
});
