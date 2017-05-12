/*jslint browser: true*/
/*global L */
/*global $ */

(function (window, document, L, undefined) {
  'use strict';

  var sidebar;

  L.Icon.Default.imagePath = 'images/';

  /* create leaflet map */
  var map = L.map('map', {
      center: [39.766667, -86.15],
      zoom: 8
    })
    .on('click', function (e) {
      sidebar.close();
    });

  /* add default stamen tile layer */
  L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    minZoom: 0,
    maxZoom: 18,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a></a>'
  }).addTo(map);

  sidebar = L.control.sidebar('sidebar', {
    position: 'right'
  }).addTo(map);

  var csvLayer = L.geoCsv(null, {
    firstLineTitles: true,
    fieldSeparator: ';',
    onEachFeature: function (feature, layer) {
      /*var popup = '';
      for (var prop in feature.properties) {
        var title = csvLayer.getPropertyTitle(prop);
        popup += '<b>' + title + '</b><br />' + 
          feature.properties[prop] + '<br /><br />';
      }
      layer.bindPopup(popup);*/
      layer.on('click', function (e) {
        $('#forest').text(feature.properties.forest);
        $('#total_trees').text(feature.properties.total_trees);
        $('#acreage').text(feature.properties.acreage);
        $('#volume').text(feature.properties.volume);

        $('#sold_to').text(feature.properties.sold_to);
        $('#date').text(feature.properties.time);
        $('#total_sale_price').text(feature.properties.total_sale_price);
        $('#sale_number').text(feature.properties.sale_number);

        sidebar.open('home');
      });
    },
    /*pointToLayer: function (feature, latlng) {
      return L.marker(latlng, {
        icon: L.icon({
          iconUrl: 'images/marker-icon.png',
          shadowUrl: 'images/marker-shadow.png',
          iconSize: [41, 41],
          shadowAnchor: [13, 20]
        })
      });
    },*/
  });

  $.ajax({
    type: 'GET',
    dataType: 'text',
    url: 'data/trees_database_final_bids_only_dmr.csv',
    error: function () {
      alert('cannot fetch data!');
    },
    success: function (csv) {
      L.markerClusterGroup.layerSupport().addTo(map).checkIn(csvLayer);
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
    complete: function () {
      //        $('#cargando').delay(500).fadeOut('slow');
    }
  });

}(window, document, L));