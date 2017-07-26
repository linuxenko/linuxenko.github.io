(function() {
  var address = "1N7jVPbFYX5Gte47C76CTB2mE9Gvx8t6g9"; // The bitcoin address to receive donations. Change to yours
  var currencyCode = "USD"; // Change to your default currency. Choose from https://api.bitcoinaverage.com/ticker/
  var defaultRate = 2527;
  var defaultAmount = 10;


  function update(dollars) {
    var bitcoins = (dollars / defaultRate).toFixed(5);
    var url = 'bitcoin:' + address + '?amount=' + bitcoins;

    $('.bit-amount').text(bitcoins);
    $('.bit-address').text(address);
    $('.bit-link').attr('href', url);

    $('#bit-qr').html('').qrcode({
      render: 'image',
      ecLevel: 'H',
      size: 280,
      text: url
    });
  }

  function getAmount() {
    var params = window.location.hash.match(/\?amount=(\d+)/);
    return params ? params[1] : defaultAmount;
  }

  function amountChange(e) {
    var amount = e ? Number.parseInt(e.target.value) : getAmount();
    if (e && (!amount || amount < 1)) {
      amount = 1;
      e.target.value = 1;
    }
    window.location.href = "#?amount=" + amount;
    update(amount);
  }

  function init(currencies) {
    defaultRate = currencies.USD.buy;
    $('#amountField')
      .val(getAmount())
      .change(amountChange)
      .keyup(amountChange);
    amountChange();
  }

  $.get('https://blockchain.info/ticker?cors=true').then(function(json) {
    if (!json || !json.USD) {
      json = { USD: {  buy: defaultRate } };
    }

    $(document).ready(function() {
      init(json);
    });
  });

})();

