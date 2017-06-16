import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';

import { AppSettings } from '../../shared/app.settings';
import { IEmployeeEntity } from '../../shared/app.entities';
import { IEmployee } from '../../shared/app.interfaces';
import { AppLoadingComponent } from '../../shared/components/loading/app.loading';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {ToasterModule, ToasterService, ToasterConfig} from 'angular2-toaster';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import * as sp from "sp-pnp-js";
import * as moment from "moment";
@Component({
    templateUrl: '../employee.component.html',
})
export class EmployeeAddComponent implements IEmployee {
     pageTile = "Add Employee";
    pageMode = "add";
    Employee: IEmployeeEntity = null;
    loading: string = "done";
    itemAdded: boolean = false;
    newEmployee: string = "";
    private toasterService: ToasterService;

    public toasterconfig : ToasterConfig = new ToasterConfig({timeout: 2000});

    constructor(private appSettings: AppSettings, private router: Router, toasterService: ToasterService ) { //public toastr : ToastsManager, vcr: ViewContainerRef
           // this.toastr.setRootViewContainerRef(vcr);
           this.toasterService = toasterService;
     }

    ngOnInit() {
        this.reset();
    };

    private reset(): void {
        this.Employee = {
            Id: 0,
            Title: '',
            EmployeeEmail: '',
            RequestDate: moment(new Date()).format('yyyy-MM-dd')
        }
    }

    saveChanges() {
        this.loading = "init";
        var user = {'AccountName': "i:0#.f|membership|" + this.Employee.EmployeeEmail + ""};
        var groupId = 4808;

        new sp.Web(AppSettings.SHAREPOINT_SITE_URL).siteGroups.getById(groupId)
            .users
            .add(user.AccountName).then((result : any) => {
                //this.toastr.success('Added User to Free Copy Orders Group', 'Success!');
                this.toasterService.pop('success', 'Success', 'Added User to Free Copy Orders Group');
                new sp.Web(AppSettings.SHAREPOINT_SITE_URL).lists.getByTitle('FCO Access Request').items.add({
                    Title: this.Employee.Title,
                    EmployeeEmail: this.Employee.EmployeeEmail,
                    RequestDate: this.Employee.RequestDate
                }).then((result : any) => {

                    this.newEmployee = this.Employee.Title;
                    this.itemAdded = true;
                    setTimeout(function () {
                        this.itemAdded = false;
                    }.bind(this), 3000);
                    this.reset();
                    //this.toastr.success('Added User to Free Copy Orders Group', 'Success!');
                    this.toasterService.pop('success', 'List Item Created', 'Success');
                    this.loading = "done";
                    console.log("ok");
                    this.router.navigateByUrl('/home');
                }).catch((e: any) => { 
                    this.loading = "done";
                   this.toasterService.pop('error', 'Error', 'Error adding to list');
                    console.log('not okay');
                    //this.router.navigateByUrl('/home');
                });
            }).catch((e : any) => { 
                console.log(e);
                this.loading = "done";
                //this.toastr.error('Error in providing access to user', 'Error!');
                this.toasterService.pop('error', 'Error', 'Error in providing access to user');
                console.log('not okay');
                //this.router.navigateByUrl('/home');
            });


        
    }

    back() {
        this.router.navigateByUrl('/home');
    }


}