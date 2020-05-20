import React, { useEffect, useCallback, useState, useMemo } from 'react';
import TrialBalanceSheetHeader from "./TrialBalanceSheetHeader";
import TrialBalanceSheetTable from './TrialBalanceSheetTable';
import { useQuery } from 'react-query';
import moment from 'moment';
import {compose} from 'utils';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';

import TrialBalanceActionsBar from './TrialBalanceActionsBar';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import withDashboard from 'containers/Dashboard/withDashboard';
import withTrialBalanceActions from './withTrialBalanceActions';
import withTrialBalance from './withTrialBalance';
import withSettings from 'containers/Settings/withSettings';


function TrialBalanceSheet({
  // #withDashboard
  changePageTitle,

  // #withTrialBalanceActions
  fetchTrialBalanceSheet,

  // #withTrialBalance
  trialBalanceSheetLoading,

  // #withPreferences
  organizationSettings,
}) {
  const [filter, setFilter] = useState({
    from_date: moment().startOf('year').format('YYYY-MM-DD'),
    to_date: moment().endOf('year').format('YYYY-MM-DD'),
    basis: 'accural',
    none_zero: false,
  });
  const [refetch, setRefetch] = useState(false);

  const fetchHook = useQuery(['trial-balance', filter],
    (key, query) => fetchTrialBalanceSheet(query),
    { manual: true });

  // handle fetch data of trial balance table.
  const handleFetchData = useCallback(() => {
    setRefetch(true);
  }, [fetchHook]);

  // Change page title of the dashboard.
  useEffect(() => {
    changePageTitle('Trial Balance Sheet');
  }, []);

  const handleFilterSubmit = useCallback((filter) => {
    const parsedFilter = {
      ...filter,
      from_date: moment(filter.from_date).format('YYYY-MM-DD'),
      to_date: moment(filter.to_date).format('YYYY-MM-DD'),
    };
    setFilter(parsedFilter);
    setRefetch(true);
  }, []);

  // Refetch sheet effect.
  useEffect(() => {
    if (refetch) {
      fetchHook.refetch({ force: true });
      setRefetch(false);
    }
  }, [fetchHook]);

  return (
    <DashboardInsider>
      <TrialBalanceActionsBar />

      <DashboardPageContent>
        <div class="financial-statement">
          <TrialBalanceSheetHeader
            pageFilter={filter}
            onSubmitFilter={handleFilterSubmit} />

          <div class="financial-statement__body">
            <TrialBalanceSheetTable
              companyName={organizationSettings.name}
              trialBalanceQuery={filter}
              onFetchData={handleFetchData}
              loading={trialBalanceSheetLoading} />
          </div>
        </div>
      </DashboardPageContent>
    </DashboardInsider>
  )
}

export default compose(
  withDashboard,
  withTrialBalanceActions,
  withTrialBalance(({ trialBalanceSheetLoading }) => ({
    trialBalanceSheetLoading,
  })),
  withSettings,
)(TrialBalanceSheet);