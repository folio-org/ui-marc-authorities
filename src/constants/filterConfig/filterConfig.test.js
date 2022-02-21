import { filterConfig } from './filterConfig';

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

  describe('subjectHeadings filter', () => {
    it('should return correct search string', () => {
      const filter = filterConfig.find(config => config.name === 'subjectHeadings');

      const searchString = filter.parse(['val1', 'val2']);

      expect(searchString).toEqual('(subjectHeadings==("val1" or "val2"))');
    });
  });
});
