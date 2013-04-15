dojo.require("esri.map");
dojo.require("esri.geometry");
dojo.require("esri.renderer");
dojo.require("esri.layers.FeatureLayer");
dojo.require("esri.layers.agsdynamic");
dojo.require("esri.tasks.find");
dojo.require("esri.tasks.geometry")
dojo.require("esri.toolbars.draw");
dojo.require("esri.toolbars.edit");
dojo.require("esri.dijit.Popup");
dojo.require("esri.dijit.Measurement");
dojo.require("esri.dijit.Scalebar");
dojo.require("dijit.Dialog");
dojo.require("dijit.Menu");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.form.TextBox");
dojo.require("dojo.fx");


var topnavheight = 51; // height of the navigation bar at the top of the page
var map;
var mapPoint;
var tinyURLServiceURL, tinyResponse;
var aerialmap,streetmap,communitymap;
var findTask,findParams;
var graphic,watchId;
var gsvc;
var defaultExtent = "486056.022845771,4704189.10950601,608145.600358259,4781489.93077432";
var tb,etb,graphicMenu,measurement;
var loading;

// settings used by this application
var settings = {
		"FeatureLayers": [ //list all of the layers to be included in this map. Add "HideListing": true to hide them from the "Browse Features" menu
			{ 
				"Name": "Arenas",
				"ServiceUrl": "http://gis.norfolkcounty.ca/ArcGIS/rest/services/JAVA_Norfolk_Maps/MapServer/1",
			},
			{ 
				"Name": "Ball Parks",
				"ServiceUrl": "http://gis.norfolkcounty.ca/ArcGIS/rest/services/JAVA_Norfolk_Maps/MapServer/2",
			},
			{ 
				"Name": "Community Centres",
				"ServiceUrl": "http://gis.norfolkcounty.ca/ArcGIS/rest/services/JAVA_Norfolk_Maps/MapServer/3",
			},
			{ 
				"Name": "Conservation Areas",
				"ServiceUrl": "http://gis.norfolkcounty.ca/ArcGIS/rest/services/JAVA_Norfolk_Maps/MapServer/4",
				"ZoomLevel": 8,
			},
			{ 
				"Name": "Court House",
				"ServiceUrl": "http://gis.norfolkcounty.ca/ArcGIS/rest/services/JAVA_Norfolk_Maps/MapServer/5",
			},
			{ 
				"Name": "County Offices",
				"ServiceUrl": "http://gis.norfolkcounty.ca/ArcGIS/rest/services/JAVA_Norfolk_Maps/MapServer/6",
			},
			{ 
				"Name": "Curling",
				"ServiceUrl": "http://gis.norfolkcounty.ca/ArcGIS/rest/services/JAVA_Norfolk_Maps/MapServer/7",
			},
			{ 
				"Name": "Firehalls",
				"ServiceUrl": "http://gis.norfolkcounty.ca/ArcGIS/rest/services/JAVA_Norfolk_Maps/MapServer/8",
			},
			{ 
				"Name": "Golf Courses",
				"ServiceUrl": "http://gis.norfolkcounty.ca/ArcGIS/rest/services/JAVA_Norfolk_Maps/MapServer/9",
			},
			{ 
				"Name": "Hospital",
				"ServiceUrl": "http://gis.norfolkcounty.ca/ArcGIS/rest/services/JAVA_Norfolk_Maps/MapServer/10",
			},
			{ 
				"Name": "Information Booth",
				"ServiceUrl": "http://gis.norfolkcounty.ca/ArcGIS/rest/services/JAVA_Norfolk_Maps/MapServer/11",
			},
			{ 
				"Name": "Library",
				"ServiceUrl": "http://gis.norfolkcounty.ca/ArcGIS/rest/services/JAVA_Norfolk_Maps/MapServer/12",
			},
			{ 
				"Name": "Marinas",
				"ServiceUrl": "http://gis.norfolkcounty.ca/ArcGIS/rest/services/JAVA_Norfolk_Maps/MapServer/13",
			},
			{ 
				"Name": "Museums/Art Galleries",
				"ServiceUrl": "http://gis.norfolkcounty.ca/ArcGIS/rest/services/JAVA_Norfolk_Maps/MapServer/14",
			},
			{ 
				"Name": "Parkinglots",
				"ServiceUrl": "http://gis.norfolkcounty.ca/ArcGIS/rest/services/JAVA_Norfolk_Maps/MapServer/15",
			},
			{ 
				"Name": "Parks",
				"ServiceUrl": "http://gis.norfolkcounty.ca/ArcGIS/rest/services/JAVA_Norfolk_Maps/MapServer/16",
			},
			{ 
				"Name": "Police",
				"ServiceUrl": "http://gis.norfolkcounty.ca/ArcGIS/rest/services/JAVA_Norfolk_Maps/MapServer/17",
			},
			{ 
				"Name": "Pool",
				"ServiceUrl": "http://gis.norfolkcounty.ca/ArcGIS/rest/services/JAVA_Norfolk_Maps/MapServer/18",
			},
			{ 
				"Name": "Post Offices",
				"ServiceUrl": "http://gis.norfolkcounty.ca/ArcGIS/rest/services/JAVA_Norfolk_Maps/MapServer/19",
			},
			{ 
				"Name": "Provincial Parks",
				"ServiceUrl": "http://gis.norfolkcounty.ca/ArcGIS/rest/services/JAVA_Norfolk_Maps/MapServer/20",
			},
			{ 
				"Name": "Roller Skating",
				"ServiceUrl": "http://gis.norfolkcounty.ca/ArcGIS/rest/services/JAVA_Norfolk_Maps/MapServer/21",
			},
			{ 
				"Name": "Schools",
				"ServiceUrl": "http://gis.norfolkcounty.ca/ArcGIS/rest/services/JAVA_Norfolk_Maps/MapServer/22",
			},
			{ 
				"Name": "Skate Board Park",
				"ServiceUrl": "http://gis.norfolkcounty.ca/ArcGIS/rest/services/JAVA_Norfolk_Maps/MapServer/23",
			},
			{ 
				"Name": "Soccer Fields",
				"ServiceUrl": "http://gis.norfolkcounty.ca/ArcGIS/rest/services/JAVA_Norfolk_Maps/MapServer/24",
			},
			{ 
				"Name": "Tennis Courts",
				"ServiceUrl": "http://gis.norfolkcounty.ca/ArcGIS/rest/services/JAVA_Norfolk_Maps/MapServer/25",
			},
			{ 
				"Name": "Waste Transfer Station",
				"ServiceUrl": "http://gis.norfolkcounty.ca/ArcGIS/rest/services/JAVA_Norfolk_Maps/MapServer/26",
			},
			{ 
				"Name": "Roads",
				"ServiceUrl": "http://gis.norfolkcounty.ca/ArcGIS/rest/services/JAVA_Norfolk_Maps/MapServer/27",
				"HideListing":true,
			},
			{ 
				"Name": "Urban and Hamlet Areas",
				"ServiceUrl": "http://gis.norfolkcounty.ca/ArcGIS/rest/services/JAVA_Norfolk_Maps/MapServer/28",
				"HideListing":true,
				
			},
		],
		'InfoWindowFieldsCollection' : [ // sets up the fields used in the Info Window boxes
			{"DisplayText":"Name", "FieldName": "Name"},
			{"DisplayText":"Address", "FieldName": "Address"},
			{"DisplayText":"Town", "FieldName": "FormerTown"},
			{"DisplayText":"Postal Code", "FieldName": "PostalCode"},
			{"DisplayText":"Contact", "FieldName": "Contact"},
			{"DisplayText":"Website", "FieldName": "WebSite"},
		],
		// Information in the welcome message
		'SplashMessage' : "<h1>Disclaimer</h1><p>Welcome to the Norfolk County Interactive Web Mapping Applications.   Norfolk County provides these applications and data for information purposes only and takes no responsibility for, nor guarantees, the accuracy of all information contained within the applications.  Data is collected and maintained by various sources and is not necessarily accurate to mapping, engineering or surveying standards.  Property lines are not survey accurate and could contain errors and should be verified independently.</p><p><a href='termsofuse.html'>View Terms of Use</a>",
	};


