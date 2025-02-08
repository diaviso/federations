import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Federation } from '../../../models/federation.model';
import { FederationService } from '../../../services/federation.service';

@Component({
  selector: 'app-federation-form',
  templateUrl: './federation-form.component.html',
  styleUrls: ['./federation-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class FederationFormComponent implements OnInit {
  federationForm: FormGroup;
  isEditMode = false;
  federationId: number | null = null;
  loading = false;
  error: string | null = null;
  selectedLogo: File | null = null;
  previewUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private federationService: FederationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.federationForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      date_creation: ['', Validators.required],
      president: ['', Validators.required],
      contact_email: ['', [Validators.required, Validators.email]],
      contact_telephone: ['', [Validators.required, Validators.pattern('^[0-9]{9,}$')]],
      adresse: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.federationId = id;
      this.loadFederation(id);
    }
  }

  private loadFederation(id: number): void {
    this.loading = true;
    this.federationService.getFederationById(id).subscribe({
      next: (federation) => {
        this.federationForm.patchValue({
          ...federation,
          date_creation: new Date(federation.date_creation).toISOString().split('T')[0]
        });
        this.previewUrl = federation.logo_url || null;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement de la fédération';
        this.loading = false;
        console.error('Error loading federation:', error);
      }
    });
  }

  onLogoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.error = 'Veuillez sélectionner une image valide';
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        this.error = 'L\'image ne doit pas dépasser 2MB';
        return;
      }

      this.selectedLogo = file;
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.federationForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      const formData: Federation = {
        ...this.federationForm.value,
        date_creation: new Date(this.federationForm.value.date_creation)
      };

      if (this.isEditMode && this.federationId) {
        await this.federationService.updateFederation(
          this.federationId,
          formData,
          this.selectedLogo || undefined
        );
      } else {
        await this.federationService.createFederation(
          formData,
          this.selectedLogo || undefined
        );
      }

      this.router.navigate(['/federations']);
    } catch (error) {
      this.error = 'Erreur lors de l\'enregistrement de la fédération';
      console.error('Error saving federation:', error);
      this.loading = false;
    }
  }

  onCancel(): void {
    this.router.navigate(['/federations']);
  }

  getErrorMessage(controlName: string): string {
    const control = this.federationForm.get(controlName);
    if (!control?.errors) return '';

    switch (controlName) {
      case 'nom':
        return control.errors['required'] ? 'Le nom est requis' :
               control.errors['minlength'] ? 'Le nom doit contenir au moins 3 caractères' : '';
      
      case 'description':
        return control.errors['required'] ? 'La description est requise' :
               control.errors['minlength'] ? 'La description doit contenir au moins 10 caractères' : '';
      
      case 'contact_email':
        return control.errors['required'] ? 'L\'email est requis' :
               control.errors['email'] ? 'Veuillez entrer une adresse email valide' : '';
      
      case 'contact_telephone':
        return control.errors['required'] ? 'Le numéro de téléphone est requis' :
               control.errors['pattern'] ? 'Veuillez entrer un numéro de téléphone valide' : '';
      
      default:
        return control.errors['required'] ? 'Ce champ est requis' : '';
    }
  }
}
