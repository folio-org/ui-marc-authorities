import { browseHeadingTypesMap } from '../../constants';

export const buildHeadingTypeQuery = searchIndex => {
  const query = (
    (browseHeadingTypesMap[searchIndex] || [])
      .map(value => `"${value}"`)
      .join(' or ')
  );

  return query && `headingType==(${query})`;
};
