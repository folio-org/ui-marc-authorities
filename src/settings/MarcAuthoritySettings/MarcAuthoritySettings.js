import { useIntl } from 'react-intl';
import {
  useLocation,
  useRouteMatch,
} from 'react-router-dom';

import { TitleManager } from '@folio/stripes/core';
import {
  CommandList,
  defaultKeyboardShortcuts,
} from '@folio/stripes/components';
import { Settings } from '@folio/stripes/smart-components';

import { ManageAuthorityFiles } from '../ManageAuthorityFiles';

const MarcAuthoritySettings = () => {
  const match = useRouteMatch();
  const location = useLocation();
  const { formatMessage } = useIntl();

  const pages = [
    {
      component: ManageAuthorityFiles,
      label: formatMessage({ id: 'ui-marc-authorities.settings.manageAuthorityFiles.pane.title' }),
      route: 'manage-authority-files',
      perm: 'ui-marc-authorities.settings.authority-files.view',
    },
  ];

  return (
    <CommandList commands={defaultKeyboardShortcuts}>
      <TitleManager page={formatMessage({ id: 'ui-marc-authorities.settings.html.page.title' })}>
        <Settings
          match={match}
          location={location}
          paneTitle={formatMessage({ id: 'ui-marc-authorities.settings.heading' })}
          pages={pages}
        />
      </TitleManager>
    </CommandList>
  );
};

export { MarcAuthoritySettings };
