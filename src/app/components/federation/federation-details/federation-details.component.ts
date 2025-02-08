import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Federation } from '../../../models/federation.model';
import { FederationService } from '../../../services/federation.service';

@Component({
  selector: 'app-federation-details',
  templateUrl: './federation-details.component.html',
  styleUrls: ['./federation-details.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class FederationDetailsComponent implements OnInit {
  federation: Federation | null = null;
  loading = true;
  error: string | null = null;
  activeTab = 'dashboard';

  constructor(
    private route: ActivatedRoute,
    private federationService: FederationService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadFederation(id);
    }
  }

  private loadFederation(id: number): void {
    this.federationService.getFederationById(id).subscribe({
      next: (federation) => {
        this.federation = federation;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement de la fédération';
        this.loading = false;
        console.error('Error loading federation:', error);
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}