function init() {
	
	// use dojo to set the heights and widths of the relevant areas
	dojo.style(dojo.byId("mapDiv"), { width: dojo.contentBox("mapDiv").w + "px", height: (esri.documentBox.h) - topnavheight + "px" });
	dojo.style(dojo.byId("sidebar"), { height: (esri.documentBox.h) - topnavheight + "px" });

	//onorientationchange doesn't always fire in a timely manner in Android so check for both orientationchange and resize
    var supportsOrientationChange = "onorientationchange" in window, orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";

    // support for changes to orientation on tablet devices
    if(window.addEventListener) { // for IE8 support
	    window.addEventListener(orientationEvent, function() {
	            orientationChanged();
	    }, false);
    }

	// get and set extent from url if present
	var zoomExtent;
    var extent = GetQuerystring('extent');
    if (extent != "") {
        zoomExtent = extent.split(',');
    }
    else {
        zoomExtent = defaultExtent.split(',');
    }
    var startExtent = new esri.geometry.Extent(parseFloat(zoomExtent[0]), parseFloat(zoomExtent[1]), parseFloat(zoomExtent[2]), parseFloat(zoomExtent[3]), new esri.SpatialReference({wkid:26917}));
	
	// set geometry service
	esri.config.defaults.geometryService = new esri.tasks.GeometryService("http://gis.norfolkcounty.ca/ArcGIS/rest/services/Geometry/GeometryServer");
	gsvc = new esri.tasks.GeometryService("http://gis.norfolkcounty.ca/ArcGIS/rest/services/Geometry/GeometryServer");

	// setting up the search
	findTask = new esri.tasks.FindTask("http://gis.norfolkcounty.ca/ArcGIS/rest/services/JAVA_Norfolk_Maps/MapServer");
	
	// setup popup options for infowindow
    var popupOptions = {
      'markerSymbol': new esri.symbol.SimpleMarkerSymbol('circle', 32, null, new dojo.Color([0, 0, 0, 0.25])),
      'marginLeft': '20', 
      'marginTop': '20'
    };
    var popup = new esri.dijit.Popup(popupOptions, dojo.create("div"));

    // initiate map
	map = new esri.Map("mapDiv", {extent: startExtent, infoWindow: popup, logo:false, sliderStyle: "large"});


	// define base layers
	aerialmap = new esri.layers.ArcGISTiledMapServiceLayer("http://gis.norfolkcounty.ca/ArcGIS/rest/services/JAVA_CACHE_BASE_Imagery_2010/MapServer");
	streetmap = new esri.layers.ArcGISTiledMapServiceLayer("http://gis.norfolkcounty.ca/ArcGIS/rest/services/JAVA_CACHE_BASE_Street/MapServer");
	communitymap = new esri.layers.ArcGISTiledMapServiceLayer("http://gis.norfolkcounty.ca/ArcGIS/rest/services/JAVA_CACHE_BASE_Community/MapServer");
	drawLayer = new esri.layers.GraphicsLayer();

	// add Civic Address layer
	var addressLayer = new esri.layers.ArcGISDynamicMapServiceLayer("http://gis.norfolkcounty.ca/ArcGIS/rest/services/JAVA_Norfolk_Maps/MapServer");
	addressLayer.setVisibleLayers([0]);

	// add layers to map
	map.addLayers([aerialmap,streetmap,communitymap,drawLayer]);
	aerialmap.hide();
	streetmap.hide();
	map.addLayer(addressLayer);
	
	// add feature layers
	var featureLayers = settings.FeatureLayers;
	for(var i=0; i<featureLayers.length-1; i++) {
		var layer = featureLayers[i];

		// create the layer
		var featureLayer = new esri.layers.FeatureLayer(layer.ServiceUrl, {
			mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
			id: layer.Name,
			outFields: ["*"]
		});
		
		map.addLayer(featureLayer);

		// show the layers in the Browse menu unless they're marked as hidden
		if(!layer.HideListing) {
			dojo.connect(featureLayer,"onLoad",buildList);
		}
		// if the layer is marked as hidden, hide it from the map
		if(layer.Hidden) {
			featureLayer.hide();
		}
		
		// show the popup window when clicking on an image to view
		dojo.connect(featureLayer, "onClick", function (evtArgs) {
        	ShowInfoWindow(evtArgs.graphic);
    	});

		//show the splash message when the map loads
		dojo.byId('divLoadMessage').innerHTML = settings.SplashMessage;
		dijit.byId('dialogLoadMessage').show();
	}

	//function to share the point with their services
    var url = esri.urlToObject(window.location.toString());
    if (url.query && url.query != null) {
        if (url.query.extent.split("?")[1]) {
            bounds = url.query.extent.split("?")[1].split("=")[1].split(",");
            x = parseFloat(bounds[0]);
            y = parseFloat(bounds[1]);
            mapPoint = new esri.geometry.Point(x, y, map.spatialReference);
            bounds = '';
            addGraphic(mapPoint);    
    		map.centerAndZoom(mapPoint, map._slider.maximum - 2);
        }
    }

	// setting up actions
	dojo.connect(dojo.byId("lblAppName"),"onclick",function() { // send Norfolk Maps Link to a desired location
		window.location = "http://norfolkcounty.ca/";
	});
	dojo.connect(map, "onLoad",initToolbar); // create toolbar
	dojo.connect(dojo.byId("aerialmap"), "onclick", showAerialMap); // show Aerial Map link
	dojo.connect(dojo.byId("streetmap"), "onclick", showStreetMap); // show Street Map link
	dojo.connect(dojo.byId("communitymap"),"onclick",showCommunityMap); // show Community Map link
	dojo.connect(dojo.byId("findme"),"onclick", findMyLocation); // use geolocation to find user
	dojo.connect(window, 'resize',map,map.resize); // resize map when browser window resizes
	
	// add scalebar to map
	dojo.connect(map, "onLoad", function(theMap) {
      var scalebar = new esri.dijit.Scalebar({
        map: map,
        scalebarUnit: "metric"
      });
    });


	// setting up the searches - different layers search different fields
	dojo.connect(dojo.byId("searchCivicAddress"), "onclick",function() {
		layerIds = [0];  // setting up the layers to search information in
		searchFields = ['CIVIC_ADD']; // fields to search in
		doSearch(layerIds,searchFields); // perform the search
	});
	dojo.connect(dojo.byId("searchTown"),"onclick",function() {
		layerIds = [28];
		searchFields = ['Name'];
		doSearch(layerIds,searchFields);
	});
	dojo.connect(dojo.byId("searchRoad"),"onclick",function() {
		layerIds = [27];
		searchFields = ['ROAD_NAME', 'ALT_NAME_1', 'ALT_NAME_2', 'ALT_NAME_3', 'FORMER_NAM','ROAD_NAME'];
		doSearch(layerIds,searchFields);
	});
} // end of init()

