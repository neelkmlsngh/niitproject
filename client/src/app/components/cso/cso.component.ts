import { Component, OnInit } from '@angular/core';
import { ControlAccessService } from '../../services/control-access.service';
import { ParamMap } from '@angular/router';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';
import { TemplateRef } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

@Component({
  selector: 'app-cso',
  templateUrl: './cso.component.html',
  styleUrls: ['./cso.component.css']
})
export class CsoComponent implements OnInit {

  //declaring the variables
  accessCard: any;
  issued: any;
  datepickerModel: any;
  empp: any = [];
  e: any;


  public modalRef: BsModalRef;

  public config = {
    animated: true,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: false
  };

  //constructor to initialize the ControlAccessService
  constructor(private newrequest: ControlAccessService, private route: Router, private router: ActivatedRoute, private modalService: BsModalService) {}

  //ngoninit method to calling the getEmployeeByID from control access service automatically 
  ngOnInit() {
    this.router.paramMap
      .switchMap((params: ParamMap) => this.newrequest.getEmployeeByID(this.router.snapshot.params['value']))
      .subscribe(res => {

        this.empp = res;
        console.log(this.empp)
      });

    //making instance of Date for fetch current date
    this.datepickerModel = new Date();
    let a = this.datepickerModel.getDate();
    let b = this.datepickerModel.getMonth() + 1;
    let c = this.datepickerModel.getFullYear();
    this.datepickerModel = a + '/' + b + '/' + c;
  }

  // accept method to accept the form and allow the access card
  accept(temp: any) {

    this.e = {
      prev: "Cso",
      current: "Closed",
      issuedBy: this.issued,
      issueDate: this.datepickerModel,
      cardno: this.accessCard
    }


    this.newrequest.update(this.empp.employeeID, this.e)
      .subscribe(res => {
        console.log(res)

      })

    this.openModalWithClass(temp)
    this.route.navigate(['/csodash']);
  }

  //reject method to reject the form and send to previous level
  reject(temp: any) {
    this.openModalWithClass(temp)
  }

  //backit method for status change
  backit() {
    this.e = {
      prev: "Cso",
      current: "Hr",
    }


    this.newrequest.update(this.empp.employeeID, this.e)
      .subscribe(res => {
        console.log(res)

      })

    this.route.navigate(['/csodash']);
    this.modalRef.hide();
  }

  public openModalWithClass(template: TemplateRef < any > ) {
    this.modalRef = this.modalService.show(template, Object.assign({}, this.config, { class: 'gray modal-lg' }));
  }
}
