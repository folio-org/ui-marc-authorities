import { buildDateRangeQuery } from '../utils';

export const filterConfig = [
  {
    name: 'createdDate',
    parse: buildDateRangeQuery('createdDate'),
  },
  {
    name: 'updatedDate',
    parse: buildDateRangeQuery('updatedDate'),
  },
  {
    name: 'headingType',
    parse: (values) => `(headingType==(${values.map(value => `"${value}"`).join(' or ')}))`,
  },
];