// set up the Tools toolbar
function initToolbar(map) {
	tb = new esri.toolbars.Draw(map, {showTooltips: true});
	etb = new esri.toolbars.Edit(map);
	var sls = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DOT, new dojo.Color([255,0,0,1]),4);
	var pms = symbol = new esri.symbol.PictureMarkerSymbol('img/flag.png', 24, 24);
	measurement = new esri.dijit.Measurement({
		map: map,
		lineSymbol:sls,
		pointSymbol:pms,
		defaultAreaUnit: esri.Units.SQUARE_KILOMETERS,
		defaultLengthUnit: esri.Units.KILOMETERS
	},dojo.byId('MeasuringWidget'));
	measurement.startup();
	dojo.connect(measurement, "onMeasureEnd", function(activeTool,geometry){
		this.setTool(activeTool, false);
	});
	dojo.connect(tb,"onDrawEnd",addGraphic);
	dojo.connect(map,"onClick",function(evt) {
		etb.deactivate();
	});
	dojo.connect(dojo.byId("clearMeasurements"), "onclick", function(evt){
		measurement.clearResult();
	});
	dojo.connect(dojo.byId("closeMeasurements"), "onclick", function(evt){
		toggleMeasure();
	});


	createGraphicsMenu();
}


// creates the info window when clicking on a feature. Used in init()
function ShowInfoWindow(feature) {
	// initialize variables based on passed feature
	var attributes = feature.attributes;
    var fLayer = feature._graphicsLayer;
    
    // get settings 
	var fields = settings.InfoWindowFieldsCollection;

    var spanTitle = document.createElement("span");
    infoWindowWidth = 350;
    infoWindowHeight = 190;

    spanTitle.className = "infoTitle";
    spanTitle.id = "spanInfoWindowTitle";

    var title = fLayer.name;
    var tri = Math.round((infoWindowWidth * 10) / 100);
    if (title.length > tri) {
        spanTitle.innerHTML = title.trimString(tri);
        spanTitle.title = title;
    }
    else {
        spanTitle.innerHTML = title;
    }

    map.infoWindow.setTitle(spanTitle);
    

    var container = document.createElement('div');
    container.id = "scrollbar_container";
    container.style.overflow = "hidden";
    container.style.height = "auto";

    var divInfoWindow = document.createElement("div");
    divInfoWindow.id = "divInfoWindow";
    divInfoWindow.style.overflow = "hidden";
    divInfoWindow.style.height = "auto";
    divInfoWindow.style.width = infoWindowWidth - 40 + 'px';

    var table = document.createElement("table");
    var tBody = document.createElement("tbody");
    table.appendChild(tBody);
    table.id = "tblParcels";
    table.cellSpacing = 0;
    table.cellPadding = 0;

    for(var i=0; i<fields.length-1; i++) {
    	if(attributes[fields[i].FieldName] != undefined) {
	    	var tr = document.createElement("tr");
	        tBody.appendChild(tr);

	        var td1 = document.createElement("td");
	        
	        td1.innerHTML = fields[i].DisplayText + ": ";
	        td1.style.paddingRight = "2em";
	        
	        td1.style.verticalAlign = "top";

	        var td2 = document.createElement("td");
	        td2.style.verticalAlign = "top";
        	var value = attributes[fields[i].FieldName];
        	// check if the value is a URL
        	if(value.toLowerCase().indexOf("http")>=0)
        		td2.innerHTML = "<a href='" + value + "' target='_blank'>Visit Website</a>";
        	else 
	        	td2.innerHTML = value;

	        tr.appendChild(td1);
	        tr.appendChild(td2);
        }
    }
    // add directions link
    if(attributes['Address'] != undefined && attributes['FormerTown'] != undefined) {
	    var tr = document.createElement("tr");
	    tBody.appendChild(tr);
	    var td1 = document.createElement("td");
	    td1.innerHTML = "Directions: ";
	    td1.style.paddingRight = "2em";
	    td1.style.verticalAlign = "top";
	    var td2 = document.createElement("td");
	    td2.style.verticalAlign = "top";
	    var address = attributes['Address'] + "," + attributes['FormerTown'] + ",ON";
	    var nspAddress = address.replace(/ /g,"+");
		td2.innerHTML = "<a href='https://maps.google.com/maps?daddr=" + nspAddress+ "'>Google Maps</a>";
	    tr.appendChild(td1);
	    tr.appendChild(td2);
    }

    divInfoWindow.appendChild(table);
    container.appendChild(divInfoWindow);
    map.infoWindow.setContent(container);
    map.infoWindow.resize(infoWindowWidth, infoWindowHeight);
    var windowPoint = map.toScreen(feature.geometry);
    map.infoWindow.show(feature.geometry, GetInfoWindowAnchor(windowPoint, infoWindowWidth));
}

