import React from "react";
import StripeCheckout from "../../components/stripe-button/stripe-button";
import CheckoutItem from "../../components/checkout-item/checkout-item";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import {
  selectCartItems,
  selectCartItemsTotalPrice,
} from "../../redux/cart/cartSelector";
import { selectCurrentUser } from "../../redux/users/userSelector";
import "./cart-checkout.scss";
import axios from "axios";

class CheckoutPage extends React.Component {
  constructor(props) {
    super(props);
  }

  paymentSucceeded = () => {
    const { cartItems, user } = this.props;
    console.log("paymentSucceeded called");
    console.log(cartItems);
    const { displayName, email, id } = user;
    axios
      .post("/checkout", {
        cartItems,
        displayName,
        email,
        id,
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  };

  render() {
    const { cartItems, total, user } = this.props;
    return (
      <div className='checkout-page'>
        <div className='checkout-header'>
          <div className='header-block'>
            <span>Product</span>
          </div>
          <div className='header-block'>
            <span>Description</span>
          </div>
          <div className='header-block'>
            <span>Quantity</span>
          </div>
          <div className='header-block'>
            <span>Price</span>
          </div>
          <div className='header-block'>
            <span>Remove</span>
          </div>
        </div>
        {cartItems.map((cartItem) => (
          <CheckoutItem key={cartItem.id} cartItem={cartItem} />
        ))}
        <div className='total'>TOTAL: ${total.toFixed(2)}</div>
        {user ? (
          <div>
            <StripeCheckout
              price={total}
              paymentSuccessCallback={this.paymentSucceeded}
            />
          </div>
        ) : (
          //TODO: a more interactive message would be better
          <h2 style={{ color: "red" }}> You need to log in first to pay </h2>
        )}
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  cartItems: selectCartItems,
  total: selectCartItemsTotalPrice,
  user: selectCurrentUser,
});

export default connect(mapStateToProps)(CheckoutPage);