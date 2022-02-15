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
    setPage(newPage);
    setMainRequestSearch(getMainRequestSearch(newQuery, newPage));
    setPageSearchCache((currentPageSearchCache) => ({
      ...currentPageSearchCache,
      [newPage]: currentPageSearchCache[newPage] || getMainRequestSearch(newQuery, newPage),
    }));
  };

  const clearPageSearchCache = () => setPageSearchCache({});

  useEffect(() => {
    updatePage(0, initialQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  return {
    page,
    setPage: updatePage,
    getMainRequestSearch,
    mainRequestSearch,
    clearPageSearchCache,
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
  const [items, setItems] = useState([]);
  const {
    page,
    setPage,
    mainRequestSearch,
    getMainRequestSearch,
    clearPageSearchCache,
  } = useBrowserPaging(searchQuery);

  useEffect(() => {
    setCurrentQuery(searchQuery);
    clearPageSearchCache();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  useEffect(() => {
    clearPageSearchCache();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchIndex]);

  const mainRequest = useBrowseRequest({
    searchQuery: currentQuery,
    startingSearch: mainRequestSearch,
    searchIndex,
    pageSize,
    precedingRecordsCount,
    isExcludedSeeFromLimiter,
  });

  const prevPageRequest = useBrowseRequest({
    searchQuery: mainRequest.firstResult,
    startingSearch: getMainRequestSearch(mainRequest.firstResult, page - 1),
    searchIndex,
    pageSize,
    precedingRecordsCount,
    isExcludedSeeFromLimiter,
  });

  const nextPageRequest = useBrowseRequest({
    searchQuery: mainRequest.lastResult,
    startingSearch: getMainRequestSearch(mainRequest.lastResult, page + 1),
    searchIndex,
    pageSize,
    precedingRecordsCount,
    isExcludedSeeFromLimiter,
  });

  const allRequestsFetched = mainRequest.isFetched && prevPageRequest.isFetched && nextPageRequest.isFetched;
  const allRequestsFetching = mainRequest.isFetching || prevPageRequest.isFetching || nextPageRequest.isFetching;

  useEffect(() => {
    setItems(mainRequest.data?.items || []);
  }, [mainRequest.data]);

  const itemsWithPrevAndNextPages = useMemo(() => {
    if (allRequestsFetching) {
      return [];
    }

    const totalItemsLength = mainRequest.data?.items?.length + prevPageRequest.data?.items?.length + nextPageRequest.data?.items?.length;
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

  return ({
    totalRecords: mainRequest.data?.totalRecords,
    authorities: itemsWithPrevAndNextPages,
    isLoading: allRequestsFetching,
    isLoaded: allRequestsFetched,
    handleLoadMore,
  });
};

export default useAuthoritiesBrowse;
