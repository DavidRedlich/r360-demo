'use strict';

/**
 * @ngdoc function
 * @name r360DemoApp.controller:MapCtrl
 * @description
 * # MapCtrl
 * Map Controller of the r360DemoApp
 */
angular.module('r360DemoApp')
    .controller('MapCtrl', function($scope, $routeParams, $location, $timeout, $mdSidenav, $mdUtil, $log, $mdDialog, $http, $q, $mdToast) {

        var vm = this;

        vm.states = {
            "requestPending" : false,
            "init" : true
        }
        // ------------
        // GENERAL SETUP
        // ------------
        $scope.pageClass = 'map-page';

        // ------------
        // CONTROLS SETUP
        // ------------

        vm.toggleOptions = toggleOptions;
        
        function toggleOptions() {
            if (!vm.states.init) slide(!vm.optsOpen);
            $mdSidenav('options').toggle();
        };

        function showToast(message) {
            $mdToast.show(
              $mdToast.simple()
                .content(message)
                .position('top right')
                .hideDelay(3000)
            );
        }

        var now = new Date();
        var hour = now.getHours();
        var minute = (now.getMinutes() + (5 - now.getMinutes() % 5)) % 60;

        if (minute == 0) {
            hour++
        };
        if (hour == 24) {
            hour = 0
        };

        vm.options = {
            "cityID": 0,
            "travelTime": 30,
            "travelTimeRangeID": 0,
            "travelType": "bike",
            "queryDate": now,
            "queryTime": {
                "h": hour,
                "m": minute
            },
            "colorRangeID": 0,
            "mapProvider": "osm",
            "sourceMarkers": [],
            "maxSourceMarkers" : 3,
            "targetMarkers": [],
            "maxTargetMarkers" : 3,
            "groups" : [],
            "intersection": "union",
            "strokeWidth": 30,
            "extendWidth": 500,
            "backgroundColor": 'black',
            "backgroundOpacity": 0,
            "minPolygonHoleSize": 1000000,
            "placesLimit" : 100,
            "transition" : true,
            "mapstyle" : "mi.0ad4304c",
            "showAdvanced" : false
        };

        vm.prefs = {
            "cities": [{
                "id"    : 0,
                "name"  : "Berlin/Brandenburg",
                "latlng": [52.516221,13.386154],
                "url"   : "https://service.route360.net/brandenburg/",

            }, {
                "id"    : 1,
                "name"  : "Norway",
                "latlng": [59.913041,10.740509],
                "url"   : "https://service.route360.net/norway/"
            }, {
                "id"    : 2,
                "name": "France",
                "latlng": [48.8588589,2.3475569],
                "url"   : "https://service.route360.net/france/"
            }, {
                "id"    : 3,
                "name": "British Columbia",
                "latlng": [49.260635,-123.115540],
                "url"   : "https://service.route360.net/canada/"
            }, {
                "id"    : 4,
                "name": "Denmark",
                "latlng": [55.688424,12.576599],
                "url"   : "https://service.route360.net/denmark/"
            }, {
                "id"    : 5,
                "name": "British Isles",
                "latlng": [51.506606,-0.128403],
                "url"   : "https://service.route360.net/britishisles/"
            }, {
                "id"    : 6,
                "name": "Switzerland",
                "latlng": [47.370455,8.538437],
                "url"   : "https://service.route360.net/switzerland/"
            }, {
                "id"    : 7,
                "name": "Austria",
                "latlng": [48.209117,16.369629],
                "url"   : "https://service.route360.net/austria/"
            }, {
                "id"    : 8,
                "name": "United States of America",
                "latlng": [40.731129,-73.987427],
                "url"   : "https://service.route360.net/na_northeast/"
            }],
            "travelTypes": [{
                "name": "Bike",
                "icon": "md:bike",
                "value": "bike",
            }, {
                "name": "Walk",
                "icon": "md:walk",
                "value": "walk",
            }, {
                "name": "Car",
                "icon": "md:car",
                "value": "car",
            }, {
                "name": "Transit",
                "icon": "md:train",
                "value": "transit",
            }],
            "queryTimeRange": {
                "hour": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
                "minute": [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]
            },
            "mapProviderList": [{
                "name": "OpenStreetMaps",
                "value": "osm"
            }, {
                "name": "Google Maps",
                "value": "google"
            }],
            "intersectionTypes": [{
                "name": "Union",
                "value": "union"
            }, {
                "name": "Intersection",
                "value": "intersection"
            }, {
                "name": "Average",
                "value": "average"
            }, ],
            "travelTimeRanges" : [{
                "name" : "5 Min - 30 Min",
                "id"   : 0,
                "times": [5,10,15,20,25,30]
                }, {
                "name" : "10 Min - 60 Min",
                "id"   : 1,
                "times": [10,20,30,40,50,60]
                }, {
                "name" : "20 Min - 120 Min",
                "id"   : 2,
                "times": [20,40,60,80,100,120]
                }
            ], 
            "colorRanges" : [{
                "name"  : "Green to Red",
                "id"    : 0,
                "colors": ["#006837","#39B54A","#8CC63F","#F7931E","#F15A24","#C1272D"],
                "opacities" : [1,1,1,1,1,1]
                }, {
                "name"  : "Colorblind",
                "id"    : 1,
                "colors": ["#142b66","#4525AB","#9527BC","#CE29A8","#DF2A5C","#F0572C"],
                "opacities" : [1,1,1,1,1,1]
                }, {
                "name"  : "Greyscale",
                "id"    : 2,
                "colors": ["#d2d2d2","#b2b2b2","#999999","#777777","#555555","#333333"],
                "opacities" : [1,0.8,0.6,0.4,0.2,0]
                }, {
                "name"  : "Inverse Mode (B/W)",
                "id"    : 3,
                "colors": ["#333"],
                "opacities" : [1,1,1,1,1,1]
                }
            ],
            "pois" : [{
                "name"  : "Supermarkets",
                "value" : "osm:shop='supermarket'",
                "icon"  : "",
                "selected" : false
            }, {
                "name"  : "ATMs",
                "value" : "osm:amenity='atm'",
                "icon"  : "",
                "selected" : false
            }, {
                "name"  : "Restaurants",
                "value" : "osm:amenity='restaurant'",
                "icon"  : "",
                "selected" : false
            }],
            "mapStyles" : [{
                "name"  : "Grey",
                "value" : "mi.0ad4304c",
            }, {
                "name"  : "Nature",
                "value" : "mi.0e455ea3",
            }]
        };


        /**
         * Parse GET parameters to options object
         * @param  {Object} $routeParams The GET parameters
         */
        for(var index in $routeParams) {

            var value = $routeParams[index];

            switch (index) {
                case "cityID" :
                case "travelTime" :
                case "travelTimeRangeID" :
                case "colorRangeID" :
                case "mapProvider" :
                case "maxSourceMarkers" :
                case "maxTargetMarkers" :
                case "strokeWidth" :
                case "extendWidth" :
                case "backgroundColor" :
                case "backgroundOpacity" :
                case "minPolygonHoleSize" :
                case "placesLimit" :
                    vm.options[index] = parseInt(value);
                    break;
                case "travelType" :
                case "mapstyle" :
                case "intersection" :
                    vm.options[index] = value;
                    break;
                case "transition" :
                    vm.options[index] = (value === "true");
                case "sources":
                case "targets":
                    break;
                default:
                    showToast('Parameter not valid');
                    break;
            }
        }

        r360.config.requestTimeout = 10000;
        r360.config.serviceUrl = vm.prefs.cities[vm.options.cityID].url;
        r360.config.serviceKey = "OOWOFUK3OPHLQTA8H5JD";
        r360.config.i18n.language = "de";

        vm.map = L.map('map', {
            zoomControl: false,
            scrollWheelZoom: true,
            contextmenu: true,
            contextmenuWidth: 220,
            contextmenuItems: [{
                text: 'New Source',
                callback: addSourceMarkerFromContext,
                iconFa: 'fa-fw fa-plus'
            }, {
                text: 'New Target',
                callback: addTargetMarkerFromContext,
                iconFa: 'fa-fw fa-plus'
            }]
        })
        .setActiveArea({
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0'
        })
        .setView(vm.prefs.cities[vm.options.cityID].latlng, 13)
        .on('load', function() {
            showToast('Markers can be added by right-clicking on the map.');
        });
        L.control.scale({
            metric: true,
            imperial: false
        }).addTo(vm.map);
        
        var attribution = "<a href='https://www.mapbox.com/about/maps/' target='_blank'>© Mapbox © OpenStreetMap</a> | © <a href='https://developers.route360.net/#availability' target='_blank'>Transit Data</a> | developed by <a href='http://www.route360.net/de/' target='_blank'>Route360°</a>";

        /**
         * Collection of all layer groups
         * @type {Object}
         */
        vm.layerGroups = {
            tileLayer: L.tileLayer('https://a.tiles.mapbox.com/v3/' + vm.options.mapstyle + '/{z}/{x}/{y}.png', {maxZoom: 18,attribution: attribution}).addTo(vm.map),
            markerLayerGroup: L.featureGroup().addTo(vm.map),
            routeLayerGroup: L.featureGroup().addTo(vm.map),
            reachableLayerGroup: L.featureGroup().addTo(vm.map),
            tempLayerGroup: L.featureGroup().addTo(vm.map),
            polygonLayerGroup: r360.leafletPolygonLayer({extendWidthX: vm.options.extendWidth, extendWidthY: vm.options.extendWidth}).addTo(vm.map)
        };

        /**
         * Apply a different tile style to thhe map.
         */
        vm.updateTileStyle = updateTileStyle;
        function updateTileStyle() {
            vm.layerGroups.tileLayer.setUrl('https://a.tiles.mapbox.com/v3/' + vm.options.mapstyle + '/{z}/{x}/{y}.png');
            vm.layerGroups.tileLayer.redraw();
        }

        var lastRelatedTarget;

        vm.map.on("contextmenu.show", function(e) {
            lastRelatedTarget = e.relatedTarget;
        });

        // Check if sources are available in GET params

        function parseAndAddMarkers(string, type) {
            var array = string.split(";");
            array.forEach(function(elem,index,array){
                var coords = elem.split(",");
                coords[0] = parseFloat(coords[0]);
                coords[1] = parseFloat(coords[1]);
                addMarker(coords, type, false);
            });
        }

        if (angular.isDefined($routeParams['targets'])) {
            parseAndAddMarkers($routeParams['targets'], "target");
        }

        if (angular.isDefined($routeParams['sources'])) {
            parseAndAddMarkers($routeParams['sources'], "source");
            getPolygons(function() {getRoutes()});
        }

        if (!angular.isDefined($routeParams['sources']) && !angular.isDefined($routeParams['targets']) ) addMarker(vm.prefs.cities[vm.options.cityID].latlng, 'source');

        /**
         * Helper function to change the city & service url
         */
        vm.flyTo = flyTo;
        function flyTo(cityID) {
            if (vm.states.init) {
                $timeout(function() { vm.states.init = false; });
            } else {
                $location.search('cityID', cityID);
                removeAllMarkers();
                r360.config.serviceUrl = vm.prefs.cities[cityID].url;
                vm.map.setView(vm.prefs.cities[cityID].latlng,10,{animate:true, duration: 1});
                addMarker(vm.prefs.cities[cityID].latlng,'source');
            }
        }

        /**
         * Helper functions to be used withing the leaflet context menu
         * @param {Object} e event
         */
        function addSourceMarkerFromContext(e) {
            addMarker(e.latlng, 'source');
        }
        function addTargetMarkerFromContext(e) {
            addMarker(e.latlng, 'target');
        }
        function removeMarkerFromContext(e) {
            removeMarker(lastRelatedTarget);
        }

        /**
         * General function fo add a new source or target marker on the map
         * @param {Array} coords The coordinates of the marker in lat,lng
         * @param {string} type Either 'source' or 'target'
         * @param {boolean} refresh Optional. If false, the getPolygons/getRoutes functions will not be trigerd. Default: true
         */
        function addMarker(coords, type, refresh) {

            if (typeof coords[0] != 'undefined' || typeof coords[1] != 'undefined')
                if (typeof coords.lat != 'undefined' || typeof coords.lng != 'undefined')
                    return;

            if (typeof coords.lat != 'undefined' && typeof coords.lng != 'undefined') {
                coords.lat = parseFloat(coords.lat.toFixed(6));
                coords.lng = parseFloat(coords.lng.toFixed(6));
            }

            if (typeof coords[0] != 'undefined' && typeof coords[1] != 'undefined') {
                coords[0] = parseFloat(coords[0].toFixed(6));
                coords[1] = parseFloat(coords[1].toFixed(6));
            }

            if (typeof refresh === 'undefined') { refresh = true; }

            var markerArray = undefined;
            var markerIcon = undefined;
            if (type != 'temp') var markerLayerGroup = vm.layerGroups.markerLayerGroup;
            else var markerLayerGroup = vm.layerGroups.tempLayerGroup;

            switch (type) {
                case 'source':
                    if (vm.options.sourceMarkers.length >= vm.options.maxSourceMarkers) {
                        showToast('Maximum number of source Markers reached (' + vm.options.maxSourceMarkers + ")");
                        return;
                    };
                    markerArray = vm.options.sourceMarkers;
                    markerIcon = L.icon({
                        iconUrl: '/styles/icons/marker_source.svg',
                        shadowUrl: '/styles/icons/marker_shadow.svg',
                        iconSize:     [28, 40],
                        shadowSize:   [27, 18],
                        iconAnchor:   [14, 40],
                        shadowAnchor: [7, 14],
                        popupAnchor:  [0, -43]
                    })
                    break;
                case 'target':
                    if (vm.options.targetMarkers.length >= vm.options.maxTargetMarkers) {
                        showToast('Maximum number of target Markers reached (' + vm.options.maxSourceMarkers + ")");
                        return;
                    };
                    markerArray = vm.options.targetMarkers;
                    markerIcon = L.icon({
                        iconUrl: '/styles/icons/marker_target.svg',
                        shadowUrl: '/styles/icons/marker_shadow.svg',
                        iconSize:     [28, 40],
                        shadowSize:   [27, 18],
                        iconAnchor:   [14, 40],
                        shadowAnchor: [7, 14],
                        popupAnchor:  [0, -43]
                    })
                    break;

                case 'temp' : 
                    markerIcon = L.icon({
                        iconUrl: '/styles/icons/marker_temp.svg',
                        iconSize:     [15, 15],
                        iconAnchor:   [7.5, 7.5],
                        shadowAnchor: [4, 62],
                        popupAnchor:  [0, -10]
                    })
                    break;
                default:
                    console.log('addMarker error');
                    showToast('The Marker could not be added');
                    break;
            }

            if (type == 'temp') {

                var newMarker = L.marker(coords, {
                    icon: markerIcon,
                }).addTo(markerLayerGroup);

                var promise = reverseGeocode(coords);
                promise.then(function(properties){
                    var description = buildPlaceDescription(properties);
                    newMarker.bindPopup("<strong>" + description.title + "</strong>", {closeButton: false});

                    newMarker.openPopup();
                })

                vm.map.setView(coords,15);

            } else {

                var newMarker = L.marker(coords, {
                    draggable: true,
                    icon: markerIcon,
                    contextmenu: true,
                    contextmenuItems: [{
                        text: 'Delete Marker',
                        callback: removeMarkerFromContext,
                        index: 0,
                        iconFa: 'fa-fw fa-times'
                    }, {
                        separator: true,
                        index: 1
                    }]
                })
                .addTo(markerLayerGroup)
                //.addTo(vm.srcTrgLayer);

                newMarker.on('dragend', function() {
                    this._latlng.lat = this._latlng.lat.toFixed(6);
                    this._latlng.lng = this._latlng.lng.toFixed(6);
                    var promise = reverseGeocode(this._latlng);
                    promise.then(function(properties){
                        newMarker.description = buildPlaceDescription(properties);
                    })
                    getPolygons(function() {
                        getRoutes();
                    });
                    updateURL();
                })

                newMarker.on('click', function() {
                    if (!vm.optsOpen) vm.optsOpen;
                })

                markerArray.push(newMarker);

                updateURL();
                if (refresh) {
                    getPolygons(function() {
                        getRoutes();
                    });
                }
                var promise = reverseGeocode(coords);
                promise.then(function(properties){
                    newMarker.description = buildPlaceDescription(properties);
                    // console.log(markerArray);
                })

            }

        }

        function reverseGeocode(coords) {

            var url = "";

            var deferred = $q.defer();

            if (typeof coords.lat != 'undefined' && typeof coords.lng != 'undefined') 
                url = "http://service.route360.net/geocode/reverse?lon=" + coords.lng + "&lat=" + coords.lat;

            if (typeof coords[0] != 'undefined' && typeof coords[1] != 'undefined') 
                url = "http://service.route360.net/geocode/reverse?lon=" + coords[1] + "&lat=" + coords[0];

            $http({
                method: 'GET',
                url: url
            }).then(function(response) {
                // console.log(response);
                if (response.data.features.length > 0) {
                    var properties = response.data.features[0].properties;
                    if (typeof properties.name === 'undefined') {
                        properties.name = "";
                        if (typeof properties.street != 'undefined') properties.name += properties.street;
                        if (typeof properties.housenumber != 'undefined') properties.name += " " + properties.housenumber;
                    }
                }
                else {
                    properties = {
                        "name" : "Marker",
                        "city" : "",
                        "country" : ""
                    }
                }
                deferred.resolve(properties);
            }, function(response) {
                showToast("reverse Geocoding failed");
            });

            return deferred.promise;
        }

        function buildPlaceDescription(obj) {

            var result = {
                title : "",
                meta1 : "",
                meta2 : "",
                full  : ""
            }

            var name = undefined;
            var adress1 = undefined;
            var adress2 = undefined;

            if (angular.isDefined(obj['name'])) {
                name = obj.name;
            }

            if (angular.isDefined(obj['street'])) {
                adress1 = obj.street;
                if (angular.isDefined(obj['housenumber'])){
                    adress1 += " " + obj.housenumber;
                }
            }

            if (angular.isDefined(obj['city'])){
                adress2 = obj.city;
                if ((angular.isDefined(obj['postcode']))) {
                    adress2 = obj.postcode + " " + adress2;
                }
                if ((angular.isDefined(obj['country']))) {
                    adress2 += ", " + obj.country;
                }
            } else {
                if ((angular.isDefined(obj['country']))) {
                    adress2 = obj.country;
                }
            }

            if (angular.isDefined(name)) {
                result.title = name;
                result.meta1 = adress1;
                result.meta2 = adress2;
            } else {
                result.title = adress1;
                result.meta1 = adress2;
            }

            result.full = result.title;
            if (result.meta1 != '' && angular.isDefined(result.meta1))  result.full += ", " +  result.meta1;
            if (result.meta2 != '' && angular.isDefined(result.meta2))  result.full += ", " +  result.meta2;

            return result;
        }

        /**
         * General function to remove a single marker from the map
         * @param  {object} marker Leaflet marker to be removed
         */
        vm.removeMarker = removeMarker;
        function removeMarker(marker) {

            vm.layerGroups.markerLayerGroup.removeLayer(marker);

            if (vm.options.sourceMarkers != undefined) {
                vm.options.sourceMarkers.forEach(function(elem, index, array) {
                    if (elem == marker) {
                        array.splice(index, 1);
                        console.log("source Marker deleted");
                    }
                })
            }

            if (vm.options.targetMarkers != []) {
                vm.options.targetMarkers.forEach(function(elem, index, array) {
                    if (elem == marker) {
                        array.splice(index, 1);
                        console.log("target Marker deleted");
                    }
                })
            }

            updateURL();

            getPolygons(function() {
              getRoutes();
            });


        }

        /**
         * Remove all Markers from the map
         */
        function removeAllMarkers() {
            vm.layerGroups.markerLayerGroup.clearLayers();
            vm.layerGroups.polygonLayerGroup.clearLayers();
            vm.layerGroups.routeLayerGroup.clearLayers();
            vm.layerGroups.tempLayerGroup.clearLayers();
            vm.options.sourceMarkers = [];
            vm.options.targetMarkers = [];
        }

        /**
         * Build an r360 TravelOptions object from scope.options
         * @return {r360.travelOptions} Returns an r360 TravelOptions object
         */
        function buildTravelOptions() {

            var travelOptions = r360.travelOptions();

            //
            var travelTime = vm.options.travelTime * 60;
            var travelTimes=[];
            var defaultColors =[];

            vm.prefs.travelTimeRanges[vm.options.travelTimeRangeID].times.forEach(function(elem, index, array) {
                var dataSet = {};
                dataSet.time  = elem*60;
                dataSet.color = vm.prefs.colorRanges[vm.options.colorRangeID].colors[index];
                dataSet.opacity = vm.prefs.colorRanges[vm.options.colorRangeID].opacities[index];
                defaultColors.push(dataSet);
            })

            r360.config.defaultTravelTimeControlOptions.travelTimes=defaultColors;

            defaultColors.forEach(function(elem, index, array) {
                if (elem.time <= travelTime) {
                    travelTimes.push(elem.time);
                }
            })

            travelOptions.setTravelTimes(travelTimes);

            travelOptions.setTravelType(vm.options.travelType);

            vm.options.sourceMarkers.forEach(function(elem, index, array) {
                elem.id = r360.Util.generateId();
                travelOptions.addSource(elem);
            })

            vm.options.targetMarkers.forEach(function(elem, index, array) {
                travelOptions.addTarget(elem);
            })

            travelOptions.extendWidthX = vm.options.extendWidth * 2;
            travelOptions.extendWidthY = vm.options.extendWidth * 2;

            if (vm.options.colorRangeID == 3) {
                vm.layerGroups.polygonLayerGroup.setInverse(true);
            } else {
                vm.layerGroups.polygonLayerGroup.setInverse(false);
            };

            travelOptions.backgroundColor = vm.options.backgroundColor;

            travelOptions.setIntersectionMode(vm.options.intersection);
            //travelOptions.setWaitControl(vm.waitControl);

            var rawDate = vm.options.queryDate;
            var date = String(rawDate.getFullYear()) + ('0' + String(rawDate.getMonth())).slice(-2) + ('0' + String(rawDate.getDate())).slice(-2);
            travelOptions.setDate(date);

            var rawTime = vm.options.queryTime;
            var time = rawTime.h * 3600 + rawTime.m * 60;

            travelOptions.setTime(time);
            travelOptions.setMinPolygonHoleSize(vm.options.minPolygonHoleSize);

            if (vm.travelType == 'car') travelOptions.setMinPolygonHoleSize(10000000);

            return travelOptions;
        }

        /**
         * Clear the polygon layer, request and draw new polgons
         */
        function getPolygons(callback) {

            vm.states.requestPending = true;

            if (vm.options.sourceMarkers.length == 0) {
                vm.layerGroups.polygonLayerGroup.clearLayers();
                vm.states.requestPending = false;
                return;
            }

            var travelOptions = buildTravelOptions();

            r360.PolygonService.getTravelTimePolygons(travelOptions,

                function(polygons) {
                    vm.layerGroups.polygonLayerGroup.clearAndAddLayers(polygons, true);
                    vm.states.requestPending = false;
                    $scope.$apply();
                    if(angular.isDefined(callback)) callback();
                },
                function(status,message) {
                    vm.states.requestPending = false;
                    $mdDialog.show(
                        $mdDialog.alert()
                        .parent(angular.element(document.querySelector('#map')))
                        .clickOutsideToClose(true)
                        .title('Something went wrong')
                        .content(message)
                        .ariaLabel('Error Dialog')
                        .ok('Got it!')
                    );
                }
            );
        }

        /**
         * Clear the route layer, request and draw new routes
         */
        function getRoutes(callback) {

            vm.states.requestPending = true;

            vm.layerGroups.routeLayerGroup.clearLayers();

            if (vm.options.targetMarkers.length == 0) {
                vm.states.requestPending = false;
                return;
            }
            //vm.srcTrgLayer.clearLayers();
            //vm.srcTrgLayer.addLayer(vm.source);
            //vm.srcTrgLayer.addLayer(vm.options.place.marker);

            var travelOptions = buildTravelOptions();

            r360.RouteService.getRoutes(travelOptions, function(routes) {

                vm.states.requestPending = false;

                routes.forEach(function(elem, index, array) {
                    r360.LeafletUtil.fadeIn(vm.layerGroups.routeLayerGroup, elem, 500, "travelDistance", {
                        color: "red",
                        haloColor: "#fff"
                    });
                })

                //vm.options.place.travelTime = routes[0].travelTime - 4 == vm.options.place.travelTime ? vm.options.place.travelTime - 4 : vm.options.place.travelTime;
                //vm.options.place.distance   = routes[0].getDistance().toFixed(3);

                // vm.map.fitBounds(vm.srcTrgLayer.getBounds(), { paddingBottomRight : [500, 0]});

                if (!$scope.$$phase) $scope.$apply();
                if (typeof callback !== 'undefined') callback();

            });
        }

        vm.autocomplete = [];
        vm.autocomplete.querySearch = querySearch;
        vm.autocomplete.selectedItemChange = selectedItemChange;
        vm.addAs = addAs;

        function selectedItemChange(item) {
            vm.layerGroups.tempLayerGroup.clearLayers();
            if (angular.isDefined(item)) addMarker([item.geometry.coordinates[1], item.geometry.coordinates[0]], 'temp');
        }

        function addAs(type) {
            if (angular.isDefined(vm.autocomplete.selectedItem) && vm.autocomplete.selectedItem) {
                addMarker([vm.autocomplete.selectedItem.geometry.coordinates[1], vm.autocomplete.selectedItem.geometry.coordinates[0]], type);
                vm.autocomplete.selectedItem = undefined;
            } else showToast('No place defined.');
        }

        function querySearch(query) {

            var center = vm.map.getCenter();
            var results = [];
            var deferred = $q.defer();

            $http({
                method: 'GET',
                url: "http://service.route360.net/geocode/api/?q=" + query + "&lat=" + center.lat + "&lon=" + center.lng + "&limit=5"
            }).then(function(response) {
                results = response.data.features.map(function(result) {
                    result.value = result.properties.osm_id;
                    result.description = buildPlaceDescription(result.properties);
                    console.log(result.description);
                    return result;
                });
                deferred.resolve(results);
            }, function(response) {
                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#map')))
                    .clickOutsideToClose(true)
                    .title('Something went wrong')
                    .content('Please try Again later')
                    .ariaLabel('Alert Dialog')
                    .ok('Got it!')
                );
            });

            console.log(deferred.promise);
            return deferred.promise;

        }

        vm.getPlaces = getPlaces;

        function getPlaces() {
            vm.layerGroups.reachableLayerGroup.clearLayers();

            vm.options.requestPending = true;

            var bounds = vm.layerGroups.polygonLayerGroup.getBoundingBox4326();
            var SW = bounds.getSouthWest(), NE = bounds.getNorthEast();

            var types = []

            vm.prefs.pois.forEach(function(elem, index, array) {
                if (elem.selected) types.push(elem.value);
            });

            var params = [
                "lat="+vm.options.sourceMarkers[0].getLatLng().lat,
                "lng="+vm.options.sourceMarkers[0].getLatLng().lng,
                "radius=500",
                "northEast="+NE.lat+'|'+NE.lng,
                "southWest="+SW.lat+'|'+SW.lng,
                "timeout=10000",
                "types=" + types.join("&types=")
            ];

            $http.get("http://dev.route360.net/places/places?" + params.join("&")).then(function(response){

                var places = response.data;

                if ( types.length > 0 && places.length == 0 ) console.log("TODO implement notification");

                if ( places.length == 0 ) { vm.requestPending = false; return; }

                vm.options.groups = [];

                var travelOptions = r360.travelOptions();
                travelOptions.setTravelType(vm.options.travelType);
                travelOptions.addSource(vm.options.sourceMarkers[0]);
                travelOptions.setTargets(places);
                travelOptions.setTravelTimes([vm.options.travelTime*60]);
                var rawDate = vm.options.queryDate;
                var date = String(rawDate.getFullYear()) + ('0' + String(rawDate.getMonth())).slice(-2) + ('0' + String(rawDate.getDate())).slice(-2);
                travelOptions.setDate(date);
                var rawTime = vm.options.queryTime;
                var time = rawTime.h * 3600 + rawTime.m * 60;
                travelOptions.setTime(time);
                travelOptions.setMaxRoutingTime(vm.options.travelTime*60);


                // call the service
                r360.TimeService.getRouteTime(travelOptions, function(sources){

                    // get each target for the first source (only one source was supplied to the service)
                    _.each(sources[0].targets, function(target){

                        var place = _.find(places, function(place){ return place.id == target.id ; }); 
                        place.travelTime = target.travelTime;
                        if ( place.matchedPlaces.length == 0 ) place.matchedPlaces.push(place);

                        var  markerIcon = L.icon({
                            iconUrl: '/styles/icons/marker_source.svg',
                            shadowUrl: '/styles/icons/marker_shadow.svg',
                            iconSize:     [28, 40], // size of the icon
                            shadowSize:   [27, 18],
                            iconAnchor:   [14, 40], // point of the icon which will correspond to marker's location
                            shadowAnchor: [7, 14],  // the same for the shadow
                            popupAnchor:  [0, -43] // point from which the popup should open relative to the iconAnchor
                        })

                        // check if place is reachable
                        if ( place.travelTime > 0 && place.travelTime <= travelOptions.getMaxRoutingTime() ) {

                            if ( addPlaceToGroup(place) ) {

                                place.marker = L.marker([place.lat, place.lng], { icon: markerIcon, opacity : 1 })
                                    .addTo(vm.layerGroups.reachableLayerGroup);

                                place.marker.on('click', function(e){
                                    vm.highlight(place);
                                });
                            }
                        }
                    });

                    var errors = [];
                    vm.options.groups.forEach(function(group){ if ( _.has(group, 'error')) errors.push( group.key ); })

                    if ( errors.length > 0 ) {

                        var message;
                        if ( errors.length == 1 ) message = "Für den Objekttyp " + errors[0] + " wurden sehe viele Ergebnisse gefunden. Es werden daher nur die Top " + vm.options.placesLimit + " angezeigt!";
                        else message = "Für die Objekttypen '" + errors.join(', ') + "'' wurden sehe viele Ergebnisse gefunden. Es werden daher nur die Top " + vm.options.placesLimit + " angezeigt!";
                        // TODO notification
                    }

                    vm.options.requestPending = false;
                    //vm.buildGraphs(); TODO
                    //vm.buildTableParams(); TODO
                    //vm.showSearchOrResult(false); TODO
                    if ( !$scope.$$phase ) $scope.$apply();
                });
            });
        }

        function addPlaceToGroup(place){

            var inserted = false;

            vm.options.groups.forEach(function(group){
                // group was previously defined
                if ( group.key == place.type ) { 

                    if ( group.data.length >= vm.options.placesLimit ) {

                        place.error = "too-many-objects";
                        group.error = "too-many-objects";
                    }   
                    else {

                        group.data.push(place); 
                        inserted = true;
                    } 
                }
            });

            // group has not yet been initialized
            if ( !inserted && !place.error ) 
                vm.options.groups.push({ key : place.type, data : [place], tableParams : undefined });

            return !(_.has(place, 'error') && "too-many-objects" == place.error);
        }

        function highlight(place) {

            if (clickedMarker != null) { console.log("clickedMarker");clickedMarker.setIcon(vm.getIcon(place))};
            clickedMarker = place.marker;
            clickedMarker.setIcon(vm.getSelectIcon(place));

            vm.showSearchOrResult(false);

            if ( !vm.isSelected(place) ) {

                vm.groups.forEach(function(group){
                    if ( group.key == place.type ) group.open = true;
                    else group.open = false;
                });

                $timeout(function () {
                    var div = $("#"+place.type+"-place-" + place.id);
                    var offset = Math.floor( $(div).offset().top - $("#side-bar").offset().top - $(window).innerHeight()/2 + div.height()/2);
                    $("#pageslide").animate({ scrollTop: offset }, 500);
                }, 500);

                vm.options.place = place;
                vm.paintRoute();
            }
        }

        vm.focus = focus;
        function focus(marker,add) {
            if (add) {
                marker.bindPopup('<strong>' + marker.description.title + '</strong>', {closeButton: true, minWidth: 10});
                marker.openPopup();
            } else {
                marker.closePopup();
                marker.unbindPopup();
            }
        }



        $scope.$watch('vm.options.travelTimeRangeID', function(newVal) {

            if(!angular.isDefined(newVal)) return;

            var dist = 999999;
            var nextVal = 30;

            vm.prefs.travelTimeRanges[newVal].times.forEach(function(elem, index, array) {
                if (dist > Math.abs(elem - vm.options.travelTime)) {
                    dist = Math.abs(elem - vm.options.travelTime)
                    nextVal = elem;
                }
            });

            vm.options.travelTime = nextVal;
        });

        $scope.$watch('vm.options.travelType', function(newVal) {

             vm.prefs.travelTypes.forEach(function(elem,index,array){
                if (elem['value'] == newVal) vm.options.travelTypeIcon = elem['icon'];
            })

        });

        /**
         * Should be trigered everytime the user changes an options value.
         */
        $scope.$watchCollection('options', function(newCollection, oldCollection, scope) {
            if (!vm.states.init) {
                updateURL();
                getPolygons(function() {
                    getRoutes();
                });
            }
        });



        function updateURL() {

            for (var index in vm.options) {
                switch (index) {
                    case 'sourceMarkers':
                        if (vm.options.sourceMarkers.length == 0)  {
                            $location.search("sources", null);
                            break;
                        }
                        var sources = [];
                        vm.options.sourceMarkers.forEach(function(elem,index,array){
                            sources.push(elem._latlng.lat + "," + elem._latlng.lng);
                        });
                        $location.search("sources", sources.join(";"));
                        break;
                    case 'targetMarkers': 
                        if (vm.options.targetMarkers.length == 0) {
                             $location.search("targets", null);
                            break;
                        };
                        var targets = [];
                        vm.options.targetMarkers.forEach(function(elem,index,array){
                            targets.push(elem._latlng.lat + "," + elem._latlng.lng);
                        });
                        $location.search("targets", targets.join(";"));
                        break;
                    case 'cityID':
                    case 'travelTime':
                    case 'travelTimeRangeID':
                    case 'travelType':
                    case 'colorRangeID':
                    case 'intersection':
                    case 'transition':
                    case 'mapstyle':
                        if (angular.isDefined($routeParams[index]) && $routeParams[index] == vm.options[index]) break;
                        $location.search(index, String(vm.options[index]));
                        break;
                    default:
                        break;
                }
            }

        }

        function slide(open) {

            if (open) {

                if (vm.options.transition) vm.map.panBy([-275, 0]);
                vm.map.setActiveArea({
                    position: 'absolute',
                    top: '0',
                    left: '550px',
                    right: '0',
                    bottom: '0'
                });

            } else {
                if (vm.options.transition) vm.map.panBy([275, 0]);
                vm.map.setActiveArea({
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    right: '0',
                    bottom: '0'
                });
            };

        }

        $timeout(function() { vm.states.init = false; }, 2000);
    });