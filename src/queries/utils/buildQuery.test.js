import buildQuery from './buildQuery';
import { searchableIndexesValues } from '../../constants';

describe('Given buildQuery', () => {
  describe('when index without any prefix provided', () => {
    it('should return correct query', () => {
      const query = buildQuery({
        searchIndex: searchableIndexesValues.IDENTIFIER,
        isExcludedSeeFromLimiter: true,
      });

      expect(query).toBe('(identifiers.value=="%{query}")');
    });
  });

  describe('when index with plain, sft, and saft prefixes provided', () => {
    it('should return correct query', () => {
      const query = buildQuery({
        searchIndex: searchableIndexesValues.PERSONAL_NAME,
      });

      expect(query).toBe('(personalName=="%{query}" or sftPersonalName=="%{query}" or saftPersonalName=="%{query}")');
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

      expect(query).toBe('(geographicName=="%{query}" or sftGeographicTerm=="%{query}" or saftGeographicTerm=="%{query}")');
    });
  });

  describe('when keyword index provided', () => {
    it('should return correct query for keyword index', () => {
      const query = buildQuery({
        searchIndex: '',
      });

      expect(query).toBe('(keyword=="%{query}")');
    });
  });

  describe('when childrenSubjectHeading index provided', () => {
    it('should return correct query for childrenSubjectHeading index', () => {
      const query = buildQuery({
        searchIndex: 'childrenSubjectHeading',
      });

      expect(query).toBe('(keyword=="%{query}" and subjectHeadings=="b")');
    });
  });
});
