import { Component, OnInit } from '@angular/core';
import {Frontend} from "../../model/frontend";
import {RequestApi} from "../../service/request-api";

@Component({
  selector: 'app-frontend-form',
  templateUrl: './frontend-form.component.html',
  styleUrls: ['./frontend-form.component.scss']
})
export class FrontendFormComponent implements OnInit {

  site: Frontend = new Frontend();

  constructor(private r: RequestApi) { }

  ngOnInit() {
  }

  save() {
    console.log(this.site);
    this.r.putSite(this.site).subscribe(res => {
      console.log(res.json());
    });
  }

}
