
import {Component, Input, animate, style, state, transition, trigger, ViewChild, Output, EventEmitter} from '@angular/core';
import {MapComponent} from '../map/map.component';
import {BikeComponent} from '../bikes/bike.component';
import {Router} from '@angular/router';

declare var Slider: any;

@Component({
  selector: 'filter',
  providers: [],

  template:
  `
  <table [hidden]="!b_OpenHelper_Bike">
  <tr>
  <th colspan="2">Filter</th>
  </tr>
  <tr>
  <td><label>City Bikes</label></td>
  <td>
  <label class="switch">
  <input type="checkbox" id="city_bike" (change)="displayAllBike($event)"/>
  <div class="sliderIOS round"></div>
  </label>
  </td>
  </tr>
  </table>
  <my-bike ></my-bike>
  `
})

export class FilterPanel{
  map:any;
  router:Router;

  @ViewChild(BikeComponent)
  private bikeComponent: BikeComponent;

  b_OpenHelper_Bike:boolean = false;
  mySlider:any;
  bState:boolean = true;

  ngAfterViewInit() {
  }
  constructor(private _router: Router) {
    this.router = _router;
  }
  /**
   * [load get reference to private variable]
   * @param {any} _map      [description]
   * @param {any} _facility [description]
   * @param {any} _zone     [description]
   */
   load(_map:any){
     this.map = _map;
   }

  /**
   * [closeAllPanel close all panel]
   */
   closeAllPanel(){
     this.b_OpenHelper_Bike=false;
   }

   displayAllBike(e:any){
     if(e.target.checked){
       this.bikeComponent.loadBikeStations(this.map);
     }else{
       this.map.clearMarkers();
     }
   }


  /**
   * [OpenPanel open specific panel]
   * @param {string} _panel [description]
   */
   OpenPanel(_panel:string){
     switch (_panel) {
       case 'Bike':
       this.b_OpenHelper_Bike? this.b_OpenHelper_Bike = false:this.b_OpenHelper_Bike = true;
       break;
     }
   }
  /**
   * [reset remove everything]
   */
   reset(){

   }
 }