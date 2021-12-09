import { buildDateRangeQuery } from '../utils';

export const filterConfig = [
  {
    name: 'updatedDate',
    parse: buildDateRangeQuery('updatedDate'),
  },
];
