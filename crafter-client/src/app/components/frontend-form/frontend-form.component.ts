import { Component, OnInit } from '@angular/core';
import {Frontend} from "../../model/frontend";
import {RequestApi} from "../../service/request-api";
import {Router} from "@angular/router";
import {MdSnackBar} from "@angular/material";

@Component({
  selector: 'app-frontend-form',
  templateUrl: './frontend-form.component.html',
  styleUrls: ['./frontend-form.component.scss']
})
export class FrontendFormComponent implements OnInit {

  site: Frontend = new Frontend();

  constructor(
    private r: RequestApi,
    private router: Router,
    public snackBar: MdSnackBar) { }

  ngOnInit() {
  }

  save() {
    console.log(this.site);
    this.r.putSite(this.site).subscribe(res => {
      this.router.navigate(["/frontend"]);
      this.snackBar.open(`Site "${res.json().site}" created!`,'', {
        duration: 2000
      }
    )
    });
  }

}
