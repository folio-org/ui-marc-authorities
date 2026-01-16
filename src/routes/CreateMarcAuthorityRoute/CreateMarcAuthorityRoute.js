import {
  useCallback,
  useContext,
} from 'react';
import {
  useHistory,
  useLocation,
} from 'react-router';
import { FormattedMessage } from 'react-intl';

import { Pluggable } from '@folio/stripes/core';
import { AuthoritiesSearchContext } from '@folio/stripes-authority-components';

export const CreateMarcAuthorityRoute = () => {
  const history = useHistory();
  const location = useLocation();
  const { setIsGoingToBaseURL } = useContext(AuthoritiesSearchContext);
  const searchParams = new URLSearchParams(location.search);
  const isShared = searchParams.get('shared') === 'true';

  const onClose = useCallback(recordRoute => {
    setIsGoingToBaseURL(false);

    const newSearchParams = new URLSearchParams(location.search);

    newSearchParams.delete('shared');

    history.push({
      pathname: `/marc-authorities/authorities/${recordRoute ?? ''}`,
      search: newSearchParams.toString(),
      state: {
        isClosingFocused: true,
      },
    });
  }, [location.search, history, setIsGoingToBaseURL]);

  const onCreateAndKeepEditing = useCallback(id => {
    history.push(`edit-authority/${id}`);
  }, [history]);

  return (
    <div data-test-marc-authorities-quick-marc>
      <Pluggable
        type="quick-marc"
        onClose={onClose}
        onSave={onClose}
        externalRecordPath="/marc-authorities/authorities"
        action="create"
        marcType="authority"
        isShared={isShared}
        useRoutes={false}
        onCreateAndKeepEditing={onCreateAndKeepEditing}
      >
        <span data-test-marc-authorities-quick-marc-no-plugin>
          <FormattedMessage id="ui-marc-authorities.quickMarcNotAvailable" />
        </span>
      </Pluggable>
    </div>
  );
};
