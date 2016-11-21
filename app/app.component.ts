import { Component, OnInit,  Input, Output, trigger, state, style, transition, animate, ViewChild, ElementRef, Renderer, ViewContainerRef, EventEmitter} from '@angular/core';
import {BikeService } from './bikes/bike.service';
import {BikeStation} from './bikes/bike';
import {MapComponent} from './map/map.component';
import {TopNavigation} from './component/top.navigation.component';
import {BlackOverlay} from './component/blackoverlay.component';
import {SearchBar} from './component/search.bar.component';
import {UserComponent} from './component/user.panel.component';
import {BikeComponent} from './bikes/bike.component';
import {AgmCoreModule} from 'angular2-google-maps/core';
import {AlertComponent } from 'ng2-bootstrap/ng2-bootstrap';
import {NgModel} from '@angular/forms';
import {Coords} from './models/location';

import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

declare var google: any;
declare var Slider: any;

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  providers: []
})

export class AppComponent implements OnInit {
  private viewContainerRef: ViewContainerRef;
  public onlineOffline: boolean = navigator.onLine;
  router:Router;
  bMapDone:boolean = false;

  @ViewChild(MapComponent)
  private MapComponent:MapComponent;

  @ViewChild(TopNavigation)
  private topNav:TopNavigation;

  @ViewChild(BlackOverlay)
  private blackOverlay: BlackOverlay;

  @ViewChild(BikeComponent)
  private BikeComponent: BikeComponent;

  @ViewChild(UserComponent)
  private UserComponent: UserComponent;

  @ViewChild(SearchBar)
  private SearchBar: SearchBar;

  stations : BikeStation[];
  data : string
  // google maps zoom level
  zoom: number = 14;

  // initial center position for the map
  lat: number = 60.1712179;
  long: number = 24.9418765;

  ngOnInit(){
    this.blackOverlay.setState('full');
  }

  constructor(private _router: Router, viewContainerRef:ViewContainerRef ) {
    this.router = _router;
    this.viewContainerRef = viewContainerRef;
    window.addEventListener('online', () => {this.onlineOffline = true});
    window.addEventListener('offline', () => {this.onlineOffline = false});
  }

  public closeAll():void{
    this.blackOverlay.setState('close');
    this.UserComponent.setState('close');
  }

  public loadData(event:boolean){    //call only if map is completely loaded. receive boolean true
    if (event==true){
      this.bMapDone = true;
      this.topNavOpen();
    }
  }
  options = ['bike','station', 'user'];
  setButtonOnOff(_element:any, _status:string){
    for (var i = 0; i< _element.length; i++){
      (<HTMLInputElement>document.getElementById(_element[i])).style.pointerEvents = _status;
    }
  }

  public topNavOpen(){
    if(this.bMapDone){
      if(this.router.url == '/user' ){
        this.blackOverlay.setState('open');
        this.UserComponent.setState('open');
      }else {
        this.setButtonOnOff(this.options,'none');
        this.reset();
        if(this.router.url == "/bike"){
          this.MapComponent.clickMainMarker();
          this.MapComponent.center(this.MapComponent.centerLat, this.MapComponent.centerLon, ():void =>{
            this.setButtonOnOff(this.options,'auto');
          });
        }
        else if(this.router.url == "/station"){
          this.displayBikes();
          this.MapComponent.center(this.lat,this.long,():void =>{
            this.setButtonOnOff(this.options,'auto');
          });
        }
      }
    }
  }


  /* Methods for displaying markers*/
  displayBikes(){
    this.BikeComponent.loadBikeStations(this.MapComponent);
  }

  reset(){
    this.blackOverlay.setState('close');
    this.UserComponent.setState('close');
    this.MapComponent.clearMarkers();
    this.MapComponent.clearDirection();
  }

}