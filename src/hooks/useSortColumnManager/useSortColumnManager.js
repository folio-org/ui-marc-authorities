import { useState } from 'react';

import { sortOrders } from '../../constants';

const useSortColumnManager = options => {
  const [sortedColumn, setSortedColumn] = useState(options?.initialParams?.sort || '');
  const [sortOrder, setSortOrder] = useState(options?.initialParams?.order || '');

  const onHeaderClick = (_, metadata) => {
    const { name } = metadata;

    let newOrder;

    if (options?.sortableColumns && !options.sortableColumns.includes(name)) return;

    if (name !== sortedColumn) {
      setSortedColumn(name);
      newOrder = sortOrders.ASC;
    } else {
      newOrder = sortOrder === sortOrders.ASC
        ? sortOrders.DES
        : sortOrders.ASC;
    }

    setSortOrder(newOrder);
  };

  const onChangeSortOption = (option, order = '') => {
    let currentOrder;

    if (!order) {
      currentOrder = option ? sortOrders.ASC : '';
    } else {
      currentOrder = order;
    }

    setSortedColumn(option);
    setSortOrder(currentOrder);
  };

  return {
    onChangeSortOption,
    onHeaderClick,
    sortOrder,
    sortedColumn,
  };
};

export default useSortColumnManager;