// show/hide the measurement details
function toggleMeasure() {
	if($('#measuringSection').is(":visible")) {
		$('#measuringSection').slideUp('slow');
	}
	else {
		$('#measuringSection').slideDown('slow');
	}
}

// position the infowindow - used by ShowInfoWindow()
function GetInfoWindowAnchor(pt, infoWindowWidth) {
    var verticalAlign;
    if (pt.y + 190 < map.height / 2) {
        verticalAlign = "LOWER";
    }
    else {
        verticalAlign = "UPPER";
    }
    if ((pt.x + infoWindowWidth) > map.width) {
        return esri.dijit.InfoWindow["ANCHOR_" + verticalAlign + "LEFT"];
    }
    else {
        return esri.dijit.InfoWindow["ANCHOR_" + verticalAlign + "RIGHT"];
    }
}

// performs the search - used in init()
function doSearch(layerIds,searchFields) {
	$('#SearchResultsGroup').slideDown();
	dojo.byId("searchResults").innerHTML = "<img src='img/ajax-loader.gif' alt='Loading...'>";
	findParams = new esri.tasks.FindParameters();
  	findParams.returnGeometry = true; 
  	findParams.layerIds = layerIds;
	findParams.searchFields = searchFields;
	var searchText = dojo.byId('searchText').value;
	searchText = searchText.replace("'","''");
	searchText = searchText.replace('.','');
	console.log(searchText);
	findParams.searchText = searchText;
	findTask.execute(findParams, showResults);
}

