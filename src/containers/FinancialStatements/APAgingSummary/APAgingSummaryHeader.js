import React from 'react';
import { FormattedMessage as T } from 'components';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';

import FinancialStatementHeader from 'containers/FinancialStatements/FinancialStatementHeader';
import APAgingSummaryHeaderGeneral from './APAgingSummaryHeaderGeneral';

import withAPAgingSummary from './withAPAgingSummary';
import withAPAgingSummaryActions from './withAPAgingSummaryActions';

import { compose } from 'utils';
import { transformToForm } from '../../../utils';

/**
 * AP Aging Summary Report - Drawer Header.
 */
function APAgingSummaryHeader({
  // #ownProps
  pageFilter,
  onSubmitFilter,

  // #withAPAgingSummaryActions
  toggleAPAgingSummaryFilterDrawer: toggleFilterDrawerDisplay,

  // #withAPAgingSummary
  isFilterDrawerOpen,
}) {
  // Validation schema.
  const validationSchema = Yup.object({
    asDate: Yup.date().required().label('asDate'),
    agingDaysBefore: Yup.number()
      .required()
      .integer()
      .positive()
      .label('agingBeforeDays'),
    agingPeriods: Yup.number()
      .required()
      .integer()
      .positive()
      .label('agingPeriods'),
  });

  // Initial values.
  const defaultValues = {
    asDate: moment(pageFilter.asDate).toDate(),
    agingDaysBefore: 30,
    agingPeriods: 3,
    vendorsIds: [],
  };
  // Formik initial values.
  const initialValues = transformToForm(pageFilter, defaultValues);

  // Handle form submit.
  const handleSubmit = (values, { setSubmitting }) => {
    onSubmitFilter(values);
    toggleFilterDrawerDisplay(false);
    setSubmitting(false);
  };

  // Handle cancel button click.
  const handleCancelClick = () => { toggleFilterDrawerDisplay(false); };

  // Handle the drawer closing.
  const handleDrawerClose = () => { toggleFilterDrawerDisplay(false); };

  return (
    <FinancialStatementHeader
      isOpen={isFilterDrawerOpen}
      drawerProps={{ onClose: handleDrawerClose }}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <Tabs animate={true} vertical={true} renderActiveTabPanelOnly={true}>
            <Tab
              id={'general'}
              title={<T id={'general'} />}
              panel={<APAgingSummaryHeaderGeneral />}
            />
          </Tabs>
          <div className={'financial-header-drawer__footer'}>
            <Button className={'mr1'} intent={Intent.PRIMARY} type={'submit'}>
              <T id={'calculate_report'} />
            </Button>
            <Button onClick={handleCancelClick} minimal={true}>
              <T id={'cancel'} />
            </Button>
          </div>
        </Form>
      </Formik>
    </FinancialStatementHeader>
  );
}

export default compose(
  withAPAgingSummaryActions,
  withAPAgingSummary(({ APAgingSummaryFilterDrawer }) => ({
    isFilterDrawerOpen: APAgingSummaryFilterDrawer,
  })),
)(APAgingSummaryHeader);