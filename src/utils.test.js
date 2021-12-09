import * as utils from './utils';

describe('MARC Authorities utils', () => {
  describe('buildDateRangeQuery', () => {
    it('should return function', () => {
      const resultFunc = utils.buildDateRangeQuery('testname');

      expect(typeof resultFunc).toBe('function');
    });

    describe('when apply returned function', () => {
      describe('when startDate and endDate are provided', () => {
        it('should return date range query', () => {
          const expectedQuery = '(metadata.testname>="2021-01-01" and metadata.testname<="2021-12-09")';

          const resultFunc = utils.buildDateRangeQuery('testname');

          const dateRangeQuery = resultFunc(['2021-01-01:2021-12-09']);

          expect(dateRangeQuery).toBe(expectedQuery);
        });
      });

      describe('when startDate and/or endDate are not provided', () => {
        it('should return empty string', () => {
          const resultFunc = utils.buildDateRangeQuery('testname');

          const dateRangeQuery = resultFunc(['notExpectedValue']);

          expect(dateRangeQuery).toBe('');
        });
      });
    });
  });
});