// adds entries to the Browse Features menu
function buildList(featureLayer) {
	console.log(featureLayer);
	var nspName = featureLayer.name.replace(/ /g,"_");
	var query = new esri.tasks.Query();
	query.where = "1=1";
	var accordianContainer = dojo.byId("LayerList");
	
	var acGroup = document.createElement('div');
	acGroup.className= "accordian-group";
	accordianContainer.appendChild(acGroup);

	var acHead = document.createElement('div');
	acHead.className = "accordion-heading";
	acGroup.appendChild(acHead);

	var acToggle = document.createElement('a');
	acToggle.className = "accordion-toggle";
	acToggle.setAttribute('data-toggle','collapse');
	acToggle.setAttribute('data-parent',"#" + nspName);
	acToggle.setAttribute('href','#' + nspName);
	acToggle.innerHTML = "<h3>" + featureLayer.name + "</h3>";
	acHead.appendChild(acToggle);
	
	var acBody = document.createElement('div');
	acBody.id = nspName;
	acBody.className = "accordion-body collapse";
	acGroup.appendChild(acBody);

	var acInner = document.createElement('div');
	acInner.className = "accordion-inner";
	acBody.appendChild(acInner);

	var acList = document.createElement('ul');

	acInner.appendChild(acList);
	featureLayer.queryFeatures(query, function(featureSet) {
		var features = featureSet.features;
		features.sort(sortFeatures);
		for(var j=0; j<features.length;j++) {
			var displayName = featureSet.displayFieldName;
			var feature = featureSet.features[j].attributes;
			var x = featureSet.features[j].geometry.x;
			var y = featureSet.features[j].geometry.y;
			var wkid = featureSet.features[j].geometry.spatialReference.wkid;
			var acListItem = document.createElement('li');
			acList.appendChild(acListItem);

			var acLink = document.createElement('a');
			acLink.setAttribute('onClick','zoomTo('+x+','+y+','+wkid+');');
			acLink.innerHTML = feature[displayName];
			acListItem.appendChild(acLink);
		}
	});
}

