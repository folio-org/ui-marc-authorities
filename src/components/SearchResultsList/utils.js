import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';

export const areRecordsEqual = (a, b) => {
  const comparedProperties = ['authRefType', 'headingRef', 'id', 'headingType'];

  return isEqual(pick(a, comparedProperties), pick(b, comparedProperties));
};
