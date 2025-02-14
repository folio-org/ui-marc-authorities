import { useIntl } from 'react-intl';
import { Field } from 'react-final-form';

import {
  TitleManager,
  useCallout,
} from '@folio/stripes/core';
import {
  Row,
  Col,
  Select,
  Label,
  Layout,
  LoadingPane,
} from '@folio/stripes/components';
import { ConfigFinalForm } from '@folio/stripes/smart-components';

import { useAuditSettings } from '../../queries';
import { VERSION_HISTORY_PAGE_SIZE_SETTING } from '../../constants';

const VersionHistory = () => {
  const intl = useIntl();
  const callout = useCallout();

  const {
    settings,
    updateSetting,
    isLoading,
    isError,
  } = useAuditSettings();

  const fieldNames = {
    PAGE_SIZE: 'pageSize',
  };

  const pageSizeSettings = settings?.find(setting => setting.key === VERSION_HISTORY_PAGE_SIZE_SETTING);

  const pageSizeOptions = [10, 25, 50, 100].map(value => ({ label: value, value }));

  const handleSubmit = async formValues => {
    try {
      await updateSetting({
        body: {
          ...pageSizeSettings,
          value: formValues[fieldNames.PAGE_SIZE],
        },
        settingKey: VERSION_HISTORY_PAGE_SIZE_SETTING,
      });

      callout.sendCallout({
        message: intl.formatMessage({ id: 'stripes-smart-components.cm.success' }),
      });
    } catch (e) {
      callout.sendCallout({
        type: 'error',
        message: intl.formatMessage({ id: 'ui-marc-authorities.error.defaultSaveError' }),
      });
    }
  };

  if (isLoading) {
    return <LoadingPane />;
  }

  if (isError) {
    callout.sendCallout({
      type: 'error',
      message: intl.formatMessage({ id: 'ui-marc-authorities.settings.versionHistory.loadError' }),
    });

    return null;
  }

  return (
    <Layout className="full">
      <TitleManager record={intl.formatMessage({ id: 'ui-marc-authorities.settings.versionHistory.pane.title' })}>
        <ConfigFinalForm
          label={intl.formatMessage({ id: 'ui-marc-authorities.settings.versionHistory.pane.title' })}
          initialValues={{
            [fieldNames.PAGE_SIZE]: pageSizeSettings?.value,
          }}
          onSubmit={handleSubmit}
        >
          <Row>
            <Col xs={12}>
              <Label htmlFor={fieldNames.PAGE_SIZE}>
                {intl.formatMessage({ id: 'ui-marc-authorities.settings.versionHistory.field.pageSize' })}
              </Label>
            </Col>
            <Col xs={4}>
              <Field
                id={fieldNames.PAGE_SIZE}
                name={fieldNames.PAGE_SIZE}
                dataOptions={pageSizeOptions}
                component={Select}
                parse={v => parseInt(v, 10)}
              />
            </Col>
          </Row>
        </ConfigFinalForm>
      </TitleManager>
    </Layout>
  );
};

export { VersionHistory };
