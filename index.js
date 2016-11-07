module.exports = function(apikey){
  return {
    api: function(adultCount, maxPrice, solutions, origin, destination, date, fn){
      var request = require('request');
      var data = require('./data.json');
      var endPoint = "https://www.googleapis.com/qpxExpress/v1/trips/search?key="+apikey;

      data.request.passengers.adultCount = adultCount;
      data.request.maxPrice = maxPrice;
      data.request.solutions = solutions;
      data.request.slice[0].origin = origin;
      data.request.slice[0].destination = destination;
      data.request.slice[0].date = date;

      request({method: "post",  url: endPoint,  body: data,  json: true}, function(err, resp, body){

        var info = [];
        var jsonObject = {};
        var airline;
        var price;

        if(body.error) return console.error(body.error);
        for(i=0; i < body.trips.tripOption.length; i++){
          for(j=0;j<body.trips.data.carrier.length;j++){
            if(body.trips.data.carrier[j].code==body.trips.tripOption[i].slice[0].segment[0].flight.carrier){
                airline = body.trips.data.carrier[j].name;
                break;
            }
          }
          price = body.trips.tripOption[i].saleTotal
          jsonObject = {"airline": airline , "price": price};
          info.push(jsonObject);
        }
        fn(info);
      });
    }
  }
}
