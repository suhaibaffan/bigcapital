import React from 'react';
import intl from 'react-intl-universal';
import { Dialog, DialogSuspense } from 'components';
import withDialogRedux from 'components/DialogReduxConnect';

import { compose } from 'redux';

const MoneyInDialogContent = React.lazy(() => import('./MoneyInDialogContent'));

/**
 * Money In dialog.
 */
function MoneyInDialog({
  dialogName,
  payload = { account_type: null, account_id: null },
  isOpen,
}) {

  return (
    <Dialog
      name={dialogName}
      title={intl.get('cash_flow_transaction.money_in', {
        value: payload.account_type?.name,
      })}
      isOpen={isOpen}
      canEscapeJeyClose={true}
      autoFocus={true}
      className={'dialog--money-in'}
    >
      <DialogSuspense>
        <MoneyInDialogContent
          dialogName={dialogName}
          accountId={payload.account_id}
          accountType={payload.account_type?.value}
        />
      </DialogSuspense>
    </Dialog>
  );
}
export default compose(withDialogRedux())(MoneyInDialog);