import {
  useState,
  useEffect,
} from 'react';
import queryString from 'query-string';
import { useLocation } from 'react-router-dom';

import { sortOrders } from '../../constants';

const useSortColumnManager = (options) => {
  const location = useLocation();
  const [sortedColumn, setSortedColumn] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  const onHeaderClick = (_, metadata) => {
    const { name } = metadata;

    let newOrder;

    if (options?.sortableColumns && !options?.sortableColumns.includes(name)) return;

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

  useEffect(() => {
    const locationSearchParams = queryString.parse(location.search);

    if (Object.keys(locationSearchParams).length <= 0) {
      return;
    }

    if (locationSearchParams.sort) {
      if (locationSearchParams.sort[0] === '-') {
        onChangeSortOption(locationSearchParams.sort.substring(1), sortOrders.DES);
      } else {
        onChangeSortOption(locationSearchParams.sort, sortOrders.ASC);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    onChangeSortOption,
    onHeaderClick,
    sortOrder,
    sortedColumn,
  };
};

export default useSortColumnManager;
