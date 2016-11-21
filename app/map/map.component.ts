import { Component, OnInit, Input, Output, EventEmitter, ViewChild, Renderer, ElementRef} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Coords} from '../models/location';
import {Router} from '@angular/router';
import {MapService} from './map.service'
function localStorage_hasData() {
    try {
        if(JSON.parse(localStorage.getItem("carLocation")).name.en != "Sorry, you did not save your car location"){
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
    centerLat: number = 60.1712179;
    centerLon: number = 24.9418765;
    centerMarker: any;

    directionArray:any[] = [];

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
        if (navigator.geolocation) {
            this.initialize();
            google.maps.event.addDomListener(window, "load", ()=>{
                navigator.geolocation.getCurrentPosition(this.createMap.bind(this), this.noGeolocation)
            });
        } else {
            this.geolocationNotSupported();
        }
    }

    noGeolocation() {
        document.getElementById("mapCanvas").innerHTML = '<div class="alert alert-danger" role="alert"> <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span><span class="sr-only">Error:</span> Please enable Geolocation to use our service.</div>';
    }

    geolocationNotSupported() {
        document.getElementById("mapCanvas").innerHTML = '<div class="alert alert-danger" role="alert"> <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span><span class="sr-only">Error:</span> This browser does not support Geolocation.</div>';
    }

    initialize():void {
        var mapProp = {
            center: new google.maps.LatLng(this.centerLat, this.centerLon),
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.map = new google.maps.Map(document.getElementById("mapCanvas"), mapProp);
        this.input = /** @type {!HTMLInputElement} */(document.getElementById('search_input'));
        this.autocomplete = new google.maps.places.Autocomplete(this.input);
        this.autocomplete.bindTo('bounds', this.map);
        var container_input = /** @type {!HTMLInputElement} */(document.getElementById('input-group'));
        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(container_input);
    }


    createMap(position: any): void{
        this.centerLat = position.coords.latitude;
        this.centerLon = position.coords.longitude;
        var center = new google.maps.LatLng(this.centerLat, this.centerLon);
        this.map.panTo(center);
        var _map = this.map; // need this line to make sure that the map is loaded.
        this.centerMarker = this.service.placeMarker(this.map, this.centerLat, this.centerLon,"default");
        
        document.getElementById("gettingLocation").style.opacity = '0';
        
        setTimeout(()=>{
            document.getElementById("gettingLocation").style.display = 'none';
        },250)
        /*
        *Search bar
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
            _map.setCenter(place.geometry.location);

            marker.setIcon(/** @type {google.maps.Icon} */({
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(35, 35)
            }));
            marker.setPosition(place.geometry.location);
            marker.setVisible(true);
            this.clearDirection();
            var address = '';
            if (place.address_components) {
                address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
                ].join(' ');
            }
            var content = '<div class="searchInfo"><div class="title"><h3>'+ place.name + '</h3><img id="markerSearch" src="img/directionIcon.png" alt="direction icon" class="functionIcon"><br><span>'+address+ '</span></div>' ;
            this.infowindowDestination.setContent(content);
            this.infowindowDestination.open(_map, marker);
            google.maps.event.addDomListener(document.getElementById('close_search'),'click',()=>{
                (<HTMLInputElement>document.getElementById('search_input')).value = '';
                this.infowindowDestination.close();
                marker.setVisible(false);
                this.clearDirection();
            });
            google.maps.event.addListener(marker, 'click', ()=>{
                this.infowindowDestination.open(_map, marker);
            });

            google.maps.event.addDomListener(document.getElementById('markerSearch'),'click',()=>{
                if(this.router.url == "/parkandride"){
                    this.showDirection(marker);
                } else {
                    this.showDirection(marker,false);
                }
            });
        });
        /*
        *End of Search bar
        */

        //Signal that map has done loading
        this.doneLoading.emit(true);
    }

    clickMainMarker(){
        google.maps.event.trigger(this.centerMarker, 'click');
    }

    center(lat:number = this.centerLat,long:number = this.centerLon,  _func?:()=>void){
        this.map.panTo(new google.maps.LatLng(lat,long));
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


    editLocalStorage(data:any){
        if(localStorage_hasData()){
            var object = JSON.parse(localStorage.getItem('carLocation'));
            if(data.location.coordinates[0][0][1] != object.location.coordinates[0][0][1] || data.location.coordinates[0][0][0] != object.location.coordinates[0][0][0]){
                localStorage.setItem('date',Date());
                localStorage.setItem('carLocation',JSON.stringify(data));
                this.saveUpdated.emit(data);
            }
        }else {
            localStorage.setItem('date',Date());
            localStorage.setItem('carLocation',JSON.stringify(data));
            this.saveUpdated.emit(data);
        }
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

    getNameFromGeocoder(_marker:any):string{
        var geocoder  = new google.maps.Geocoder();
        var sResult = " ";
        geocoder.geocode({
            'latLng': _marker.getPosition()
        }, (result:any, status:any) =>{
            if (status == google.maps.GeocoderStatus.OK) {
                return sResult =  result[0].formatted_address;
            } else {
                console.log('Geocoder failed due to: ' + status);
                return sResult =  "Location not found";
            }
        });
        return sResult;
    }


    private showDirection(marker: any = null, multiDirection:boolean = true){
        var current = new google.maps.LatLng(this.centerLat,this.centerLon);
        var destination = marker.getPosition();
        this.clearDirection();
        this.service.directionsService(this.map, current, destination, this.directionArray,'BICYCLING',google.maps.DirectionsTravelMode.BICYCLING);
    }
}