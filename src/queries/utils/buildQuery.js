import {
  searchableIndexesValues,
  searchableIndexesMap,
} from '../../constants';

const buildQuery = (searchIndex) => {
  const indexData = searchableIndexesMap[searchIndex || searchableIndexesValues.KEYWORD];

  const queryStrings = indexData.map(data => {
    const queryParts = [];

    const queryTemplate = name => `${name}=="%{query}"`;

    const capitalizeFirstLetter = ([first, ...rest]) => first.toUpperCase() + rest.join('');

    if (data.plain) {
      const query = queryTemplate(data.name);

      queryParts.push(query);
    }

    if ((data.sft || data.saft) && data.plain) {
      const name = capitalizeFirstLetter(data.name);

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

    return queryParts;
  });

  const flattenedQueryStrings = queryStrings.reduce((acc, arr) => acc.concat(arr));
  const joinedQueryParts = flattenedQueryStrings.join(' or ');

  return `(${joinedQueryParts})`;
};

export default buildQuery;
