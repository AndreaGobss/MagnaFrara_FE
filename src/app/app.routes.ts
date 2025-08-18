import { Routes } from '@angular/router';
import { AccountComponent } from './features/account/account.component';
import { RestaurantComponent } from './features/ristoranti/restaurant.component';

export const routes: Routes = [
    { path: '', redirectTo: '/account', pathMatch: 'full' },
    { path: 'account', component: AccountComponent },
    { path: 'ristoranti', component: RestaurantComponent },
    { path: '**', redirectTo: '/account' }
];
