import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-federation-ligues',
  templateUrl: './federation-ligues.component.html',
  styleUrls: ['./federation-ligues.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class FederationLiguesComponent implements OnInit {
  federationId: number = 0;
  ligues: any[] = []; // TODO: Create Ligue interface
  loading = true;
  searchTerm = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = Number(this.route.parent?.snapshot.paramMap.get('id'));
    if (id) {
      this.federationId = id;
      this.loadLigues();
    }
  }

  private loadLigues(): void {
    // TODO: Implement ligue service
    // Mock data for now
    setTimeout(() => {
      this.ligues = [
        { id: 1, nom: 'Ligue Île-de-France', president: 'Jean Dupont', email: 'contact@ligueidf.fr' },
        { id: 2, nom: 'Ligue Auvergne-Rhône-Alpes', president: 'Marie Martin', email: 'contact@ligueara.fr' },
        { id: 3, nom: 'Ligue Occitanie', president: 'Pierre Durand', email: 'contact@ligueoccitanie.fr' }
      ];
      this.loading = false;
    }, 1000);
  }

  onSearch(): void {
    // TODO: Implement search
  }

  onCreateLigue(): void {
    // TODO: Implement ligue creation
  }

  onEditLigue(id: number): void {
    // TODO: Implement ligue editing
  }

  onDeleteLigue(id: number): void {
    // TODO: Implement ligue deletion
  }
}
