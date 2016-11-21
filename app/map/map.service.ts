
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

    placeMarker( _map: any, _lat: number, _lon: number, _type:string): any{
        var _icon:any = null;
        var _zIndex:any = 0;
        var type=this.getZoomLevel(_map);
        var _visible = true;

        if(_type=="bikestation"){
            _icon = this.iconsBikeStation[type].icon;
        }else if(_type=="carstation"){
            _icon = this.icons[type].icon;
        }else if(_type=="bike"){
            _icon = this.iconsBike[type].icon;
        }else if(_type=="park"){
            _zIndex = 2;
            _icon = this.iconsParkHere['large'].icon;
        }else if(_type=="default"){
            _icon = "img/default.png"
        }else if(_type=="hiden"){
            _visible = false;
        }else if(_type=="entrance"){
            _icon = this.iconEntrance['large'].icon;
        }

        var temp_marker = new google.maps.Marker({
            position: new google.maps.LatLng(_lat, _lon),
            map: _map,
            icon: _icon,
            zIndex: _zIndex,
            visible:_visible
        });

        google.maps.event.addDomListener(_map,'zoom_changed',()=>{
            type=this.getZoomLevel(_map);
            if(_type=="bikestation"){
                temp_marker.setIcon(this.iconsBikeStation[type].icon);
            }else if(_type=="carstation"){
                temp_marker.setIcon(this.icons[type].icon);
            }else if(_type=="bike"){
                temp_marker.setIcon(this.iconsBike[type].icon);
            }else if(_type=="park"){
                //temp_marker.setIcon(this.iconsParkHere[type].icon);
            }else if(_type=="fefault"){
                //temp_marker.setIcon(null);
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
            travelMode: _mode,
        },(result:any, status:any) => {
            this.renderDirections(_map, result, status, array,_vehicle)
        });
    }

    renderDirections(_map:any, result:any,status:any,array:any, vehicle:string):any{
        if ( status == google.maps.DirectionsStatus.OK ) {
            var directionsRenderer = new google.maps.DirectionsRenderer({
                map:_map,
                draggable:true,
                preserveViewport: true,
                polylineOptions: {
                    strokeColor: '#FFA500'
                }
            });
            directionsRenderer.setDirections(result);
            array.push(directionsRenderer);
            return directionsRenderer;
        }
    }
}