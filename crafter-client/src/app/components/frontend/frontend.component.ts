import { Component, OnInit } from '@angular/core';
import {RequestApi} from "../../service/request-api";
import {Parser} from "../../service/parser";
import {MdDialog, MdDialogConfig, MdSnackBar} from "@angular/material";
import {EditorComponent} from "../dialogs/editor/editor.component";

@Component({
  selector: 'app-frontend',
  templateUrl: './frontend.component.html',
  styleUrls: ['./frontend.component.scss']
})
export class FrontendComponent implements OnInit {

  public sites: Object[] = [];
  private diagConfig: MdDialogConfig = new MdDialogConfig;

  constructor(
    private backend: RequestApi,
    private parser: Parser,
    public snackBar: MdSnackBar,
    private mdDialog: MdDialog) { }

  ngOnInit() {
      this.refresh();
  }

  info(site: String) {
    this.backend.getSite(site).subscribe(res => {
      this.diagConfig.data = res.text();
      this.mdDialog.open(EditorComponent, this.diagConfig);
    })
  }

  deleteSite(site: String) {
    this.backend.deleteSite(site).subscribe(res => console.log(res.json()));
    this.refresh();
  }
  toggle(site: String) {
    this.backend.toggleSite(site).subscribe(res => {
      this.snackBar.dismiss();
      this.snackBar.open(`Status of site "${res.json().site}": ${res.json().enabled}`);
    });
  }

  refresh() {
    this.backend.fetchSiteList().subscribe(res => {
      this.sites = res.json();
    })
  }

}
