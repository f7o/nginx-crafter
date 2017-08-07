import { Component, OnInit } from '@angular/core';
import {RequestApi} from "../../service/request-api";
import {Frontend} from "../../model/frontend";


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public sites: Frontend[] = [];

  constructor(private backend: RequestApi) { }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.backend.fetchSiteList().subscribe(res => {
      for(let site of res.json()) {
        let f = new Frontend();
        f.id = site;
        this.sites.push(f);
        this.isActive(f);
      }
    })
  }

  isActive(f: Frontend) {
    this.backend.isActive(f).subscribe(res => f.active = res.text());
  }


}
