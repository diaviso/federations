import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-federation-clubs',
  templateUrl: './federation-clubs.component.html',
  styleUrls: ['./federation-clubs.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class FederationClubsComponent implements OnInit {
  federationId: number = 0;
  clubs: any[] = []; // TODO: Create Club interface
  loading = true;
  searchTerm = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = Number(this.route.parent?.snapshot.paramMap.get('id'));
    if (id) {
      this.federationId = id;
      this.loadClubs();
    }
  }

  private loadClubs(): void {
    // TODO: Implement club service
    // Mock data for now
    setTimeout(() => {
      this.clubs = [
        { 
          id: 1, 
          nom: 'Club Sportif Paris', 
          president: 'Thomas Bernard',
          email: 'contact@csportifparis.fr',
          ligue: 'Ligue Île-de-France',
          membres: 150
        },
        { 
          id: 2, 
          nom: 'Association Sportive Lyon', 
          president: 'Sophie Martin',
          email: 'contact@aslyon.fr',
          ligue: 'Ligue Auvergne-Rhône-Alpes',
          membres: 200
        }
      ];
      this.loading = false;
    }, 1000);
  }

  onSearch(): void {
    // TODO: Implement search
  }

  onCreateClub(): void {
    // TODO: Implement club creation
  }

  onEditClub(id: number): void {
    // TODO: Implement club editing
  }

  onDeleteClub(id: number): void {
    // TODO: Implement club deletion
  }
}
