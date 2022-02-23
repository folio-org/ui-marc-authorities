import { buildDateRangeQuery } from '../../utils';

export const FILTERS = {
  CREATED_DATE: 'createdDate',
  UPDATED_DATE: 'updatedDate',
  HEADING_TYPE: 'headingType',
  SUBJECT_HEADINGS: 'subjectHeadings',
};

export const filterConfig = [
  {
    name: FILTERS.CREATED_DATE,
    parse: buildDateRangeQuery(FILTERS.CREATED_DATE),
  },
  {
    name: FILTERS.UPDATED_DATE,
    parse: buildDateRangeQuery(FILTERS.UPDATED_DATE),
  },
  {
    name: FILTERS.HEADING_TYPE,
    parse: (values) => {
      const valuesInQuotes = values.map(value => `"${value}"`).join(' or ');

      return `(headingType==(${valuesInQuotes}))`;
    },
  },
  {
    name: FILTERS.SUBJECT_HEADINGS,
    parse: (values) => {
      const valuesInQuotes = values.map(value => `"${value}"`).join(' or ');

      return `(subjectHeadings==(${valuesInQuotes}))`;
    },
  },
];
