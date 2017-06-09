import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { RouterConfig } from './app.routes';
import { AppSettings } from './shared/app.settings';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { EmployeeAddComponent } from './employee/add/employee.add.component';
import { AppLoadingComponent } from './shared/components/loading/app.loading';
import { AppNotifyComponent } from './shared/components/notify/app.notify';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        EmployeeAddComponent,
        AppLoadingComponent,
        AppNotifyComponent
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        AppSettings
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot(RouterConfig),
        HttpModule,
        FormsModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }