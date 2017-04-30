main.controller("paymentCtrl", ['$route','$http','$scope','Session','$location',function ($route,$http,$scope,Session,$location) {

  var authorization;
  var submit = document.querySelector('input[type="submit"]');
  var hostedFieldsInstanceVal;
  console.log('wow');
  $http.get('/api/client-token')
  .success(function (response) {
    authorization = response.token;
    console.log('wow2');

    braintree.client.create({
      authorization: authorization
    }, function (clientErr, clientInstance) {
      if (clientErr) {
        alert(clientErr)
        // Handle error in client creation
        return;
      }
      console.log('yes');

      braintree.hostedFields.create({
        client: clientInstance,
        styles: {
          'input': {
            'font-size': '14pt'
          },
          'input.invalid': {
            'color': 'red'
          },
          'input.valid': {
            'color': 'green'
          }
        },
        fields: {
          number: {
            selector: '#card-number',
            placeholder: '4111 1111 1111 1111'
          },
          cvv: {
            selector: '#cvv',
            placeholder: '123'
          },
          expirationDate: {
            selector: '#expiration-date',
            placeholder: '10/2019'
          }
        }
      }, function (hostedFieldsErr, hostedFieldsInstance) {
        if (hostedFieldsErr) {
          // Handle error in Hosted Fields creation
          alert(hostedFieldsErr);
          return;
        }
        else{
          hostedFieldsInstanceVal = hostedFieldsInstance;
          console.log('yo');
        }
        submit.removeAttribute('disabled');
      });
    });
  })

  $scope.submit = function () {
    console.log('woah');
    hostedFieldsInstanceVal.tokenize(function (tokenizeErr, payload) {
      if (tokenizeErr) {
        // Handle error in Hosted Fields tokenization
        alert(tokenizeErr);
        $route.reload();
        return;
      }

      // Put `payload.nonce` into the `payment_method_nonce` input, and then
      // submit the form. Alternatively, you could send the nonce to your server
      // with AJAX.
      $http.post("/api/students/"+Session.isLoggedIn().username+"/courses",{course:$scope.$parent.course._id, payment_method_nonce:payload.nonce})
      .success(function (res) {
        console.log(res);
        console.log(res.data);
      })
      .error(function (err) {
        alert(err);
      })
    });
  }
}])
