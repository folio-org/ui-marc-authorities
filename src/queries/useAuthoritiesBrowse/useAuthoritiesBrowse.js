import {
  useState,
  useEffect,
  useMemo,
} from 'react';
import { useQuery } from 'react-query';
import queryString from 'query-string';
import get from 'lodash/get';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';

import { useDidUpdate } from '../../hooks';
import { searchableIndexesValues } from '../../constants';

const AUTHORITIES_BROWSE_API = 'browse/authorities';

const useBrowseRequest = ({
  searchQuery,
  searchIndex,
  startingSearch,
  pageSize,
  precedingRecordsCount,
  isExcludedSeeFromLimiter,
}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace();

  let cqlSearch = startingSearch ? [startingSearch] : [];

  if (isExcludedSeeFromLimiter) {
    cqlSearch = [...cqlSearch, 'authRefType==Authorized'];
  }

  const searchParams = {
    query: cqlSearch.join(' and '),
    headingType: searchIndex !== searchableIndexesValues.NONE ? searchIndex : undefined,
    limit: pageSize,
    precedingRecordsCount,
  };

  const {
    isFetching,
    isFetched,
    data,
  } = useQuery(
    [namespace, 'authoritiesBrowse', searchParams],
    async () => {
      if (!searchQuery) {
        return { items: [], totalRecords: 0 };
      }

      const path = `${AUTHORITIES_BROWSE_API}?${queryString.stringify(searchParams)}`.replace(/\+/g, '%20');

      return ky.get(path).json();
    }, {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000,
    },
  );

  return ({
    isFetched,
    isFetching,
    data,
    firstResult: get(data, 'items[0].headingRef'),
    lastResult: get(data, `items[${data?.items?.length - 1}].headingRef`),
    startingSearch,
  });
};

const useBrowserPaging = (initialQuery) => {
  const [page, setPage] = useState(0);
  const [pageSearchCache, setPageSearchCache] = useState({});

  const getMainRequestSearch = (newQuery, newPage) => {
    if (pageSearchCache[newPage]) {
      return pageSearchCache[newPage];
    }

    let newMainRequestSearch = [];

    if (newPage < page) { // requested prev page
      newMainRequestSearch = [`headingRef<"${newQuery}"`];
    } else if (newPage > page) { // requested next page
      newMainRequestSearch = [`headingRef>"${newQuery}"`];
    }

    if (newPage === 0) {
      newMainRequestSearch = [`(headingRef>="${initialQuery}" or headingRef<"${initialQuery}")`];
    }

    return newMainRequestSearch;
  };

  const [mainRequestSearch, setMainRequestSearch] = useState(getMainRequestSearch(initialQuery, 0));

  const updatePage = (newPage, newQuery) => {
    if (!newQuery) {
      return;
    }

    setPage(newPage);
    setMainRequestSearch(getMainRequestSearch(newQuery, newPage));
    setPageSearchCache((currentPageSearchCache) => ({
      ...currentPageSearchCache,
      [newPage]: currentPageSearchCache[newPage] || getMainRequestSearch(newQuery, newPage),
    }));
  };

  const resetPageCache = () => {
    setPageSearchCache({});
  };

  useEffect(() => {
    updatePage(0, initialQuery);
    setMainRequestSearch(getMainRequestSearch(initialQuery, 0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  return {
    page,
    setPage: updatePage,
    getMainRequestSearch,
    mainRequestSearch,
    resetPageCache,
  };
};

const useAuthoritiesBrowse = ({
  searchQuery,
  searchIndex,
  isExcludedSeeFromLimiter,
  pageSize,
  precedingRecordsCount,
}) => {
  const [currentQuery, setCurrentQuery] = useState(searchQuery);
  const [currentIndex, setCurrentIndex] = useState(searchIndex);
  const [currentExcludeSeeFrom, setCurrentExcludeSeeFrom] = useState(isExcludedSeeFromLimiter);
  const [hasEmptyAnchor, setHasEmptyAnchor] = useState(false);
  const [items, setItems] = useState([]);
  const {
    page,
    setPage,
    mainRequestSearch,
    getMainRequestSearch,
    resetPageCache,
  } = useBrowserPaging(searchQuery);

  useEffect(() => {
    setCurrentQuery(searchQuery);
    setCurrentIndex(searchIndex);
    setCurrentExcludeSeeFrom(isExcludedSeeFromLimiter);
    resetPageCache();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, searchIndex, isExcludedSeeFromLimiter]);

  const mainRequest = useBrowseRequest({
    searchQuery: currentQuery,
    startingSearch: mainRequestSearch,
    searchIndex: currentIndex,
    pageSize,
    precedingRecordsCount,
    isExcludedSeeFromLimiter: currentExcludeSeeFrom,
  });

  const prevPageRequest = useBrowseRequest({
    searchQuery: mainRequest.firstResult,
    startingSearch: getMainRequestSearch(mainRequest.firstResult, page - 1),
    searchIndex: currentIndex,
    pageSize,
    precedingRecordsCount,
    isExcludedSeeFromLimiter: currentExcludeSeeFrom,
  });

  const nextPageRequest = useBrowseRequest({
    searchQuery: mainRequest.lastResult,
    startingSearch: getMainRequestSearch(mainRequest.lastResult, page + 1),
    searchIndex: currentIndex,
    pageSize,
    precedingRecordsCount,
    isExcludedSeeFromLimiter: currentExcludeSeeFrom,
  });

  const allRequestsFetched = mainRequest.isFetched && prevPageRequest.isFetched && nextPageRequest.isFetched;
  const allRequestsFetching = mainRequest.isFetching || prevPageRequest.isFetching || nextPageRequest.isFetching;

  useEffect(() => {
    setItems(mainRequest.data?.items || []);
  }, [mainRequest.data]);

  useEffect(() => {
    if (page === 0) {
      const dataIncludesEmptyAnchor = !!mainRequest.data?.items.find(item => !item.authority);

      setHasEmptyAnchor(dataIncludesEmptyAnchor);
    }
  }, [mainRequest.data]);

  const itemsWithPrevAndNextPages = useMemo(() => {
    if (allRequestsFetching) {
      return [];
    }

    let totalItemsLength = mainRequest.data?.items?.length + prevPageRequest.data?.items?.length + nextPageRequest.data?.items?.length;

    if (Number.isNaN(totalItemsLength)) {
      totalItemsLength = 0;
    }

    const newItems = new Array(totalItemsLength);

    newItems.splice(prevPageRequest.data?.items?.length, items.length, ...items);

    return newItems;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, allRequestsFetching]);

  const handleLoadMore = (askAmount, index, firstIndex, direction) => {
    if (direction === 'prev') { // clicked Prev
      setPage(page - 1, mainRequest.firstResult);
    } else { // clicked Next
      setPage(page + 1, mainRequest.lastResult);
    }
  };

  // totalRecords doesn't include empty anchor item and it will cause issues with MCL pagination
  // we need to manually add 1 to totalRecords to account for this
  const totalRecords = mainRequest.data?.totalRecords + (hasEmptyAnchor ? 1 : 0);

  return ({
    totalRecords,
    authorities: itemsWithPrevAndNextPages,
    isLoading: allRequestsFetching,
    isLoaded: allRequestsFetched,
    handleLoadMore,
  });
};

export default useAuthoritiesBrowse;
