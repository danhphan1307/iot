import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BikeService } from './bikes/bike.service';
import { TopNavigation } from './component/top.navigation.component';
import { BlackOverlay } from './component/blackoverlay.component';
import { UserComponent }  from './component/user.panel.component';
import { SearchBar} from './component/search.bar.component';
import { LoginComponent} from './component/login.component';
import { AppComponent }  from './app.component';
import { BikeComponent }  from './bikes/bike.component';

import { HttpModule }    from '@angular/http';
import { AgmCoreModule } from 'angular2-google-maps/core';
import {MapComponent} from './map/map.component';
import { MapService } from './map/map.service';
import { FormsModule } from '@angular/forms';
import { Ng2BootstrapModule } from 'ng2-bootstrap/ng2-bootstrap';

import { routing, appRoutingProviders }  from './app.routing';

@NgModule({
    imports: [ BrowserModule,
    HttpModule,FormsModule,
    Ng2BootstrapModule,
    AgmCoreModule.forRoot({
        apiKey: 'AIzaSyC9xg4iGS-l2PLDIdLp1u3T9vCIMXIdVoE'
    }),
    appRoutingProviders],
    declarations: [ AppComponent,
    MapComponent,
    BikeComponent,
    UserComponent,
    BlackOverlay,routing, SearchBar,TopNavigation, LoginComponent],
    providers:[ MapService,BikeService],
    bootstrap: [AppComponent]
})
export class AppModule { }
