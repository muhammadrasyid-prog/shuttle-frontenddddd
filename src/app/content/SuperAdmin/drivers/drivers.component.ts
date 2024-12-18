import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { ColDef, ICellRendererParams } from 'ag-grid-community';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import axios from 'axios';
import { CookieService } from 'ngx-cookie-service';
import { HeaderComponent } from '../../../navigations/header/header.component';
import { AgGridAngular } from 'ag-grid-angular';
import { CommonModule } from '@angular/common';

interface Driver{
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
  role_code: string;
  phone: string;
  address: string;
  status: string;
  details: Detail;
}

interface Detail {
  vehicle_id: string;
  license_number: string;
}

@Component({
  selector: 'app-drivers',
  standalone: true,
  imports: [CommonModule, AgGridAngular, FormsModule, HeaderComponent],
  templateUrl: './drivers.component.html',
  styleUrl: './drivers.component.css'
})
export class DriversComponent implements OnInit {
  id: string = '';
  first_name: string = '';
  last_name: string = '';
  gender: string = '';
  email: string = '';
  password: string = '';
  role: string = '';
  role_code: string = '';
  phone: string = '';
  address: string = '';
  status: string = '';
  details: Detail = {
    vehicle_id: '',
    license_number: '',
  };

  totalRows: number = 0;
  startRow: number = 1;
  endRow: number = 10;

  isModalAddOpen: boolean = false;
  isModalEditOpen: boolean = false;

  rowListAllDriver: Driver[] = [];

  constructor(
    private cookieService: CookieService,
    private cdRef: ChangeDetectorRef,
    @Inject('apiUrl') private apiUrl: string,
  ) {
    this.apiUrl = apiUrl;
  }

  ngOnInit(): void {
    this.getAllDriver();
  }

  themeClass = 'ag-theme-quartz';

  gridOptions = {
    ensureDomOrder: true,
    enableAccessibility: false,
    pagination: true,
    paginationPageSize: 10,
    paginationPageSizeSelector: [10, 20, 50, 100],
  };

  colHeaderListAllDriver: ColDef<Driver>[] = [
    {
      headerName: 'No.',
      valueGetter: 'node.rowIndex + 1',
      width: 50,
      maxWidth: 70,
      pinned: 'left',
    },
    { headerName: 'First Name', field: 'first_name', pinned: 'left' },
    { headerName: 'Last Name', field: 'last_name' },
    { headerName: 'Email', field: 'email' },
    { headerName: 'Role', field: 'role', cellClass: 'capitalize' },
    { headerName: 'Role Code', field: 'role_code' },
    { field: 'phone' },
    { field: 'address' },
    { headerName: 'Vehicle ID', field: 'details.vehicle_id' },
    { headerName: 'License Number', field: 'details.license_number' },
    { field: 'status' },
    {
      headerName: 'Actions',
      cellRenderer: (params: ICellRendererParams) => {
        const button = document.createElement('button');
        button.innerText = 'Edit';
        button.innerHTML = `
        <svg width="20" height="20" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 13v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h7"></path>
          <path d="M7 13.36V17h3.659L21 6.654 17.348 3 7 13.36Z"></path>
        </svg>
      `;
        button.addEventListener('click', (event) => {
          event.stopPropagation();
          this.openModalEdit();
        });
        return button;
      },
      pinned: 'right',
    },
  ];

  defaultColDef: ColDef = {
    flex: 1,
    width: 130,
    minWidth: 120,
    maxWidth: 250,
    wrapHeaderText: true,
    autoHeaderHeight: true,
  };

  totalRowCount(event: any) {
    const api = event.api;
    const totalRows = api.getDisplayedRowCount();
    const currentPage = api.paginationGetCurrentPage();
    const pageSize = api.paginationGetPageSize();

    this.totalRows = totalRows;
    this.startRow = currentPage * pageSize + 1;
    this.endRow = Math.min((currentPage + 1) * pageSize, this.totalRows);

    event.api.refreshCells();
  }

  getAllDriver() {
    axios
      .get(`${this.apiUrl}/api/superadmin/user/driver/all`, {
        headers: {
          Authorization: `${this.cookieService.get('accessToken')}`,
        },
      })
      .then((response) => {
        console.log('woila', response.data);

        this.rowListAllDriver = response.data;
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }

  fetchDataDriver(): void {

  }

  openModalAdd() {
    this.first_name = '';
    this.last_name = '';
    this.gender = '';
    this.email = '';
    this.password = '';
    this.role = '';
    this.role_code = '';
    this.phone = '';
    this.address = '';
    this.status = '';
    this.details.vehicle_id = '';
    this.details.license_number = '';
    this.cdRef.detectChanges();
    this.isModalAddOpen = true;
  }

  closeModalAdd() {
    this.isModalAddOpen = false;
    this.cdRef.detectChanges();
  }

  addDriver() {
    const token = this.cookieService.get('userToken');

    axios
      .post(
        `${this.apiUrl}/api/school/user/driver/add`,
        {
          first_name: this.first_name,
          last_name: this.last_name,
          email: this.email,
          password: this.password,
          role: this.role,
          role_code: this.role_code,
          phone: this.phone,
          address: this.address,
          status: this.status,
          details: {
            vehicle_id: this.details.vehicle_id,
            license_number: this.details.license_number,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data.message);
        this.fetchDataDriver();
        Swal.fire({
          title: 'Success',
          text: response.data.message,
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
          showCancelButton: false,
          showConfirmButton: false,
        });
        this.first_name = '';
        this.last_name = '';
        this.email = '';
        this.password = '';
        this.role = '';
        this.role_code = '';
        this.phone = '';
        this.address = '';
        this.status = '';
        this.details.vehicle_id = '';
        this.details.license_number = '';
      })
      .catch((error) => {
        if (
          error.response.status === 400 ||
          error.response.status === 422 ||
          error.response.status === 500
        ) {
          Swal.fire({
            title: 'Error',
            text: error.response.data.message,
            icon: 'error',
            timer: 2000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: 'Terjadi kesalahan',
            icon: 'error',
            timer: 2000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        }
      });
    this.isModalAddOpen = false;
  }

  openModalEdit() {
    this.isModalEditOpen = true;
    this.cdRef.detectChanges();
  }

  closeModalEdit() {
    this.isModalEditOpen = false;
    this.cdRef.detectChanges();
  }
}
