import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppSettings } from '../../shared/app.settings';
import { IEmployeeEntity } from '../../shared/app.entities';
import { IEmployee } from '../../shared/app.interfaces';
import { AppLoadingComponent } from '../../shared/components/loading/app.loading';

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
    constructor(private appSettings: AppSettings, private router: Router) { }

    ngOnInit() {
        this.reset();
    };

    private reset(): void {
        this.Employee = {
            Id: 0,
            Title: '',
            EmployeeEmail: '',
            RequestDate: moment(new Date()).format('MM/DD/YYYY')
        }
    }

    saveChanges() {
        this.loading = "init";
        
        new sp.Web(AppSettings.SHAREPOINT_SITE_URL).lists.getByTitle('FCO Access Request').items.add({
            Title: this.Employee.Title,
            EmployeeEmail: this.Employee.EmployeeEmail,
            RequestDate: this.Employee.RequestDate
        }).then((result : any) => {

            var user = {'AccountName': "i:0#.f|membership|" + this.Employee.EmployeeEmail + ""};
            var groupId = 4808;
            new sp.Web(AppSettings.SHAREPOINT_SITE_URL).siteGroups.getById(groupId)
            .users
            .add(user.AccountName)

            this.newEmployee = this.Employee.Title;
            this.itemAdded = true;
            setTimeout(function () {
                this.itemAdded = false;
            }.bind(this), 3000);
            this.reset();
            this.loading = "done";
            console.log('ok');
            this.router.navigateByUrl('/home');
        }).catch((e: any) => { this.loading = "error"; });
    }

    addToGroup(emp:any) {
       


    }


}