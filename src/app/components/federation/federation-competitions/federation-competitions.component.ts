import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-federation-competitions',
  templateUrl: './federation-competitions.component.html',
  styleUrls: ['./federation-competitions.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class FederationCompetitionsComponent implements OnInit {
  federationId: number = 0;
  competitions: any[] = []; // TODO: Create Competition interface
  loading = true;
  searchTerm = '';
  filterStatus = 'all';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = Number(this.route.parent?.snapshot.paramMap.get('id'));
    if (id) {
      this.federationId = id;
      this.loadCompetitions();
    }
  }

  private loadCompetitions(): void {
    // TODO: Implement competition service
    // Mock data for now
    setTimeout(() => {
      this.competitions = [
        {
          id: 1,
          nom: 'Championnat National 2024',
          dateDebut: '2024-03-15',
          dateFin: '2024-03-17',
          lieu: 'Paris',
          statut: 'a_venir',
          participants: 150,
          categories: ['Senior', 'Junior'],
          type: 'championnat'
        },
        {
          id: 2,
          nom: 'Coupe Régionale Île-de-France',
          dateDebut: '2024-04-20',
          dateFin: '2024-04-21',
          lieu: 'Versailles',
          statut: 'inscription',
          participants: 80,
          categories: ['Senior'],
          type: 'coupe'
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

  onCreateCompetition(): void {
    // TODO: Implement competition creation
  }

  onEditCompetition(id: number): void {
    // TODO: Implement competition editing
  }

  onDeleteCompetition(id: number): void {
    // TODO: Implement competition deletion
  }

  onViewDetails(id: number): void {
    // TODO: Implement competition details view
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'a_venir':
        return 'status-upcoming';
      case 'inscription':
        return 'status-registration';
      case 'en_cours':
        return 'status-ongoing';
      case 'termine':
        return 'status-finished';
      case 'annule':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'a_venir':
        return 'À venir';
      case 'inscription':
        return 'Inscriptions ouvertes';
      case 'en_cours':
        return 'En cours';
      case 'termine':
        return 'Terminé';
      case 'annule':
        return 'Annulé';
      default:
        return status;
    }
  }
}