// sorting function, used by buildList to display features in alphabetical order
function sortFeatures(feat1,feat2) {
	var a = feat1.attributes["Name"].toUpperCase();
	var b = feat2.attributes["Name"].toUpperCase();
	return (a > b) ? 1 : (a < b) ? -1 :0;
}

// zooms to a point - used by the Browse Features List
function zoomTo(x,y,wkid,zoomlevel) {
	var pt = new esri.geometry.Point(Number(x),Number(y),new esri.SpatialReference({ wkid: wkid }));
	zoomlevel = typeof zoomlevel !== 'undefined' ? zoomlevel : 12;
	map.centerAndZoom(pt, zoomlevel);
}

// zooms to a polygon (it's extent coordinates) - used by the Search Results when searching for a town.
function zoomToExtent(xmin,ymin,xmax,ymax) {
	var newExtent = new esri.geometry.Extent(parseFloat(xmin), parseFloat(ymin), parseFloat(xmax), parseFloat(ymax), new esri.SpatialReference({wkid:26917}));
	map.setExtent(newExtent);
}

function orientationChanged() {
	if(map){
	  map.reposition();
	  map.resize();
	}
}

// functions to show/hide map layers
function showAerialMap() {
	aerialmap.show();
	streetmap.hide();
	communitymap.hide();
}
function showStreetMap() {
	streetmap.show();
	aerialmap.hide();
	communitymap.hide();
}
function showCommunityMap() {
	communitymap.show();
	streetmap.hide();
	aerialmap.hide();
}

// opens a dialog box to show some text - used by help dropdown
function showDialog(text) {
	var message;
	if (text === "about") {
		message = "<strong>About this map</strong><hr>This application was developed to allow the public to easily identify community features, locate them and access information and links for these features. The application also includes a search tool which can be used to find civic addresses, streets and towns within Norfolk County. The application was developed by Norfolk GIS and Information System Services. For additional questions please contact <a href='mailto:norfolkgis@norfolkcounty.ca'>NorfolkGIS@norfolkcounty.ca</a>.";
	}
	dojo.byId('divLoadMessage').innerHTML = message;
}

// sets up the graphics for drawing
function addGraphic(geometry) {
	tb.deactivate();
	var type = geometry.type;
	if (type === "point" || type === "multipoint") {
		symbol = new esri.symbol.PictureMarkerSymbol('img/flag.png', 24, 24);
	}
	else if (type === "line" || type === "polyline") {
		symbol = tb.lineSymbol;
	}
	else {
		symbol = tb.fillSymbol;
	}
	drawLayer.add(new esri.Graphic(geometry,symbol));
}

