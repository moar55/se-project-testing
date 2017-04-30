var mongoose = require('mongoose');

var PaymentSchema = new mongoose.Schema({
  amount: Number,
  currency: String,
  paymentInfo:{

  }
});

var Payment = module.exports = mongoose.model('Payment',PaymentSchema);
