(function () {
  "use strict";

  //clock

  document.addEventListener("DOMContentLoaded", function () {
    let c = document.getElementById("clock");
    c.style.color = "red";
    setInterval(() => (c.innerHTML = new Date().toLocaleTimeString("en-US"))),
      1000;
  });

  // forms

  document.getElementById("form").addEventListener("submit", estimateDelivery);

  let e = document.getElementById("delivery");
  e.innerHTML = "0,00 &euro;";

  function estimateDelivery(event) {
    event.preventDefault();

    let linn = document.getElementById("linn");
    let v1 = document.getElementById("v1");
    let v2 = document.getElementById("v2");

    if (linn.value === "") {
      alert("Palun valige linn nimekirjast");

      linn.focus();

      return;
    } else {
      let calc_value = 0;
      switch (linn.value) {
        case "tln":
          calc_value += 0.0;
          break;
        case "trt":
          calc_value += 2.5;
          break;
        case "nrv":
          calc_value += 2.5;
          break;
        case "prn":
          calc_value += 3.0;
          break;
        default:
          calc_value = 0.0;
      }

      if (v1.checked) {
        calc_value += 5.0;
      }
      if (v2.checked) {
        calc_value += 1.0;
      }

      e.innerHTML = calc_value.toString() + " &euro;";
    }

    console.log("Tarne hind on arvutatud");
  }

  //validate form
})();

// map

let map;

function GetMap() {
  "use strict";

  let centerPoint = new Microsoft.Maps.Location(58.38104, 26.71992);
  let narvaPoint = new Microsoft.Maps.Location(59.3797, 28.1791);

  var locs = [centerPoint, narvaPoint];
  var rect = Microsoft.Maps.LocationRect.fromLocations(locs);

  map = new Microsoft.Maps.Map("#map", {
    bounds: rect,
    padding: 100,
    center: centerPoint,
    zoom: 7,
    mapTypeId: Microsoft.Maps.MapTypeId.road,
    disablePanning: true,
  });

  var pushpin1 = new Microsoft.Maps.Pushpin(centerPoint, {
    title: "Tartu Ülikool",
  });
  var pushpin2 = new Microsoft.Maps.Pushpin(narvaPoint, {
    title: "Narva",
  });

  var infobox1 = new Microsoft.Maps.Infobox(centerPoint, {
    visible: false,
    title: "Tartu Ülikooli hoone",
    description: "Asub Tartus",
  });

  var infobox2 = new Microsoft.Maps.Infobox(narvaPoint, {
    visible: false,
    title: "Narva linn",
    description: "Piirilinn",
  });

  Microsoft.Maps.Events.addHandler(pushpin1, "click", function(e) {
    infobox1.setOptions({visible: true});
  });

  Microsoft.Maps.Events.addHandler(pushpin2, "click", function(e) {
    infobox2.setOptions({visible: true});
  });
  
  map.entities.push(pushpin1);
  map.entities.push(pushpin2);
  infobox1.setMap(map);
  infobox2.setMap(map);
}