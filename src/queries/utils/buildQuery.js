import { upperFirst } from 'lodash';

import {
  searchableIndexesValues,
  searchableIndexesMap,
  searchResultListColumns,
  FILTERS,
  REFERENCES_VALUES_MAP,
} from '../../constants';

const buildQuery = ({
  searchIndex,
  comparator = '==',
  seeAlsoJoin = 'or',
  filters = {},
}) => {
  const indexData = searchableIndexesMap[searchIndex];

  const isExcludeSeeFrom = filters[FILTERS.REFERENCES]?.includes(REFERENCES_VALUES_MAP.excludeSeeFrom);
  const isExcludeSeeFromAlso = filters[FILTERS.REFERENCES]?.includes(REFERENCES_VALUES_MAP.excludeSeeFromAlso);

  if (!indexData) {
    return '';
  }

  if (searchIndex === searchableIndexesValues.CHILDREN_SUBJECT_HEADING) {
    const childrenSubjectHeadingData = indexData[0];

    return `(${searchableIndexesValues.KEYWORD}=="%{query}" and ${childrenSubjectHeadingData.name}=="b")`;
  }

  if (searchIndex === searchableIndexesValues.IDENTIFIER) {
    const authRefType = searchResultListColumns.AUTH_REF_TYPE;

    return `(${searchableIndexesValues.IDENTIFIER}=="%{query}" and ${authRefType}=="Authorized")`;
  }

  const queryStrings = indexData.map((data) => {
    const queryParts = [];

    const queryTemplate = name => `${name}${comparator}"%{query}"`;

    if (data.plain) {
      const query = queryTemplate(data.name);

      queryParts.push(query);
    }

    if ((data.sft || data.saft) && data.plain) {
      const name = upperFirst(data.name);

      if (data.sft && !isExcludeSeeFrom) {
        const query = queryTemplate(`sft${name}`);

        queryParts.push(query);
      }

      if (data.saft && !isExcludeSeeFromAlso) {
        const query = queryTemplate(`saft${name}`);

        queryParts.push(query);
      }
    }

    if (data.sft && !data.plain && !isExcludeSeeFrom) {
      const query = queryTemplate(data.name);

      queryParts.push(query);
    }

    if (data.saft && !data.plain && !isExcludeSeeFromAlso) {
      const query = queryTemplate(data.name);

      queryParts.push(query);
    }

    return queryParts;
  });

  const flattenedQueryStrings = queryStrings.reduce((acc, arr) => acc.concat(arr));
  const joinedQueryParts = flattenedQueryStrings.join(` ${seeAlsoJoin} `);

  return `(${joinedQueryParts})`;
};

export default buildQuery;
