import React from 'react';
import { useLocation } from 'react-router-dom';
import { isEmpty, pick } from 'lodash';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import { transformToEditForm } from './utils';

import {
  useCreditNote,
  useCreateCreditNote,
  useEditCreditNote,
  useItems,
  useCustomers,
  useSettingsCreditNotes,
  useInvoice,
} from 'hooks/query';

const CreditNoteFormContext = React.createContext();

/**
 * Credit note data provider.
 */
function CreditNoteFormProvider({ creditNoteId, ...props }) {
  const { state } = useLocation();
  const invoiceId = state?.invoiceId;

  // Handle fetch customers data table or list
  const {
    data: { customers },
    isLoading: isCustomersLoading,
  } = useCustomers({ page_size: 10000 });

  // Handle fetching the items table based on the given query.
  const {
    data: { items },
    isLoading: isItemsLoading,
  } = useItems({
    page_size: 10000,
  });

  // Handle fetch  credit details.
  const { data: creditNote, isLoading: isCreditNoteLoading } = useCreditNote(
    creditNoteId,
    {
      enabled: !!creditNoteId,
    },
  );
  // Handle fetch invoice detail.
  const { data: invoice, isLoading: isInvoiceLoading } = useInvoice(invoiceId, {
    enabled: !!invoiceId,
  });

  // Handle fetching settings.
  useSettingsCreditNotes();

  // Create and edit credit note mutations.
  const { mutateAsync: createCreditNoteMutate } = useCreateCreditNote();
  const { mutateAsync: editCreditNoteMutate } = useEditCreditNote();

  // Form submit payload.
  const [submitPayload, setSubmitPayload] = React.useState();

  // Determines whether the form in new mode.
  const isNewMode = !creditNoteId;

  const newCreditNote = !isEmpty(invoice)
    ? transformToEditForm({
        ...pick(invoice, ['customer_id', 'entries']),
      })
    : [];

  // Provider payload.
  const provider = {
    items,
    customers,
    creditNote,
    submitPayload,
    isNewMode,
    newCreditNote,

    isItemsLoading,
    isCustomersLoading,

    createCreditNoteMutate,
    editCreditNoteMutate,
    setSubmitPayload,
  };

  const isLoading =
    isItemsLoading ||
    isCustomersLoading ||
    isCreditNoteLoading ||
    isInvoiceLoading;

  return (
    <DashboardInsider loading={isLoading} name={'credit-note-form'}>
      <CreditNoteFormContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useCreditNoteFormContext = () => React.useContext(CreditNoteFormContext);

export { CreditNoteFormProvider, useCreditNoteFormContext };