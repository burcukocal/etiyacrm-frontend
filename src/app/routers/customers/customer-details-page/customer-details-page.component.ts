import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TopBarComponent } from '../../../shared/components/top-bar/top-bar.component';
import { ConfirmExitComponent } from '../../../shared/components/confirm-exit/confirm-exit.component';
import { CustomerApiService } from '../../../features/customers/services/customerApi.service';
import { SuccessPopupComponent } from '../../../shared/components/success-popup/success-popup.component';
import { SuccessMessageService } from '../../../features/customers/services/successMessage.service';

@Component({
  selector: 'app-customer-details-page',
  standalone: true,
  imports: [
    CommonModule,
    TopBarComponent,
    RouterModule,
    ConfirmExitComponent,
    SuccessPopupComponent
  ],
  templateUrl: './customer-details-page.component.html',
  styleUrl: './customer-details-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerDetailsPageComponent implements OnInit{
  //message: string = 'Are you sure to delete this customer?';
  successMessage: string | null = null;
  customerId: string | null = null;
  //isDeleted: boolean = false;
  //@ViewChild(ConfirmExitComponent) confirmExitComponent!: ConfirmExitComponent;
  showConfirmation = false;

  constructor(
    private customerApiService: CustomerApiService,
    private change: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private successMessageService: SuccessMessageService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.customerId = params.get('id');
      console.log("customerId", this.customerId);
    }).unsubscribe();
    this.successMessageService.successMessage$.subscribe(message => {
      this.successMessage = message;
    });
  }

  deleteCustomer(){
    this.customerApiService.deleteCustomer(this.customerId).subscribe(
      {
        next: (response) => {
          console.log('Customer deleted successfully', response);
          this.successMessageService.setSuccessMessage('Customer deleted successfully.');



        },
        error: (error) => {
          console.error('Error', error)
        },
        complete: () => {
          this.router.navigate(['/home']);
          this.showConfirmation = false;
        }
      }
    )
  }

  onDelete() {
    this.showConfirmation = true;
  }

  onConfirmDelete(confirmed: boolean) {
    if (confirmed) {
      this.deleteCustomer();
    } else {
      this.showConfirmation = false;
    }
  }

  onCloseConfirmation() {
    this.showConfirmation = false;
  }

  // onDelete() {
  //   this.showConfirmation = true;
  // }

  // onConfirmDelete() {
  //   this.deleteCustomer();
  //   this.showConfirmation = false;
  //   this.router.navigate(['/home']);
  // }

  // onCloseConfirmation() {
  //   this.showConfirmation = false;
  // }
}
