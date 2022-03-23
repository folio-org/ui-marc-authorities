import buildQuery from './buildQuery';
import { FILTERS, REFERENCES_VALUES_MAP, searchableIndexesValues } from '../../constants';

describe('Given buildQuery', () => {
  describe('when index with plain, sft, and saft prefixes provided', () => {
    it('should return correct query', () => {
      const query = buildQuery({
        searchIndex: searchableIndexesValues.PERSONAL_NAME,
      });

      expect(query).toBe('(personalNameTitle=="%{query}" or sftPersonalNameTitle=="%{query}" or saftPersonalNameTitle=="%{query}")');
    });
  });

  describe('when non-existent index provided', () => {
    it('should return an empty string', () => {
      const query = buildQuery({
        searchIndex: 'testIndex',
      });

      expect(query).toBe('');
    });
  });

  describe('when index with different names for plain, sft, and saft prefixes provided', () => {
    it('should return correct query', () => {
      const query = buildQuery({
        searchIndex: searchableIndexesValues.GEOGRAPHIC_NAME,
      });

      expect(query).toBe('(geographicName=="%{query}" or sftGeographicName=="%{query}" or saftGeographicName=="%{query}")');
    });
  });

  describe('when keyword index provided', () => {
    it('should return correct query', () => {
      const query = buildQuery({
        searchIndex: searchableIndexesValues.KEYWORD,
      });

      expect(query).toBe('(keyword=="%{query}")');
    });
  });

  describe('when identifier index provided', () => {
    it('should return correct query', () => {
      const query = buildQuery({
        searchIndex: searchableIndexesValues.IDENTIFIER,
      });

      expect(query).toBe('(identifiers.value=="%{query}")');
    });
  });

  describe('when childrenSubjectHeading index provided', () => {
    it('should return correct query', () => {
      const query = buildQuery({
        searchIndex: 'childrenSubjectHeading',
      });

      expect(query).toBe('(keyword=="%{query}" and subjectHeadings=="b")');
    });
  });

  describe('when \'reference filter\' values are provided', () => {
    it('should return correct query when \'excludeSeeFrom\' is selected', () => {
      const query = buildQuery({
        searchIndex: searchableIndexesValues.PERSONAL_NAME,
        filters: {
          [FILTERS.REFERENCES]: [REFERENCES_VALUES_MAP.excludeSeeFrom],
        },
      });

      expect(query).toEqual('(personalNameTitle=="%{query}" or saftPersonalNameTitle=="%{query}")');
    });

    it('should return correct query when \'excludeSeeFromAlso\' is selected', () => {
      const query = buildQuery({
        searchIndex: searchableIndexesValues.PERSONAL_NAME,
        filters: {
          [FILTERS.REFERENCES]: [REFERENCES_VALUES_MAP.excludeSeeFromAlso],
        },
      });

      expect(query).toEqual('(personalNameTitle=="%{query}" or sftPersonalNameTitle=="%{query}")');
    });

    it('should return correct query when both \'excludeSeeFromAlso\' and \'excludeSeeFromAlso\' are selected', () => {
      const query = buildQuery({
        searchIndex: searchableIndexesValues.PERSONAL_NAME,
        filters: {
          [FILTERS.REFERENCES]: [
            REFERENCES_VALUES_MAP.excludeSeeFrom,
            REFERENCES_VALUES_MAP.excludeSeeFromAlso,
          ],
        },
      });

      expect(query).toEqual('(personalNameTitle=="%{query}")');
    });
  });
});
