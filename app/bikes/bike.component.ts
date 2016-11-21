import { Component, OnInit, OnChanges, ViewChild , Output, EventEmitter} from '@angular/core';

import { BikeService } from './bike.service';
import {BikeStation} from './bike';
import {MapService} from '../map/map.service'
import {AgmCoreModule} from 'angular2-google-maps/core';
import {MapComponent} from '../map/map.component';

@Component({
  selector: 'my-bike',
  template:``,
  providers: [BikeService, MapService]
})

export class BikeComponent implements OnInit {
  stations : BikeStation[];

  data : string;
  title = 'Bike Station';


  constructor(private bikeService: BikeService,
    private mapService: MapService){

  }

  ngOnInit(){

  }

  ngOnChanges(){
    console.log("change in bike");
  }


  public loadBikeStations(mapComponent: MapComponent): void{

    this.bikeService.getBikeStations()
    .subscribe((stations:BikeStation[]) => {
      this.stations = stations;
      mapComponent.placeMarkerBicycle(stations);
    })
  }

}