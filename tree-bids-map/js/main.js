/*jslint browser: true*/
/*global L */
/*global $ */

(function (window, document, L, undefined) {
  'use strict';

  var sidebar;



  // L.Icon.Default.imagePath = 'images/';

  var treeIcon = L.icon({
    iconUrl: 'images/tree.png',
    shadowUrl: 'images/tree-shadow.png',

    iconSize:     [50, 50], // size of the icon
    shadowSize:   [40, 40], // size of the shadow
    iconAnchor:   [25, 49], // point of the icon which will correspond to marker's location
    shadowAnchor: [5, 36],  // the same for the shadow
    // popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

  /* create leaflet map */
  var map = L.map('map', {
      center: [39.766667, -86.15],
      zoom: 8
    })
    .on('click', function (e) {
      sidebar.close();
    });

  /* add default stamen tile layer */
  L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYnJ5YW5icnVzc2VlIiwiYSI6ImNpdzFua2NmeDA5N2UydG11enhtdzQxdjIifQ.bIm3DjceLQSfvBBN1Kwr7A', {
    minZoom: 6,
    maxZoom: 13
  }).addTo(map);

  sidebar = L.control.sidebar('sidebar', {
    position: 'right'
  }).addTo(map);

  var csvLayer = L.geoCsv(null, {
    firstLineTitles: true,
    fieldSeparator: ';',
    onEachFeature: function (feature, layer) {

      layer.on('click', function (e) {
        $('#forest').text(feature.properties.forest);
        $('#total_trees').text(feature.properties.total_trees);
        $('#acreage').text(feature.properties.acreage);
        $('#volume').text(feature.properties.volume);

        $('#sold_to').text(feature.properties.sold_to);
        $('#date').text(feature.properties.date);
        $('#total_cost').text(feature.properties.total_cost);
        $('#total_sale_price').text(feature.properties.total_sale_price);
        $('#net').text(feature.properties.net);
        $('#sale_number').text(feature.properties.sale_number);

        sidebar.open('home');
      });
    },
    pointToLayer: function (feature, latlng) {
      return L.marker(latlng, {
        icon: treeIcon
      });
    },
  });

  $.ajax({
    type: 'GET',
    dataType: 'text',
    url: 'data/trees_database_final_bids_only_dmr.csv',
    error: function () {
      alert('cannot fetch data!');
    },
    success: function (csv) {
      L.markerClusterGroup.layerSupport()
        .addTo(map)
        .checkIn(csvLayer)
        .options.iconCreateFunction = (t) => {
          const e = t.getChildCount();

          const bidMin = 2;
          const bidMax = 150;
          const radiusMin = 40;
          const radiusMax = 150;
          const scaleRadius = d3.scaleSqrt().domain([bidMin, bidMax]).range([radiusMin, radiusMax]);
          const radius = scaleRadius(e);

          const colorMin = 'green';
          const colorMax = 'yellow';
          const scaleColor = d3.scaleLinear()
            .domain([bidMin, bidMax])
            .range([colorMin, colorMax])
            .interpolate(d3.interpolateLab);
          let color = scaleColor(e);
          color = d3.rgb(color);
          color.opacity = 0.5;

          return new L.DivIcon({
            html: `<div style="background-color: ${color}"><span style="color: rgba(0, 0, 0, 1);">${e}</span></div>`,
            className: 'marker-cluster',
            iconSize: new L.Point(radius, radius),
          });
        };

      csvLayer.addData(csv);

      var sliderControl = L.control.sliderControl({
        position: 'bottomleft',
        layer: csvLayer,
        range: false,
        alwaysShowDate: true
      });

      map.addControl(sliderControl);
      sliderControl.startSlider();
    },
    complete: function () {}
  });

}(window, document, L));
