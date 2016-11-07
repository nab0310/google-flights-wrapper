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
        var connectionFlights = [];
        var jsonObject = {};
        var airline = "";
        var price = "";
        var arrivalTime = "";
        var departureTime = "";
        var flightNumber = "";
        var origin = "";
        var destination = "";
        var connectionNumber=0;

        if(body.error) return console.error(body.error);
        for(i=0; i < body.trips.tripOption.length; i++){
            if(body.trips.tripOption[i].slice[0].segment.length>1){
                for(k=0;k<body.trips.tripOption[i].slice[0].segment.length;k++){
                    for(j=0;j<body.trips.data.carrier.length;j++){
                        if(body.trips.data.carrier[j].code==body.trips.tripOption[i].slice[0].segment[k].flight.carrier){
                            airline = body.trips.data.carrier[j].name;
                            break;
                        }
                    }
                    origin = body.trips.tripOption[i].slice[0].segment[k].leg[0].origin;
                    destination = body.trips.tripOption[i].slice[0].segment[k].leg[0].destination;
                    flightNumber = body.trips.tripOption[i].slice[0].segment[k].flight.number;
                    price = body.trips.tripOption[i].saleTotal;
                    arrivalTime = body.trips.tripOption[i].slice[0].segment[k].leg[body.trips.tripOption[i].slice[0].segment[k].leg.length-1].arrivalTime;
                    departureTime = body.trips.tripOption[i].slice[0].segment[k].leg[0].departureTime;
                    connectionNumber = connectionNumber +1;
                    var jsonObjectConnection = {"connectionNumber: ": connectionNumber, "airline": airline , "price": price, "departureTime:":departureTime, "arrivalTime:":arrivalTime, "flightNumber:":flightNumber,"Destination: ":destination, "Origin: ": origin};
                    connectionFlights.push(jsonObjectConnection);
                  }
                info.push(connectionFlights);
                connectionFlights = [];
            }else{
                  for(j=0;j<body.trips.data.carrier.length;j++){
                    if(body.trips.data.carrier[j].code==body.trips.tripOption[i].slice[0].segment[0].flight.carrier){
                        airline = body.trips.data.carrier[j].name;
                        break;
                    }
                  }
                origin = body.trips.tripOption[i].slice[0].segment[0].leg[0].origin;
                destination = body.trips.tripOption[i].slice[0].segment[0].leg[0].destination;
                flightNumber = body.trips.tripOption[i].slice[0].segment[0].flight.number;
                price = body.trips.tripOption[i].saleTotal;
                arrivalTime = body.trips.tripOption[i].slice[0].segment[0].leg[body.trips.tripOption[i].slice[0].segment[0].leg.length-1].arrivalTime;
                departureTime = body.trips.tripOption[i].slice[0].segment[0].leg[0].departureTime;
              jsonObject = {"airline": airline , "price": price, "departureTime:":departureTime, "arrivalTime:":arrivalTime, "flightNumber:":flightNumber, "Destination: ":destination, "Origin: ": origin};
                info.push(jsonObject);
            }
            connectionNumber =0;
            airline = "";
            price = "";
            arrivalTime = "";
            departureTime = "";
            flightNumber = "";
            origin = "";
            destination = "";
        }
        fn(info);
      });
    }
  }
}
