import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

interface DashboardStats {
  federations: number;
  ligues: number;
  clubs: number;
  licences: number;
}

interface Activity {
  icon: string;
  description: string;
  time: Date;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class DashboardComponent {
  stats: DashboardStats = {
    federations: 0,
    ligues: 0,
    clubs: 0,
    licences: 0
  };

  recentActivities: Activity[] = [
    {
      icon: 'fas fa-plus',
      description: 'Nouvelle fédération ajoutée: Fédération Sénégalaise de Football',
      time: new Date()
    },
    {
      icon: 'fas fa-edit',
      description: 'Mise à jour de la Fédération Sénégalaise de Basketball',
      time: new Date(Date.now() - 3600000)
    },
    {
      icon: 'fas fa-trophy',
      description: 'Nouvelle compétition créée: Championnat National',
      time: new Date(Date.now() - 7200000)
    }
  ];

  constructor(
    private router: Router,
    private supabaseService: SupabaseService
  ) {}

  async ngOnInit() {
    await this.loadStats();
  }

  async loadStats() {
    try {
      const federations = await this.supabaseService.getFederations();
      this.stats.federations = federations.length;
      // TODO: Add other stats when their respective tables are created
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
