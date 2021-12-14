import { useState } from 'react';

import { sortOrders } from '../../constants';

const useSortColumnManager = () => {
  const [sortedColumn, setSortedColumn] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  const onHeaderClick = (_, metadata) => {
    const { name } = metadata;

    let newOrder;

    if (name !== sortedColumn) {
      setSortedColumn(name);
      newOrder = sortOrders.DES;
    } else {
      newOrder = sortOrder === sortOrders.ASC
        ? sortOrders.DES
        : sortOrders.ASC;
    }

    setSortOrder(newOrder);
  };

  const onChangeSortOption = (option) => {
    const currentSortOrder = option ? sortOrders.DES : '';

    setSortedColumn(option);
    setSortOrder(currentSortOrder);
  };

  return {
    onChangeSortOption,
    onHeaderClick,
    sortOrder,
    sortedColumn,
  };
};

export default useSortColumnManager;
