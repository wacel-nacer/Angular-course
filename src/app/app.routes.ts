import { Routes } from '@angular/router';
import { Home } from './home/home';
import { ConferanceList } from './conferance-list/conferance-list';
import { Notfound } from './notfound/notfound';
import { ConferanceDetails } from './conferance-details/conferance-details';
import { AddUser } from './add-user/add-user';

export const routes: Routes = [
    {path:'home',component:Home},

  {path:'details/:id', component:ConferanceDetails},

  
    {path:'list',component:ConferanceList},
    {path:'add-conference',component:ConferanceDetails},
    {path:'edit-conference/:id',component:ConferanceDetails},
    {path:'',redirectTo:'home',pathMatch:'full'},
{path:'add',loadComponent: () => import('./add-user/add-user').then(c => c.AddUser)},
    {path:'**',component:Notfound},

];
