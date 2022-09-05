import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { deleteExpenseAction, editExpenseAction } from '../redux/actions/index';

import './Table.css';

class Table extends Component {
  handleDelete = (id) => {
    const { dispatchId } = this.props;
    // console.log('clicou');
    dispatchId(id);
    // const { dispatch } = this.props;
    // dispatch(deleteExpenseAction(id));
  }

  handleEdit = (id) => {
    const { dispatchEditor } = this.props;
    dispatchEditor(id);
  }

  render() {
    const { getFormState } = this.props;
    return (
      <div className="div-table-class">
        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Tag</th>
              <th>Método de pagamento</th>
              <th>Valor</th>
              <th>Moeda</th>
              <th>Câmbio utilizado</th>
              <th>Valor convertido</th>
              <th>Moeda de conversão</th>
              <th>Editar/Excluir</th>
            </tr>
          </thead>
          { getFormState.map((expense) => (
            <tbody key={ expense.id }>
              <tr>
                <td>{ expense.description }</td>
                <td>{ expense.tag }</td>
                <td>{ expense.method }</td>
                <td>{ Number(expense.value).toFixed(2) }</td>
                <td>{ expense.exchangeRates[expense.currency].name }</td>
                <td>{ Number(expense.exchangeRates[expense.currency].ask).toFixed(2) }</td>
                <td>
                  { (Number(expense.value) * (expense
                    .exchangeRates[expense.currency].ask)).toFixed(2) }
                </td>
                <td>Real</td>
                <td>

                  <button
                    type="button"
                    data-testid="delete-btn"
                    onClick={ () => this.handleDelete(expense.id) }
                  >
                    Excluir
                  </button>

                  <button
                    type="button"
                    data-testid="edit-btn"
                    onClick={ () => this.handleEdit(expense.id) }
                  >
                    Editar
                  </button>

                </td>
              </tr>
            </tbody>
          )) }

        </table>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  getFormState: state.wallet.expenses,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchId: (id) => dispatch(deleteExpenseAction(id)),
  dispatchEditor: (state) => dispatch(editExpenseAction(state)),
});

Table.propTypes = {
  getFormState: PropTypes.array,
}.isRequired;

export default connect(mapStateToProps, mapDispatchToProps)(Table);
