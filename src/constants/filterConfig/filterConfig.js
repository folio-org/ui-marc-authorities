import { buildDateRangeQuery } from '../../utils';
import { AUTH_REF_TYPES } from '../authRefTypes';
import { REFERENCES_VALUES_MAP } from '../references';

export const FILTERS = {
  CREATED_DATE: 'createdDate',
  UPDATED_DATE: 'updatedDate',
  HEADING_TYPE: 'headingType',
  REFERENCES: 'references',
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
    parse: values => {
      const valuesInQuotes = values.map(value => `"${value}"`).join(' or ');

      return `(headingType==(${valuesInQuotes}))`;
    },
  },
  {
    name: FILTERS.REFERENCES,
    parse: values => {
      const excludedAuthRefTypes = {
        [REFERENCES_VALUES_MAP.excludeSeeFrom]: [AUTH_REF_TYPES.REFERENCE],
        [REFERENCES_VALUES_MAP.excludeSeeFromAlso]: [AUTH_REF_TYPES.AUTH_REF],
      };

      const resultAuthRefTypes = values.reduce((acc, curr) => (
        acc.filter(authRefType => !(excludedAuthRefTypes[curr] || []).includes(authRefType))
      ), Object.values(AUTH_REF_TYPES));

      const valuesInQuotes = resultAuthRefTypes.map(value => `"${value}"`).join(' or ');

      return `(authRefType==(${valuesInQuotes}))`;
    },
  },
  {
    name: FILTERS.SUBJECT_HEADINGS,
    parse: values => {
      const valuesInQuotes = values.map(value => `"${value}"`).join(' or ');

      return `(subjectHeadings==(${valuesInQuotes}))`;
    },
  },
];
