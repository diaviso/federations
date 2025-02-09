import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { LigueService, Ligue } from '../../../services/ligue.service';
import { catchError, debounceTime, distinctUntilChanged, of, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-federation-ligues',
  templateUrl: './federation-ligues.component.html',
  styleUrls: ['./federation-ligues.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class FederationLiguesComponent implements OnInit {
  federationId: number = 0;
  ligues: Ligue[] = [];
  loading = true;
  error: string | null = null;
  searchTerm = '';
  private searchSubject = new Subject<string>();

  constructor(
    private route: ActivatedRoute,
    private ligueService: LigueService
  ) {
    // Configuration de la recherche avec debounce
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        if (!term.trim()) {
          return this.ligueService.getLiguesByFederation(this.federationId);
        }
        return this.ligueService.searchLigues(this.federationId, term);
      })
    ).subscribe({
      next: (ligues) => {
        this.ligues = ligues;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors de la recherche:', error);
        this.error = 'Erreur lors de la recherche des ligues';
        this.loading = false;
      }
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.parent?.snapshot.paramMap.get('id'));
    if (id) {
      this.federationId = id;
      this.loadLigues();
    } else {
      this.error = 'ID de fédération non trouvé';
      this.loading = false;
    }
  }

  private loadLigues(): void {
    this.loading = true;
    this.error = null;

    this.ligueService.getLiguesByFederation(this.federationId)
      .pipe(
        catchError(error => {
          console.error('Erreur lors du chargement des ligues:', error);
          this.error = 'Erreur lors du chargement des ligues';
          return of([]);
        })
      )
      .subscribe(ligues => {
        this.ligues = ligues;
        this.loading = false;
      });
  }

  onSearch(): void {
    this.searchSubject.next(this.searchTerm);
  }

  onEdit(id: number | undefined): void {
    // TODO: Implement edit navigation
    console.log('Navigation vers l\'édition de la ligue:', id);
  }

  onDelete(id: number | undefined): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette ligue ?')) {
      this.loading = true;
      this.error = null;

      this.ligueService.deleteLigue(id?id:0)
        .pipe(
          catchError(error => {
            console.error('Erreur lors de la suppression:', error);
            this.error = 'Erreur lors de la suppression de la ligue';
            return of(void 0);
          })
        )
        .subscribe(() => {
          this.loadLigues();
        });
    }
  }
}
