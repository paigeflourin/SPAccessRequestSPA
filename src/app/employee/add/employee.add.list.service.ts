import { Injectable } from '@angular/core';
import { Http, RequestOptions, Request, RequestMethod, Headers } from '@angular/http';
import { AppSettings } from '../../shared/app.settings';
import { Observable } from 'rxjs/Observable';

import * as pnp from "sp-pnp-js";
import * as sp from "sp-pnp-js";

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

@Injectable()

export class EmployeeListService {

  // url for your sharepoint site.
  private url: string = "https://campress.sharepoint.com/sites/Intranet/";

  constructor(private http: Http) { }

  search(term: string) {

    //new pnp.Web(this.url).siteUsers.filter("Email eq 'ptangalin@cambridge.org'").get().then(function (results) {
    //    console.log(results);
    //});
    console.log(term);
     let res = new pnp.Web(this.url).siteUsers.filter("substringof('" + term.toLowerCase() + "', Email )").get();  
     //let res = new pnp.Web(this.url).siteUsers.filter("Email eq '" + term +"'").get();  
     console.log(res);
    return res;
  }
}