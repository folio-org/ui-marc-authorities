import {
  useQuery,
  useQueryClient,
} from 'react-query';
import {
  useLocation,
  useHistory,
} from 'react-router';
import queryString from 'query-string';
import pick from 'lodash/pick';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';

const MARC_SOURCE_API = id => `source-storage/records/${id}/formatted?idType=AUTHORITY`;

export const useMarcSource = recordId => {
  const location = useLocation();
  const history = useHistory();
  const queryClient = useQueryClient();

  const ky = useOkapiKy();
  const [namespace] = useNamespace();

  const { isFetching, data } = useQuery(
    [namespace, 'authority-source', recordId],
    async () => {
      return ky.get(MARC_SOURCE_API(recordId)).json()
        .catch(async err => {
          const errorResponse = await err.response;

          if (errorResponse.status === 404) {
            const parsedSearchParams = queryString.parse(location.search);
            const commonSearchParams = pick(parsedSearchParams, ['query', 'segment']);
            const newSearchParamsString = queryString.stringify(commonSearchParams);

            queryClient.invalidateQueries(namespace);
            history.push({
              pathname: '/marc-authorities',
              search: newSearchParamsString,
            });
          }
        });
    },
  );

  return ({
    data,
    isLoading: isFetching,
  });
};
