import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import axios from 'axios';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private breadcrumbsSubject = new BehaviorSubject<Array<{ label: string; url: string }>>([]);
  breadcrumbs$ = this.breadcrumbsSubject.asObservable();

  private roleSubject = new BehaviorSubject<string>('');
  roleBaseURLs: { [role: string]: string } = {
    SA: '/superadmin',
    AS: '/admin',
    P: '/parent',
    D: '/driver',
  };

  private apiUrl: string; // Ganti dengan base API URL Anda

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cookieService: CookieService
  ) {
    this.apiUrl = environment.apiUrl;
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const baseURL = this.getBaseURLForCurrentRole();
        const breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root, baseURL);
        this.breadcrumbsSubject.next(breadcrumbs); // Emit breadcrumbs terbaru
      });
  }

  // Mendapatkan base URL berdasarkan role_code
  public getBaseURLForCurrentRole(): string {
    const role_code = this.roleSubject.value;
    return this.roleBaseURLs[role_code] || '/';
  }

  // Fungsi untuk mengupdate role_code setelah API call
  public setRoleCode(role_code: string): void {
    this.roleSubject.next(role_code);
  }

  // Verifikasi token dan mendapatkan role_code dari API
  public async verifyTokenAndSetRole(): Promise<void> {
    try {
      const token = this.cookieService.get('accessToken');
      if (!token) {
        throw new Error('Token tidak ditemukan!');
      }

      const response = await axios.get(`${this.apiUrl}/api/my/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const role_code = response.data.role_code;
      this.setRoleCode(role_code);
    } catch (error) {
      console.error('Error saat verifikasi token:', error);
      this.router.navigate(['/login']);
    }
  }

  // Membuat breadcrumbs
  private createBreadcrumbs(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: Array<{ label: string; url: string }> = []
  ): Array<{ label: string; url: string }> {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map((segment) => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      breadcrumbs.push({ label: child.snapshot.data['breadcrumb'], url: url });
      return this.createBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }
}