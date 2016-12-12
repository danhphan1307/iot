
import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import global = require('../globals');
import {Observable} from 'rxjs/Rx';
import {Coords} from '../models/location';
declare var google : any;
//Requiered method
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
@Injectable()
export class MapService{
    icons = {
        small: {
            icon:  'img/facilityCarIconSmall.png'
        },
        large: {
            icon: 'img/facilityCarIconLarge.png'
        }
    }
    vehicle = {
        DRIVING: {
            color: '#FFA500'
        },
        BICYCLING: {
            color: '#40BDB8'
        }
    }

    iconsBikeStation = {
        small: {
            icon:  'img/cityBikeIconSmall.png'
        },
        large: {
            icon: 'img/facilityBikeIconLarge.png'
        }
    }

    iconsBike = {
        small: {
            icon:  'img/cityBikeIconSmall.png'
        },
        large: {
            icon: 'img/cityBikeIconLarge.png'
        }
    }
    iconsParkHere = {
        small: {
            icon:  'img/parkHereIconSmall.png'
        },
        large: {
            icon: 'img/parkHereIconLarge.png'
        }
    }

    iconEntrance ={
        small: {
            icon:  'img/entrance.png'
        },
        large: {
            icon:  'img/entrance.png'
        },
    }

    private url = "https://fabulous-backend-hsl-parking.herokuapp.com/api/checkout";
    private removeTicket = 'https://fabulous-backend-hsl-parking.herokuapp.com/api/ticket';
    constructor(private http: Http){

    }

    showDirection(origin: Coords,marker: any, callback: (result:any, status:string) => void){
        var start = new google.maps.LatLng(origin.lat,origin.lon);
        var end = marker.getPosition();
        var request = {
            origin: start,
            destination: end,
            travelMode: 'DRIVING'
        };
        var directionsService = new google.maps.DirectionsService;
        directionsService.route(request, (result:any, status: string) => callback(result,status));
    }
    getZoomLevel(_map:any):string{
        if(_map.getZoom()<13){
            return 'small';
        }else{
            return 'large';
        }
    }

    getZoomLevelSpecial(_map:any):string{
        if(_map.getZoom()<14){
            return 'small';
        }else if(_map.getZoom()>=14 && _map.getZoom()<=16){
            return 'medium';
        }else{
             return 'large';
        }
    }

    placePolygon(_map:any, _path:any, _color:any):any{
        var polygon = new google.maps.Polygon({
            map:_map,
            paths: _path,
            strokeColor: _color,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillOpacity: 0
        });
        return polygon;
    }

    placeCircle(_map:any, _radius:number, _lat:number, _lon:number):any{
        var circle = new google.maps.Circle({
            strokeColor: '#4a6aa5',
            strokeOpacity: 0.8,
            strokeWeight: 1,
            map: _map,
            center: new google.maps.LatLng(_lat,_lon),
            radius: _radius
        });
        return circle;
    }

    placeMarker( _map: any, _lat: number, _lon: number, _type:string,_degree:number=90): any{
        var _icon:any = null;
        var _zIndex:any = 0;
        var type=this.getZoomLevel(_map);
        var _visible = true;

        if(_type=="bike"){
            _icon = this.iconsBike[type].icon;
        }else if(_type=="default"){
            _icon = {
                small: {
                    path: "m36,0.333c-19.075,0 -34.539,15.463 -34.539,34.539c0,28.963 34.539,48.795 34.539,48.795s34.54,-19.832 34.54,-48.795c0,-19.076 -15.465,-34.539 -34.54,-34.539zm0,51.529c-9.391,0 -17.004,-7.611 -17.004,-17.002c0,-9.393 7.613,-17.004 17.004,-17.004c9.391,0 17.004,7.611 17.004,17.004c0,9.391 -7.613,17.002 -17.004,17.002z",
                    fillOpacity: 1,
                    fillColor: 'rgb(245, 153, 194)',
                    strokeColor: 'rgb(245, 153, 194)',
                    scale: 0.1,
                    rotation:_degree  
                },
                medium: {
                    path: "m36,0.333c-19.075,0 -34.539,15.463 -34.539,34.539c0,28.963 34.539,48.795 34.539,48.795s34.54,-19.832 34.54,-48.795c0,-19.076 -15.465,-34.539 -34.54,-34.539zm0,51.529c-9.391,0 -17.004,-7.611 -17.004,-17.002c0,-9.393 7.613,-17.004 17.004,-17.004c9.391,0 17.004,7.611 17.004,17.004c0,9.391 -7.613,17.002 -17.004,17.002z",
                    fillOpacity: 1,
                    fillColor: 'rgb(245, 153, 194)',
                    strokeColor: 'rgb(245, 153, 194)',
                    scale: 0.3,
                    rotation:_degree 
                },
                large: {
                    path: "m36,0.333c-19.075,0 -34.539,15.463 -34.539,34.539c0,28.963 34.539,48.795 34.539,48.795s34.54,-19.832 34.54,-48.795c0,-19.076 -15.465,-34.539 -34.54,-34.539zm0,51.529c-9.391,0 -17.004,-7.611 -17.004,-17.002c0,-9.393 7.613,-17.004 17.004,-17.004c9.391,0 17.004,7.611 17.004,17.004c0,9.391 -7.613,17.002 -17.004,17.002z",
                    fillOpacity: 1,
                    fillColor: 'rgb(245, 153, 194)',
                    strokeColor: 'rgb(245, 153, 194)',
                    scale: 0.5,
                    rotation:_degree 
                }
            }
        }

        if(_type=="default"){
            var temp_marker = new google.maps.Marker({
                position: new google.maps.LatLng(_lat+0.00005, _lon),
                map: _map,
                icon: _icon[this.getZoomLevelSpecial(_map)],
                zIndex: _zIndex,
                visible:_visible
            });
        }else{
            var temp_marker = new google.maps.Marker({
                position: new google.maps.LatLng(_lat, _lon),
                map: _map,
                icon: _icon,
                zIndex: _zIndex,
                visible:_visible
            });  
        }
        

        google.maps.event.addDomListener(_map,'zoom_changed',()=>{
            type=this.getZoomLevel(_map);
            if(_type=="bike"){
                temp_marker.setIcon(this.iconsBike[type].icon);
            }else if( _type=="default"){
                temp_marker.setIcon(_icon[this.getZoomLevelSpecial(_map)]);
            }
        });
        return temp_marker;
    }
    directionsService(_map:any, _start:any, _end:any, array:any, _vehicle:string = 'public',_mode:any, _suppressMarker:boolean = false):any{
        var directionsService = new google.maps.DirectionsService;
        directionsService.route({
            origin: _start,
            destination: _end,
            optimizeWaypoints: true,
            travelMode: _mode
        },(result:any, status:any) => {
            localStorage.setItem('estimateDistance',result.routes[0].legs[0].distance.value);
            localStorage.setItem('estimateTime',result.routes[0].legs[0].duration.value);
            this.renderDirections(_map, result, status, array,_vehicle)
        });
    }

    renderDirections(_map:any, result:any,status:any,array:any, _vehicle:string):any{
        if ( status == google.maps.DirectionsStatus.OK ) {
            var directionsRenderer = new google.maps.DirectionsRenderer({
                map:_map,
                draggable:false,
                preserveViewport: true,
                suppressMarkers: true,
                suppressBicyclingLayer:true,
                polylineOptions: {
                    strokeColor: this.vehicle[_vehicle].color
                }
            });
            directionsRenderer.setDirections(result);
            array.push(directionsRenderer);
            return directionsRenderer;
        }
    }
}