import { Component, OnInit } from '@angular/core';
import {Frontend} from "../../model/frontend";
import {RequestApi} from "../../service/request-api";
import {Router} from "@angular/router";
import {MdSnackBar} from "@angular/material";
import {Parser} from "../../service/parser";
import {BackendLocation} from "../../model/location";

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
    public snackBar: MdSnackBar,
    private p: Parser) { }

  ngOnInit() {
    this.addLoc();
  }

  save() {
    console.log(this.site);
    this.r.getNonSslTpl().subscribe(tpl => {
      this.r.getNonSslLocTpl().subscribe(loc => {
        let site = this.p.inject(this.site, tpl.text(), loc.text());
        this.r.putSite(this.site.id, site).subscribe(res => {
          this.router.navigate(["/frontend"]);
          this.snackBar.open(`Site "${res.json().site}" created!`,'', {
              duration: 2000
            }
          )
        });
      })
    });

  }

  addLoc() {
    this.site.locations.push(new BackendLocation());
  }

  removeLoc(index: number) {
    this.site.locations.splice(index, 1);
  }

}
