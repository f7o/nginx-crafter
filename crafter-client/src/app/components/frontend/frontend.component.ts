import { Component, OnInit } from '@angular/core';
import {RequestApi} from "../../service/request-api";

@Component({
  selector: 'app-frontend',
  templateUrl: './frontend.component.html',
  styleUrls: ['./frontend.component.scss']
})
export class FrontendComponent implements OnInit {

  public sites: Object[] = [];

  constructor(private backend: RequestApi) { }

  ngOnInit() {
    this.backend.fetchSiteList().subscribe(res => {
      console.log(res.toString());
      this.sites = res.json();
    })
  }

}
