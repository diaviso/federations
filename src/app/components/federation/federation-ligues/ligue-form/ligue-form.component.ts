import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LigueService } from '../../../../services/ligue.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-ligue-form',
  templateUrl: './ligue-form.component.html',
  styleUrls: ['./ligue-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class LigueFormComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  
  ligueForm: FormGroup;
  federationId: number = 0;
  loading = false;
  error: string | null = null;
  logoError: string | null = null;
  logoFile: File | null = null;
  logoPreview: string | null = null;
  isDragging = false;

  private readonly MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  private readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private ligueService: LigueService
  ) {
    this.ligueForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      date_creation: [new Date(), Validators.required],
      president: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      adresse: ['', Validators.required],
      code_postal: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]]
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.parent?.snapshot.paramMap.get('id'));
    if (id) {
      this.federationId = id;
    } else {
      this.error = 'ID de fédération non trouvé';
    }
  }

  onSubmit(): void {
    if (this.ligueForm.valid && !this.loading) {
      this.loading = true;
      this.error = null;

      // La date arrive comme une string "YYYY-MM-DD" du input type="date"
      const ligueData = {
        ...this.ligueForm.value,
        federation_id: this.federationId,
        date_creation: this.ligueForm.value.date_creation // On laisse la date au format YYYY-MM-DD
      };

      this.ligueService.createLigue(ligueData)
        .pipe(
          catchError(error => {
            console.error('Erreur lors de la création:', error);
            this.error = 'Erreur lors de la création de la ligue';
            this.loading = false;
            return of(null);
          })
        )
        .subscribe(async ligue => {
          if (ligue) {
            // Upload du logo si présent
            if (this.logoFile && ligue.id) {
              try {
                await this.ligueService.uploadLogo(this.logoFile, ligue.id);
              } catch (error) {
                console.error('Erreur lors de l\'upload du logo:', error);
                // On continue malgré l'erreur du logo
              }
            }
            this.router.navigate(['..'], { relativeTo: this.route });
          }
        });
    }
  }

  onCancel(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.handleFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files?.length) {
      this.handleFile(files[0]);
    }
  }

  private handleFile(file: File): void {
    this.logoError = null;

    // Vérification du type de fichier
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      this.logoError = 'Type de fichier non supporté. Utilisez PNG, JPG ou GIF.';
      return;
    }

    // Vérification de la taille
    if (file.size > this.MAX_FILE_SIZE) {
      this.logoError = 'Le fichier est trop volumineux. Taille maximum: 2MB';
      return;
    }

    // Création de l'aperçu
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.logoPreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    this.logoFile = file;
  }

  removeLogo(): void {
    this.logoFile = null;
    this.logoPreview = null;
    this.logoError = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  // Getters pour la validation des champs
  get nom() { return this.ligueForm.get('nom'); }
  get description() { return this.ligueForm.get('description'); }
  get date_creation() { return this.ligueForm.get('date_creation'); }
  get president() { return this.ligueForm.get('president'); }
  get email() { return this.ligueForm.get('email'); }
  get telephone() { return this.ligueForm.get('telephone'); }
  get adresse() { return this.ligueForm.get('adresse'); }
  get code_postal() { return this.ligueForm.get('code_postal'); }
}
