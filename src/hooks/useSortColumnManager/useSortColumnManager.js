import { sortOrders } from '../../constants';

const useSortColumnManager = ({
  sortOrder,
  sortedColumn,
  setSortOrder,
  setSortedColumn,
  sortableColumns,
}) => {
  const onHeaderClick = (_, metadata) => {
    const { name } = metadata;

    let newOrder;

    if (!sortableColumns?.includes(name)) {
      return;
    }

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

  return {
    onHeaderClick,
  };
};

export default useSortColumnManager;
