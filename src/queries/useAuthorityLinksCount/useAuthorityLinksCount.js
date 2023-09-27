import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

const useAuthorityLinksCount = () => {
  const ky = useOkapiKy();

  const { data, mutateAsync, isLoading } = useMutation({
    mutationFn: ids => ky.post('links/authorities/bulk/count', { json: { ids } }).json(),
  });

  return {
    fetchLinksCount: mutateAsync,
    linksCount: data?.links?.[0]?.totalLinks,
    isLoading,
  };
};

export default useAuthorityLinksCount;
