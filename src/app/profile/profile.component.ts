import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import axios from 'axios';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  private apiUrl: string;

  user_id: string = '';
  email: string = '';
  first_name: string = '';
  last_name: string = '';
  password: string = '';
  status: string = '';
  role_code: string = '';
  role: string = '';
  picture: string = '';

  openTab = 1;
  toggleTabs($tabNumber: number) {
    this.openTab = $tabNumber;
  }

  constructor(
    private cookieService: CookieService,
    @Inject('apiUrl') apiUrl: string,
  ) {
    this.apiUrl = apiUrl;
  }

  async ngOnInit(): Promise<void> {
    await this.fetchProfileData(); 
  }

  async fetchProfileData(): Promise<void> {
    const token = this.cookieService.get('accessToken');
    try {
      const response = await axios.get(`${this.apiUrl}/api/my/profile`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      console.log('profil ', response);

      this.user_id = response.data.user_id;
      this.email = response.data.email;
      this.first_name = response.data.first_name;
      this.last_name = response.data.last_name;
      this.password = response.data.password;
      this.status = response.data.status;
      this.role_code = response.data.role_code;
      this.picture = response.data.picture;

      console.log(this.role_code);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 500) {
          console.log(error.response.data.message);
        } else {
          console.log('Axios error:', error.message);
        }
      } else {
        console.error('Unknown error:', error);
      }
    }
  }
}