// clears all drawing graphics
function clearGraphics() {
	drawLayer.clear();
}

// initializes the right click menu for drawn shapes
function createGraphicsMenu() {
	graphicMenu = new dijit.Menu({});
	graphicMenu.addChild(new dijit.MenuItem({
		label: "Move",
		onClick: function() {
			etb.activate(esri.toolbars.Edit.MOVE,selected);
		}
	}));
	graphicMenu.addChild(new dijit.MenuItem({
		label: "Delete",
		onClick: function() {
			drawLayer.remove(selected);
		}
	}));
	graphicMenu.startup();
	dojo.connect(drawLayer,"onMouseOver",function(evt) {
		selected = evt.graphic;
		graphicMenu.bindDomNode(evt.graphic.getDojoShape().getNode());
	});
	dojo.connect(drawLayer,"onMouseOut",function(evt) {
		graphicMenu.unBindDomNode(evt.graphic.getDojoShape().getNode());
	});
}

// prints the results of the search function
function showResults(results) {
	var searchResultSection = dojo.byId("searchResults");
	// clear existing results
	searchResultSection.innerHTML = "";

	if(results.length>0) {
		var resultsList = document.createElement('ul');
		resultsList.setAttribute("id","searchResultsList");

		searchResultSection.appendChild(resultsList);

		dojo.forEach(results, function(result){
			var x,y;
			var wkid = result.feature.geometry.spatialReference["wkid"];
			var layerId = result.layerId;
			var ListItem = document.createElement('li');
			resultsList.appendChild(ListItem);
			var ListLink = document.createElement('a');

			// depending on the type of feature returned, get create the appropriate link to correctly zoom in to
			if (result.geometryType == "esriGeometryPolygon") {
				var e = result.feature.geometry.getExtent();
				ListLink.setAttribute('onClick','zoomToExtent('+e.xmin+','+e.ymin+','+e.xmax+','+e.ymax+')');
			}
			if(result.geometryType == "esriGeometryPoint") {
				x = result.feature.geometry['x'];
				y = result.feature.geometry['y'];
				ListLink.setAttribute('onClick','zoomTo('+x+','+y+','+wkid+')');
			}
			else if (result.geometryType == "esriGeometryPolyline") { // roads
				x = (result.feature.geometry.paths[0][0][0] + result.feature.geometry.paths[0][1][0])/2;
				y = (result.feature.geometry.paths[0][0][1] + result.feature.geometry.paths[0][1][1])/2;
				ListLink.setAttribute('onClick','zoomTo('+x+','+y+','+wkid+',8)');
			}

			thisResult = result.feature.attributes;

			// if the person searched for an alternate name of the feature, display the proper name with the nickname in brackets
			if(result.displayFieldName == result.foundFieldName) {
				ListLink.innerHTML = toTitleCase(thisResult[result.displayFieldName]);
			}
			else {
				ListLink.innerHTML = toTitleCase(thisResult[result.displayFieldName]) + " (" + toTitleCase(result.value) + ")";	
			}
			ListItem.appendChild(ListLink);
		});
	}
	else {
		var noResults = document.createElement('span');
		noResults.innerHTML = "No results found.";
		searchResultSection.appendChild(noResults);
	}
}

// converts a string to title class - used by ShowResults
function toTitleCase(string)
{
     var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|vs?\.?|via)$/i;
     string = string.toLowerCase();
  	return string.replace(/([^\W_]+[^\s-]*) */g, function (match, p1, index, title) {
    	if (index > 0 && index + p1.length !== title.length &&
      	p1.search(smallWords) > -1 && title.charAt(index - 2) !== ":" && 
      	title.charAt(index - 1).search(/[^\s-]/) < 0) {
      	return match.toLowerCase();
    	}

	    if (p1.substr(1).search(/[A-Z]|\../) > -1) {
    	  return match;
    	}

    return match.charAt(0).toUpperCase() + match.substr(1);
  });
}

// use browser geolocation to find the user's current position
function findMyLocation(evt) {
 	if(navigator.geolocation){  
	  navigator.geolocation.getCurrentPosition(zoomToLocation, locationError);
	}
	else{
	  alert("Sorry, your browser doesn't support geolocation! Visit http://browsehappy.com and download a new browser!");
	}
}

