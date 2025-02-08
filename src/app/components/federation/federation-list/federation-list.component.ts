import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Federation } from '../../../models/federation.model';
import { FederationService } from '../../../services/federation.service';

@Component({
  selector: 'app-federation-list',
  templateUrl: './federation-list.component.html',
  styleUrls: ['./federation-list.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class FederationListComponent implements OnInit {
  federations: Federation[] = [];
  filteredFederations: Federation[] = [];
  loading = true;
  error: string | null = null;
  searchTerm = '';

  constructor(
    private federationService: FederationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFederations();
  }

  loadFederations(): void {
    this.loading = true;
    this.federationService.getAllFederations().subscribe({
      next: (data) => {
        this.federations = data;
        this.filteredFederations = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement des fédérations';
        this.loading = false;
        console.error('Error loading federations:', error);
      }
    });
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredFederations = this.federations;
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredFederations = this.federations.filter(federation => 
      federation.nom.toLowerCase().includes(searchTermLower) ||
      federation.description.toLowerCase().includes(searchTermLower) ||
      federation.president.toLowerCase().includes(searchTermLower) ||
      federation.contact_email.toLowerCase().includes(searchTermLower)
    );
  }

  onViewDetails(id: number): void {
    this.router.navigate(['/federations', id]);
  }

  onCreateNew(): void {
    this.router.navigate(['/federations/new']);
  }

  onEdit(id: number): void {
    this.router.navigate(['/federations/edit', id]);
  }

  onDelete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette fédération ?')) {
      this.federationService.deleteFederation(id).then(() => {
        this.loadFederations();
      }).catch(error => {
        this.error = 'Erreur lors de la suppression de la fédération';
        console.error('Error deleting federation:', error);
      });
    }
  }
}
