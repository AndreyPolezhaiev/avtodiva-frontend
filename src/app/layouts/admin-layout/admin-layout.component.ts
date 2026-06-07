import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DataRegistryService } from '../../shared/registry/data-registry.service';
import { AuthService } from '../../core/auth/service/auth.service';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
})
export class AdminLayoutComponent {
  private dataRegistryService = inject(DataRegistryService);
  private authService = inject(AuthService);
  private router = inject(Router);

  public onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
