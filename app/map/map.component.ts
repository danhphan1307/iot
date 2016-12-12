import { Component, OnInit, Input, Output, EventEmitter, ViewChild, Renderer, ElementRef} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Coords} from '../models/location';
import {Router} from '@angular/router';
import {MapService} from './map.service'
function localStorage_hasData() {
    try {
        if(JSON.parse(localStorage.getItem("userLocation")).name.en != "No data"){
            return true;
        }else {
            return false;
        }
    }
    catch (e) {
        return false;
    }
};

declare var google: any;

@Component({
    selector: 'map-gg',
    template: `
    <div id="mapCanvas" ></div>

    `,
    providers: [MapService]
})

export class MapComponent{
    //Service

    service: MapService;
    router:Router;
    input:any;
    autocomplete:any;

    map:any;
    centerLat: number = -1;
    centerLon: number = -1;
    centerMarker: any;

    directionArray:any[] = [];
    _destination:any;
    _desMarker:any;

    infowindowMainMarker = new google.maps.InfoWindow();
    infowindowFacility = new google.maps.InfoWindow();
    infowindowBike = new google.maps.InfoWindow();
    infowindowDestination = new google.maps.InfoWindow();
    infowindowParkPlace = new google.maps.InfoWindow();
    infowindowPolygon = new google.maps.InfoWindow();

    @Input()
    circleRadius: number;

    @Input()
    markers: any[] = [];

    @Output()
    doneLoading: any = new EventEmitter<boolean>();

    @Output()
    saveUpdated: any= new EventEmitter();

    //Polygons for HRI data

    constructor(private _router: Router, private _mapService: MapService ) {
        this.router = _router;
        this.service = _mapService;
    }

    ngOnInit(){
        this.initialize();
        this.bindingMap();
    }

