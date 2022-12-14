import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchCurrencies,
  saveFormData,
  updateExpenseAction,
  deleteExpenseAction } from '../redux/actions';
import './WalletForm.css';

class WalletForm extends Component {
  constructor() {
    super();
    this.state = {
      id: 0,
      value: '',
      description: '',
      currency: 'USD',
      method: 'Dinheiro',
      tag: 'Alimentação',
      exchangeRates: [],
    };
  }

  componentDidMount() {
    const { fetchApiProp } = this.props;
    fetchApiProp();
  }

  fetchApiToState = async () => {
    const response = await fetch('https://economia.awesomeapi.com.br/json/all');
    const data = await response.json();
    this.setState({
      exchangeRates: data,
    });
  }

  handleClick = async (event) => {
    event.preventDefault();
    const { saveFormProp, expenses } = this.props;
    this.setState({
      id: expenses.length,
    });
    await this.fetchApiToState();
    // let { id } = this.state;
    saveFormProp(this.state);
    this.setState({
      description: '',
      value: '',
    });
  }

  handleInputs = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  }

  handleEditExpense = (event) => {
    event.preventDefault();
    const { expenses, idToEdit, saveEditedForm } = this.props;
    const { value, description, currency, method, tag } = this.state;
    const currentExpense = expenses.find((expense) => expense.id === idToEdit);
    const editedInfo = {
      value,
      description,
      currency,
      method,
      tag,
      id: idToEdit,
      exchangeRates: currentExpense.exchangeRates,
    };
    // console.log(idToEdit);
    const replaceEditedExpense = expenses.filter((e) => e.id !== idToEdit);
    const infoToDispatch = [...replaceEditedExpense, editedInfo];
    saveEditedForm(infoToDispatch.sort((a, b) => a.id - b.id));
    this.setState({
      description: '',
      value: '',
    });
  }

  render() {
    const { currencies, editor } = this.props;
    const { value, description, currency, method, tag } = this.state;
    // console.log(currencies);
    return (
      <div>
        <form className="form-class">
          <label htmlFor="value-input">
            Despesas:
            <input
              name="value"
              type="number"
              id="value-input"
              data-testid="value-input"
              value={ value }
              onChange={ this.handleInputs }
            />
          </label>
          <label htmlFor="description-input">
            Descrição da despesa:
            <input
              name="description"
              type="text"
              id="description-input"
              data-testid="description-input"
              value={ description }
              onChange={ this.handleInputs }
            />
          </label>
          <label htmlFor="currency-input">
            Moeda:
            <select
              id="currency-input"
              name="currency"
              data-testid="currency-input"
              value={ currency }
              onChange={ this.handleInputs }
            >
              { currencies
                .map((coin, index) => (
                  <option key={ index }>{coin}</option>
                ))}
            </select>
          </label>
          <label htmlFor="method-input">
            Métodos de pagamento:
            <select
              id="method-input"
              name="method"
              data-testid="method-input"
              value={ method }
              onChange={ this.handleInputs }
            >
              <option value="Dinheiro">Dinheiro</option>
              <option value="Cartão de crédito">Cartão de crédito</option>
              <option value="Cartão de débito">Cartão de débito</option>
            </select>
          </label>
          <label htmlFor="tag-input">
            Categoria:
            <select
              id="tag-input"
              name="tag"
              data-testid="tag-input"
              value={ tag }
              onChange={ this.handleInputs }
            >
              <option value="Alimentação">Alimentação</option>
              <option value="Lazer">Lazer</option>
              <option value="Trabalho">Trabalho</option>
              <option value="Transporte">Transporte</option>
              <option value="Saúde">Saúde</option>
            </select>
          </label>
          <button
            type="submit"
            onClick={ editor ? this.handleEditExpense : this.handleClick }
            className="button-class"
          >
            { editor ? 'Editar despesa' : 'Adicionar despesa' }
          </button>
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchApiProp: () => dispatch(fetchCurrencies()),
  saveFormProp: (state) => dispatch(saveFormData(state)),
  deleteExpenseProp: (state) => dispatch(deleteExpenseAction(state)),
  saveEditedForm: (state) => dispatch(updateExpenseAction(state)),
});

const mapStateToProps = (state) => ({
  currencies: state.wallet.currencies,
  expenses: state.wallet.expenses,
  loading: state.wallet.loading,
  editor: state.wallet.editor,
  idToEdit: state.wallet.idToEdit,
});

WalletForm.propTypes = {
  currencies: PropTypes.array,
  loading: PropTypes.string,
  dispatch: PropTypes.func,
}.isRequired;

export default connect(mapStateToProps, mapDispatchToProps)(WalletForm);
