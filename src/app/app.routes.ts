import { Routes } from '@angular/router';
import { HomeScreenComponent } from './home-screen/home-screen.component';
import { ButtonComponent } from './button/button.component';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { BadgeComponent } from './badge/badge.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeScreenComponent
    },
    {
        path: 'button',
        component: ButtonComponent
    },
    {
        path: 'autocomplete',
        component: AutocompleteComponent
    },
    {
        path: 'badge',
        component: BadgeComponent
    }
];
