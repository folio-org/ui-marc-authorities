import { headingTypesValues, searchableIndexesValues } from '../../constants';
import { buildHeadingTypeQuery } from './buildHeadingTypeQuery';

describe('buildHeadingTypeQuery', () => {
  it('should return a query string for heading type based on search index', () => {
    const query = buildHeadingTypeQuery(searchableIndexesValues.CORPORATE_CONFERENCE_NAME);

    expect(query).toBe(
      `headingType==("${headingTypesValues.CONFERENCE_NAME}" or "${headingTypesValues.CORPORATE_NAME}")`,
    );
  });

  it('should return an empty string if the search index does not match the heading type', () => {
    const query = buildHeadingTypeQuery('Some index');

    expect(query).toBe('');
  });
});