    initialize():void {
        var mapProp = {
            center: new google.maps.LatLng(60.1703827, 24.9384473),
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
            zoomControl: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.LEFT_BOTTOM
            },
        };
        this.map = new google.maps.Map(document.getElementById("mapCanvas"), mapProp);
        this.input = /** @type {!HTMLInputElement} */(document.getElementById('search_input'));
        this.autocomplete = new google.maps.places.Autocomplete(this.input);
        this.autocomplete.bindTo('bounds', this.map);
        var cog_icon = /** @type {!HTMLInputElement} */(document.getElementById('cog_icon'));
        this.map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(cog_icon);
        var container_input = /** @type {!HTMLInputElement} */(document.getElementById('input-group'));
        this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(container_input);
        var info_panel = /** @type {!HTMLInputElement} */(document.getElementById('info_panel'));
        this.map.controls[google.maps.ControlPosition.RIGHT_TOP].push(info_panel);
        var filter_panel = /** @type {!HTMLInputElement} */(document.getElementById('filter'));
        this.map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(filter_panel);
        //Signal that map has done loading

    }
    placeCenterMarker(_lat:number, _lng:number, _heading:number){
        if(this.centerLat!=_lat || this.centerLon !=_lng){
            this.clearCenterMarker();
            this.centerLat = _lat;
            this.centerLon = _lng;
            if(this.centerLon!=-1 && this.centerLon!=-1){
                this.map.panTo(new google.maps.LatLng(this.centerLat, this.centerLon));
                /*
                * Get from localStorage
                */
                if(localStorage.getItem('destination')!==null && localStorage.getItem('sensor')!==null && localStorage.getItem('location')!==null){
                    this.clearDirection();
                    this._destination = JSON.parse(localStorage.getItem('destination'));
                    this._desMarker = new google.maps.Marker({
                        map:this.map,
                        anchorPoint: new google.maps.Point(0, -29)
                    });
                    this._desMarker.setIcon(this._destination.icon);
                    this._desMarker.setPosition(this._destination.position);
                    this.showDirection(this._desMarker);
                }
                /*
                * End of getting from localStorage
                */
            }
            this.centerMarker = this.service.placeMarker(this.map, _lat, _lng,"default", _heading);
        }
    }

    clearCenterMarker(){
        if(this.centerMarker !== undefined){
            this.centerMarker.setMap(null);
            this.centerMarker = [];
            this.clearDirection();
            this.centerLat = -1;
            this.centerLon = -1;
        }
    }

    bindingMap(): void{
        var _map = this.map; // need this line to make sure that the map is loaded.
        /*
        * Search bar
        */
        var marker = new google.maps.Marker({
            map: this.map,
            anchorPoint: new google.maps.Point(0, -29)
        });
        this.autocomplete.addListener('place_changed',()=> {
            this.infowindowDestination.close();
            marker.setVisible(false);
            var place = this.autocomplete.getPlace();
            if (!place.geometry) {
                // User entered the name of a Place that was not suggested and pressed the Enter key, or the Place Details request failed.
                window.alert("No details available for input: '" + place.name + "'");
                return;
            }
            // If the place has a geometry, then present it on a map.
            this.clearLocalStorage();
            _map.setCenter(place.geometry.location);

            marker.setIcon(/** @type {google.maps.Icon} */({
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(35, 35)
            }));
            marker.setPosition(place.geometry.location);
            var testObject = { 'icon': marker.icon, 'position': marker.getPosition()};
            localStorage.setItem('destination',JSON.stringify(testObject));
            marker.setVisible(true);
            this.clearDirection();
            if(localStorage.getItem('sensor')!==null && localStorage.getItem('location')!==null){
                this.showDirection(marker);
            }
        });
        google.maps.event.addDomListener(document.getElementById('close_search'),'click',()=>{
            (<HTMLInputElement>document.getElementById('search_input')).value = '';
            this.infowindowDestination.close();
            marker.setVisible(false);
            this.clearDirection();
            this.clearLocalStorage();
        });
        /*
        *End of Search bar
        */
        setTimeout(()=>{
            this.doneLoading.emit(true);
        },500);

    }

    directionDestination(){
        if(localStorage.getItem('destination')!==null && localStorage.getItem('location')!==null && localStorage.getItem('sensor')!==null){
            this.showDirection(this._desMarker);
        }
    }

    clickMainMarker(){
        google.maps.event.trigger(this.centerMarker, 'click');
    }

    center(_func?:()=>void){
        if(this.centerLon!=-1 && this.centerLon!=-1){
            this.map.panTo(new google.maps.LatLng(this.centerLat,this.centerLon));
        } else{
            this.map.panTo(new google.maps.LatLng(60.1703827,24.9384473));
        }
        if(_func){
            _func();
        }
    }
    clearMarkers(){
        this.markers.forEach((item, index) => {
            item.setMap(null);
        });
        this.markers=[];
    }
    clearDirection(){
        this.directionArray.forEach((item, index) => {
            item.setMap(null);
        });
    }

    placeMarkerBicycle(stations:any):void{
        var map = this.map;
        for (var i = 0; i < stations.length; i++) {
            var markerBike = this.service.placeMarker(this.map, stations[i].y, stations[i].x, "bike");
            this.markers.push(markerBike);
            var func = ((markerBike, i) => {
                google.maps.event.addListener(markerBike, 'click', () => {
                    var content = '<div class="cityBike"><div class="title"><h3>Citybike Station</h3><img id="markerBike" src="img/directionIcon.png" alt="love icon" class="functionIcon"><br><span>'+stations[i].name+ '</span><h4 class="info"> Bike Available: '+stations[i].bikesAvailable + '/' +(stations[i].bikesAvailable+stations[i].spacesAvailable)+ '</h4></div>' ;
                    for (var counter = 0; counter < (stations[i].bikesAvailable); counter++) {
                        content+='<div class="freeBike">&nbsp;</div>';
                    }
                    for (var counter = 0; counter < (stations[i].spacesAvailable); counter++) {
                        content+='<div class="freeSpot">&nbsp;</div>';
                    }
                    content+='<hr class="separate"><button class="register"><a href="https://www.hsl.fi/citybike">Register to use</a></button><br><br><a href="https://www.hsl.fi/kaupunkipyorat" class="moreInfo"><span class="glyphicon glyphicon-info-sign"></span> More information</a></div>';
                    this.infowindowBike.setContent(content);
                    this.infowindowBike.open(this.map, markerBike);
                    var el = document.getElementById('markerBike');
                    google.maps.event.addDomListener(el,'click',()=>{
                        this.showDirection(markerBike,false);
                    });

                });
            })(markerBike, i);
        }
    }

    stringHandler(input_string:string) {
        return (input_string.charAt(0).toUpperCase() + input_string.slice(1)).replace(/_/g," ");
    }

    getNameFromGeocoder(_name:string){
        var geocoder  = new google.maps.Geocoder();
        var JSONobject= JSON.parse(localStorage.getItem("location"));
        var latlng = {lat: parseFloat(JSONobject.data[Object.keys(JSONobject).length-1].x), lng: JSONobject.data[Object.keys(JSONobject).length-1].y};
        geocoder.geocode({
            'location': latlng
        }, (result:any, status:any) =>{
            if (status === 'OK') {
                localStorage.setItem('locationName',result[0].formatted_address);
            } else {
                console.log('Geocoder failed due to: ' + status);
                _name = "Location not found";
            }
        });
    }


    clearLocalStorage(){
        localStorage.setItem('estimateDistance','0');
        localStorage.setItem('estimateTime','0');
        localStorage.removeItem('destination');
        localStorage.removeItem("timeStart") ;
        try {
            this._desMarker.setMap(null);
        }
        catch (e) {
            return false;
        }
    }

    private showDirection(marker: any = null, multiDirection:boolean = true){
        var current = new google.maps.LatLng(this.centerLat,this.centerLon);
        var destination = marker.getPosition();
        this.clearDirection();
        this.service.directionsService(this.map, current, destination, this.directionArray,'BICYCLING',google.maps.DirectionsTravelMode.BICYCLING);
        
    }
}