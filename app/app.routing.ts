import { ModuleWithProviders,NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent} from './app.component';
import { BikeComponent} from './bikes/bike.component';
import { UserComponent} from './component/user.panel.component';
import { Analyze} from './component/analystics.component';

const appRoutes: Routes = [
{     path: '',
redirectTo: '/bike',
pathMatch: 'full'},
{ path: 'bike', component: BikeComponent },
{ path: 'station', component: BikeComponent },
{ path: 'user', component: UserComponent },
{ path: 'analyze', component: Analyze }
];

@NgModule({
	imports: [RouterModule.forRoot(appRoutes)],
	exports: [RouterModule]
})

export class appRoutingProviders { }

export const routing = [AppComponent, BikeComponent, UserComponent, Analyze];