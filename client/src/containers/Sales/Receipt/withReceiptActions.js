import { connect } from 'react-redux';
import {
  submitReceipt,
  deleteReceipt,
  fetchReceipt,
  fetchReceiptsTable,
  editReceipt,
  closeReceipt,
} from 'store/receipt/receipt.actions';
import t from 'store/types';

const mapDispatchToProps = (dispatch) => ({
  requestSubmitReceipt: (form) => dispatch(submitReceipt({ form })),
  requestFetchReceipt: (id) => dispatch(fetchReceipt({ id })),
  requestEditReceipt: (id, form) => dispatch(editReceipt(id, form)),
  requestDeleteReceipt: (id) => dispatch(deleteReceipt({ id })),
  requestFetchReceiptsTable: (query = {}) =>
    dispatch(fetchReceiptsTable({ query: { ...query } })),
  requestCloseReceipt: (id) => dispatch(closeReceipt({ id })),
  // requestDeleteBulkReceipt: (ids) => dispatch(deleteBulkReceipt({ ids })),

  changeReceiptView: (id) =>
    dispatch({
      type: t.RECEIPTS_SET_CURRENT_VIEW,
      currentViewId: parseInt(id, 10),
    }),

  addReceiptsTableQueries: (queries) =>
    dispatch({
      type: t.RECEIPTS_TABLE_QUERIES_ADD,
      payload: { queries },
    }),
  setReceiptNumberChanged: (isChanged) =>
    dispatch({
      type: t.RECEIPT_NUMBER_CHANGED,
      payload: { isChanged },
    }),
});

export default connect(null, mapDispatchToProps);
