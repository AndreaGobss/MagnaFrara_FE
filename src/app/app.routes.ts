import { Routes } from '@angular/router';
import { AccountComponent } from './features/account/account.component';
import { RestaurantComponent } from './features/ristoranti/restaurant.component';
import { RecensioniRistComponent } from './features/recensioniRist/recensioniRist.component';
import { RecensioniUserComponent } from './features/recensioniUser/recensioniUser.component';
import { MieiRistorantiComponent } from './features/miei-ristoranti/miei-ristoranti.component';

export const routes: Routes = [
    { path: '', redirectTo: '/account', pathMatch: 'full' },
    { path: 'account', component: AccountComponent },
    { path: 'ristoranti', component: RestaurantComponent },
    { path: 'ristorante/:id', component: RecensioniRistComponent},
    { path: 'mie-recensioni', component: RecensioniUserComponent},
    { path: 'miei-ristoranti', component: MieiRistorantiComponent},
    { path: '**', redirectTo: '/account' }
];
