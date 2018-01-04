import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';

import { AppSettings } from '../../shared/app.settings';
import { IEmployeeEntity } from '../../shared/app.entities';
import { IEmployee } from '../../shared/app.interfaces';
import { AppLoadingComponent } from '../../shared/components/loading/app.loading';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {ToasterModule, ToasterService, ToasterConfig} from 'angular2-toaster';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { EmployeeListService } from './employee.add.list.service'

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

    public toasterconfig : ToasterConfig = new ToasterConfig({timeout: 5000});
    dateNow: string;


   
    selectedEmp: IEmployeeEntity = null;  
    items: Observable<IEmployeeEntity[]>;
    private searchTermStream = new Subject<string>();


    search(term: string) {
        this.searchTermStream.next(term);
    }

    constructor(private appSettings: AppSettings, private router: Router, toasterService: ToasterService, private empService: EmployeeListService ) { //public toastr : ToastsManager, vcr: ViewContainerRef
           // this.toastr.setRootViewContainerRef(vcr);
           this.toasterService = toasterService;
           this.items = this.searchTermStream
           .debounceTime(300)
           .distinctUntilChanged()
           .switchMap((term: string) => this.empService.search(term));
           //this.dateNow= new Date().toISOString().slice(0,16);//.toLocaleDateString();//.toISOString().slice(0,16);
     }

    ngOnInit() {
        this.reset();
    };

    private reset(): void {
        this.Employee = {
            Id: 0,
            Title: '',
            Email: '',
            //RequestDate: moment(new Date()).format('DD/MM/YYYY')
        }
    }

    setEmployee(emp: IEmployeeEntity) {
        console.log(emp);
        this.selectedEmp = emp;
        this.Employee.Email = this.selectedEmp.Email;
        this.search(this.selectedEmp.Email);
      }



    saveChanges() {
        this.loading = "init";
        var user = {'AccountName': "i:0#.f|membership|" + this.Employee.Email + ""};
        var groupId = 3549; //Test Free Copy Orders

        console.log(this.Employee); 
        
        //check validity of user
        new sp.Web(AppSettings.SHAREPOINT_SITE_URL).siteUsers.getByEmail("" + this.Employee.Email +"").get().then(function(result) { 
            console.log(result);
            console.log("check user if valid");
            
            new sp.Web(AppSettings.SHAREPOINT_SITE_URL).siteGroups.getById(groupId)
            .users
            .add(user.AccountName).then((result : any) => {
             
                this.toasterService.pop('success', 'Success', 'Added User to Free Copy Orders Group');
                
                new sp.Web(AppSettings.SHAREPOINT_SITE_URL).lists.getByTitle('FCO Access Request').items.add({
                    Title: this.Employee.Title,
                    EmployeeEmail: this.Employee.Email,
                    RequestDate: this.Employee.RequestDate
                }).then((result : any) => {

                    this.newEmployee = this.Employee.Title;
                    this.itemAdded = true;
                    setTimeout(function () {
                        this.itemAdded = false;
                    }.bind(this), 3000);
                    this.reset();
          
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
                this.toasterService.pop('error', 'Error', 'Error in providing access to user');
                console.log('not okay');
                //this.router.navigateByUrl('/home');
            });

        }).catch((e : any) => { 
            console.log(e);
            this.loading = "done";
            this.toasterService.pop('error', 'Error', 'User does not exist');
            console.log('user not exist');
        });


        
    }

    back() {
        this.router.navigateByUrl('/home');
    }


}