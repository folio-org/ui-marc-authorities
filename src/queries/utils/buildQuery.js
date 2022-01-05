import { upperFirst } from 'lodash';

import {
  searchableIndexesValues,
  searchableIndexesMap,
} from '../../constants';

const buildQuery = ({
  searchIndex,
  isExcludedSeeFromLimiter = false,
}) => {
  const indexData = searchableIndexesMap[searchIndex || searchableIndexesValues.KEYWORD];

  if (!indexData) {
    return '';
  }

  const queryStrings = indexData.map(data => {
    const queryParts = [];

    const queryTemplate = name => `${name}=="%{query}"`;

    if (data.plain) {
      const query = queryTemplate(data.name);

      queryParts.push(query);
    }

    if (!isExcludedSeeFromLimiter) {
      if ((data.sft || data.saft) && data.plain) {
        const name = upperFirst(data.name);

        if (data.sft) {
          const query = queryTemplate(`sft${name}`);

          queryParts.push(query);
        }

        if (data.saft) {
          const query = queryTemplate(`saft${name}`);

          queryParts.push(query);
        }
      }

      if (data.sft && !data.plain) {
        const query = queryTemplate(data.name);

        queryParts.push(query);
      }

      if (data.saft && !data.plain) {
        const query = queryTemplate(data.name);

        queryParts.push(query);
      }
    }

    return queryParts;
  });

  const flattenedQueryStrings = queryStrings.reduce((acc, arr) => acc.concat(arr));
  const joinedQueryParts = flattenedQueryStrings.join(' or ');

  return `(${joinedQueryParts})`;
};

export default buildQuery;
