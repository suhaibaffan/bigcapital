import {connect} from 'react-redux';
import {
  submitMedia,
  deleteMedia,
} from 'store/media/media.actions';

export const mapStateToProps = (state, props) => ({

});

export const mapDispatchToProps = (dispatch) => ({
  requestSubmitMedia: (form, config) => dispatch(submitMedia({ form, config })),
  requestDeleteMedia: (id) => dispatch(deleteMedia({ id })),
});

export default connect(mapStateToProps, mapDispatchToProps);