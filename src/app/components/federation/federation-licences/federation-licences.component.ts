import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-federation-licences',
  templateUrl: './federation-licences.component.html',
  styleUrls: ['./federation-licences.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class FederationLicencesComponent implements OnInit {
  federationId: number = 0;
  licences: any[] = []; // TODO: Create Licence interface
  loading = true;
  searchTerm = '';
  filterStatus = 'all';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = Number(this.route.parent?.snapshot.paramMap.get('id'));
    if (id) {
      this.federationId = id;
      this.loadLicences();
    }
  }

  private loadLicences(): void {
    // TODO: Implement licence service
    // Mock data for now
    setTimeout(() => {
      this.licences = [
        {
          id: 1,
          numero: 'LIC-2024-001',
          nom: 'Martin',
          prenom: 'Sophie',
          dateNaissance: '1995-03-15',
          club: 'Club Sportif Paris',
          statut: 'active',
          dateValidite: '2024-12-31'
        },
        {
          id: 2,
          numero: 'LIC-2024-002',
          nom: 'Dubois',
          prenom: 'Thomas',
          dateNaissance: '1988-07-22',
          club: 'Association Sportive Lyon',
          statut: 'en_attente',
          dateValidite: '2024-12-31'
        }
      ];
      this.loading = false;
    }, 1000);
  }

  onSearch(): void {
    // TODO: Implement search
  }

  onFilterChange(): void {
    // TODO: Implement filter
  }

  onCreateLicence(): void {
    // TODO: Implement licence creation
  }

  onEditLicence(id: number): void {
    // TODO: Implement licence editing
  }

  onDeleteLicence(id: number): void {
    // TODO: Implement licence deletion
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'en_attente':
        return 'status-pending';
      case 'expiree':
        return 'status-expired';
      default:
        return '';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'active':
        return 'Active';
      case 'en_attente':
        return 'En attente';
      case 'expiree':
        return 'Expirée';
      default:
        return status;
    }
  }
}
