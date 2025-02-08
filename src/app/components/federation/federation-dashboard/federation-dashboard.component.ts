import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Federation } from '../../../models/federation.model';
import { FederationService } from '../../../services/federation.service';

@Component({
  selector: 'app-federation-dashboard',
  templateUrl: './federation-dashboard.component.html',
  styleUrls: ['./federation-dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class FederationDashboardComponent implements OnInit {
  federation: Federation | null = null;
  stats = {
    totalLigues: 0,
    totalClubs: 0,
    totalLicences: 0,
    totalCompetitions: 0
  };
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private federationService: FederationService
  ) {}

  ngOnInit(): void {
    const federationId = Number(this.route.parent?.snapshot.paramMap.get('id'));
    if (federationId) {
      this.loadFederationData(federationId);
    }
  }

  private loadFederationData(id: number): void {
    this.federationService.getFederationById(id).subscribe({
      next: (federation) => {
        this.federation = federation;
        this.loading = false;
        // TODO: Load statistics from respective services
        this.loadStatistics(id);
      },
      error: (error) => {
        console.error('Error loading federation data:', error);
        this.loading = false;
      }
    });
  }

  private loadStatistics(federationId: number): void {
    // TODO: Implement statistics loading from respective services
    // For now, using mock data
    this.stats = {
      totalLigues: 5,
      totalClubs: 120,
      totalLicences: 3500,
      totalCompetitions: 25
    };
  }
}
