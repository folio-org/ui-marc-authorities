import { useIntl } from 'react-intl';
import {
  useLocation,
  useRouteMatch,
} from 'react-router-dom';

import { TitleManager } from '@folio/stripes/core';
import {
  CommandList,
  defaultKeyboardShortcuts,
  LoadingPane,
} from '@folio/stripes/components';
import { Settings } from '@folio/stripes/smart-components';

import { ManageAuthoritySourceFiles } from '../ManageAuthoritySourceFiles';
import { VersionHistory } from '../VersionHistory';
import { useAuditSettings } from '../../queries';
import { VERSION_HISTORY_ENABLED_SETTING } from '../../constants';

const MarcAuthoritySettings = () => {
  const match = useRouteMatch();
  const location = useLocation();
  const { formatMessage } = useIntl();

  const { settings, isLoading: isLoadingSettings } = useAuditSettings();

  const isVersionHistoryEnabled = settings?.find(setting => setting.key === VERSION_HISTORY_ENABLED_SETTING)?.value;

  const pages = [
    {
      component: ManageAuthoritySourceFiles,
      label: formatMessage({ id: 'ui-marc-authorities.settings.manageAuthoritySourceFiles.pane.title' }),
      route: 'manage-authority-files',
      perm: 'ui-marc-authorities.settings.authority-files.view',
    },
    ...(isVersionHistoryEnabled
      ? [{
        component: VersionHistory,
        label: formatMessage({ id: 'ui-marc-authorities.settings.versionHistory.pane.title' }),
        route: 'version-history',
        perm: 'ui-marc-authorities.settings.version-history',
      }]
      : []),
  ];

  if (isLoadingSettings) {
    return <LoadingPane defaultWidth="15%" />;
  }

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