// zoom to user's location (used by findMyLocation)
function zoomToLocation(location) {
    var pt = esri.geometry.Point(location.coords.longitude, location.coords.latitude, new esri.SpatialReference({wkid: 4326}));
    var outSR = new esri.SpatialReference({wkid: 26917});
    gsvc.project([pt], outSR, function(projectedPoints) {
    	pt = projectedPoints[0];
    	// checks to see if the user is in/close to Norfolk County
    	var mapExtent = [522019.805583432,4714009.78042006,568020.314390301,4761258.03625909];
    	if(pt.x > mapExtent[0] && pt.x < mapExtent[2] && pt.y > mapExtent[1] && pt.y < mapExtent[3])
			map.centerAndZoom(pt, map._slider.maximum - 2);
		else {
			alert("Sorry, it seems that you're outside of Norfolk County!");
		}
    });
}
// error handling for findMyLocation
function locationError(error) {
//error occurred so stop watchPosition
	if(navigator.geolocation){
	  navigator.geolocation.clearWatch(watchId);
	}
	switch (error.code) {
	case error.PERMISSION_DENIED:
	  alert("Location not provided");
	  break;

	case error.POSITION_UNAVAILABLE:
	  alert("Current location not available");
	  break;

	case error.TIMEOUT:
	  alert("Timeout");
	  break;

	default:
	  alert("unknown error");
	  break;
	}
}

// gets the query string for use in social sharing
function GetQuerystring(key) {
    var _default;
    if (_default == null) _default = "";
    key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
    var qs = regex.exec(window.location.href);
    if (qs == null)
        return _default;
    else
        return qs[1];
}

//Function to open login page for facebook,tweet,email
function ShareLink(site) {
    mapExtent = GetMapExtent();
    var tinyURLServiceURL = new Object();
	tinyURLServiceURL.URL = "http://api.bit.ly/v3/shorten?login=norfolkwebdev&apiKey=R_23ec8471c1fd25e5df454f8c6b2db94c&uri=${0}&format=json";
	tinyURLServiceURL.ResponseAttribute = "data.url";
	tinyURLServiceURL.TwitterShareURL = "http://twitter.com/home/?status=Find%20Services%20in%20My%20Community' ${0}";
	tinyURLServiceURL.FacebookShareURL = "http://www.facebook.com/sharer.php?u=${0}&t=Find%20Services%20in%20My%Community";
	tinyURLServiceURL.MailShare = "mailto:%20?subject=Checkout%20this%20government%20service%20map!&body=${0}";
	
    var url = esri.urlToObject(window.location.toString());
    if (mapPoint) {
        var urlStr = encodeURI(url.path) + "?extent=" + mapExtent + "?s=" + mapPoint.x + "," + mapPoint.y;
    }
    else {
        var urlStr = encodeURI(url.path) + "?extent=" + mapExtent;
    }

    url = dojo.string.substitute(tinyURLServiceURL.URL, [urlStr]);
    dojo.io.script.get({
        url: url,
        callbackParamName: "callback",
        load: function (data) {
            tinyResponse = data;
            var tinyUrl = data;
            var attr = tinyURLServiceURL.ResponseAttribute.split(".");
            for (var x = 0; x < attr.length; x++) {
                tinyUrl = tinyUrl[attr[x]];
            }
            switch (site) {
                case "facebook":
                    window.open(dojo.string.substitute(tinyURLServiceURL.FacebookShareURL, [tinyUrl]));
                    break;
                case "twitter":
                    window.open(dojo.string.substitute(tinyURLServiceURL.TwitterShareURL, [tinyUrl]));
                    break;
                case "mail":
                    parent.location = dojo.string.substitute(tinyURLServiceURL.MailShare, [tinyUrl]);
                    break;
            }
        },
        error: function (error) {
            console.log(tinyResponse.error);
        }
    });
    setTimeout(function () {
        if (!tinyResponse) {
            console.log("TinyURL API engine is not working, Please try again after some time.");
            return;
        }
    }, 5000);
}      

// gets the current extent of the map - used by ShareLink()
function GetMapExtent() {
    var extents = map.extent.xmin.toString() + ",";
    extents += map.extent.ymin.toString() + ",";
    extents += map.extent.xmax.toString() + ",";
    extents += map.extent.ymax.toString();
    return (extents);
}

dojo.addOnLoad(init);