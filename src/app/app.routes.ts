import { Routes } from '@angular/router';
import { AccountComponent } from './features/account/account.component';

export const routes: Routes = [
    { path: '', redirectTo: '/account', pathMatch: 'full' },
    { path: 'account', component: AccountComponent },
    { path: 'ristoranti', component: AccountComponent }, // Temporaneo, sarà sostituito con RistorantiComponent
    { path: '**', redirectTo: '/account' }
];
