import { Component, OnInit,  Input, Output, trigger, state, style, transition, animate, ViewChild, ElementRef, Renderer, ViewContainerRef, EventEmitter} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {BikeService } from './bikes/bike.service';
import {BikeStation} from './bikes/bike';
import {MapComponent} from './map/map.component';
import {TopNavigation} from './component/top.navigation.component';
import {BlackOverlay} from './component/blackoverlay.component';
import {Info} from './component/info.panel';
import {SearchBar} from './component/search.bar.component';
import {Analyze} from './component/analystics.component';
import {LoginComponent} from './component/login.component';
import {AgmCoreModule} from 'angular2-google-maps/core';
import {AlertComponent } from 'ng2-bootstrap/ng2-bootstrap';
import {NgModel} from '@angular/forms';
import {Coords} from './models/location';
import {FilterPanel} from './component/filter.panel';

import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

declare var google: any;
declare var Slider: any;

function userExist() {
  try {
    if(localStorage.getItem("userInfo") !== null){
      return true;
    }else {
      return false;
    }
  }
  catch (e) {
    return false;
  }
};

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  providers: []
})

export class AppComponent implements OnInit {
  private viewContainerRef: ViewContainerRef;
  public onlineOffline: boolean = navigator.onLine;
  bRegister:boolean = false;
  router:Router;
  bMapDone:boolean = false;

  @ViewChild(MapComponent)
  private MapComponent:MapComponent;

  @ViewChild(FilterPanel)
  private filter:FilterPanel;

  @ViewChild(TopNavigation)
  private topNav:TopNavigation;

  @ViewChild(BlackOverlay)
  private blackOverlay: BlackOverlay;

  @ViewChild(Analyze)
  private analyze: Analyze;

  @ViewChild(SearchBar)
  private SearchBar: SearchBar;

  @ViewChild(LoginComponent)
  private loginComponent: LoginComponent;

  @ViewChild(Info)
  private info: Info;



  stations : BikeStation[];
  data : string
  // google maps zoom level
  zoom: number = 14;

  // initial center position for the map
  lat: number = 60.1712179;
  long: number = 24.9418765;

  ngOnInit(){
    document.body.style.background = 'rgb(234, 237, 242)';
    this.blackOverlay.setState('full');
    this.filter.load(this.MapComponent);
    this.info.load(this.MapComponent);
    this.analyze.load(this.MapComponent);
    if(!userExist()){
      let timer = Observable.timer(2000,1000);
      timer.subscribe(()=> {
        this.register();
      });
    }else {
      this.bRegister = true;
    }
  }

  constructor(private _router: Router, viewContainerRef:ViewContainerRef ) {
    this.router = _router;
    this.viewContainerRef = viewContainerRef;
    window.addEventListener('online', () => {this.onlineOffline = true});
    window.addEventListener('offline', () => {this.onlineOffline = false});
  }

  public closeAll():void{
    this.blackOverlay.setState('close');
    //this.UserComponent.setState('close');
  }

  public loadData(event:boolean){    //call only if map is completely loaded. receive boolean true
    if (event==true){
      this.bMapDone = true;
      this.topNavOpen();
    }
  }
  public register(){
    if(!userExist()){
      this.bRegister = false;
    }else {
      this.bRegister = true;
    }

  }

  public topNavOpen(){
    if(this.bMapDone && localStorage.getItem('userInfo')){
      if(this.router.url == '/analyze' ){
        this.blackOverlay.setState('open');
        this.analyze.setState('open');
      }else {
        this.reset();
        if(this.router.url == "/bike"){
          this.MapComponent.directionDestination();
          this.MapComponent.center();
        }
        //incase there are some more components adding later
      }
    }
  }



  openHelper(){
    this.filter.OpenPanel('Bike');
  }

  reset(){
    this.analyze.setState('close');
    this.MapComponent.clearMarkers();
    this.MapComponent.clearDirection();
  }

}