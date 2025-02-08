import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'federations',
    children: [
      {
        path: '',
        loadComponent: () => import('./components/federation/federation-list/federation-list.component')
          .then(m => m.FederationListComponent)
      },
      {
        path: 'new',
        loadComponent: () => import('./components/federation/federation-form/federation-form.component')
          .then(m => m.FederationFormComponent)
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./components/federation/federation-form/federation-form.component')
          .then(m => m.FederationFormComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./components/federation/federation-details/federation-details.component')
          .then(m => m.FederationDetailsComponent),
        children: [
          {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full'
          },
          {
            path: 'dashboard',
            loadComponent: () => import('./components/federation/federation-dashboard/federation-dashboard.component')
              .then(m => m.FederationDashboardComponent)
          },
          {
            path: 'ligues',
            loadComponent: () => import('./components/federation/federation-ligues/federation-ligues.component')
              .then(m => m.FederationLiguesComponent)
          },
          {
            path: 'clubs',
            loadComponent: () => import('./components/federation/federation-clubs/federation-clubs.component')
              .then(m => m.FederationClubsComponent)
          },
          {
            path: 'licences',
            loadComponent: () => import('./components/federation/federation-licences/federation-licences.component')
              .then(m => m.FederationLicencesComponent)
          },
          {
            path: 'competitions',
            loadComponent: () => import('./components/federation/federation-competitions/federation-competitions.component')
              .then(m => m.FederationCompetitionsComponent)
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
