import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { environment } from '../../environments/environment';
import Swal from 'sweetalert2';
import axios from 'axios';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  private apiUrl: string;

  constructor(
    private router: Router,
    private cookieService: CookieService
  ) {
    this.apiUrl = environment.apiUrl;
  }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    // Define strict role codes
    // const ROLE_CODES = {
    //   SUPER_ADMIN: 'SA',
    //   ADMIN: 'AS',
    //   PARENT: 'P',
    //   DRIVER: 'D'
    // } as const;
  
    // // Type for role codes
    // type RoleCode = typeof ROLE_CODES[keyof typeof ROLE_CODES];
  
    // // Role dashboards with strict typing
    // const roleDashboards: Record<RoleCode, string> = {
    //   [ROLE_CODES.SUPER_ADMIN]: '/superadmin/dashboard',
    //   [ROLE_CODES.ADMIN]: '/admin/dashboard',
    //   [ROLE_CODES.PARENT]: '/parent/dashboard',
    //   [ROLE_CODES.DRIVER]: '/driver/dashboard'
    // };
  
    const token = this.cookieService.get('accessToken');
  
    // No token, redirect to login
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }
  
    try {
      // Token verification
      const response = await axios.get(`${this.apiUrl}/api/my/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Validate role code
      const role_code = response.data.role_code;
  
      // // Ensure role_code is a valid RoleCode
      // if (!Object.values(ROLE_CODES).includes(role_code)) {
      //   this.router.navigate(['/unauthorized']);
      //   return false;
      // }
  
      // // Safe access to roleDashboards
      // const baseUrl = roleDashboards[role_code as RoleCode] || '/unauthorized';
      // localStorage.setItem('baseUrl', baseUrl);
  
      // Navigation based on role
      // switch(role_code) {
      //   case ROLE_CODES.SUPER_ADMIN:
      //     this.router.navigate(['/superadmin']);
      //     return false;
      //   case ROLE_CODES.ADMIN:
      //     this.router.navigate(['/admin']);
      //     return false;
      //   case ROLE_CODES.PARENT:
      //     this.router.navigate(['/parent']);
      //     return false;
      //   case ROLE_CODES.DRIVER:
      //     this.router.navigate(['/driver']);
      //     return false;
      //   default:
      //     this.router.navigate(['/unauthorized']);
      //     return false;
      // }
          // Navigasi berdasarkan role
    switch(role_code) {
      case 'SA':
        this.router.navigate(['/superadmin']);
        return false;
      case 'AS':
        this.router.navigate(['/admin']);
        return false;
      case 'P':
        this.router.navigate(['/parent']);
        return false;
      case 'D':
        this.router.navigate(['/driver']);
        return false;
      default:
        this.router.navigate(['/unauthorized']);
        return false;
      }
    } catch (error) {
      console.error('Error saat verifikasi token:', error);
      this.cookieService.delete('accessToken');
      localStorage.removeItem('accessToken');
      this.router.navigate(['/login']);
      return false;
    }
  }
}