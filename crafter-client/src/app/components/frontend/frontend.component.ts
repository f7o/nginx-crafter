import { Component, OnInit } from '@angular/core';
import {RequestApi} from "../../service/request-api";
import {Parser} from "../../service/parser";
import {MdDialog, MdDialogConfig, MdDialogRef, MdSnackBar} from "@angular/material";
import {EditorComponent} from "../dialogs/editor/editor.component";

@Component({
  selector: 'app-frontend',
  templateUrl: './frontend.component.html',
  styleUrls: ['./frontend.component.scss']
})
export class FrontendComponent implements OnInit {

  public sites: Object[] = [];
  private diagConfig: MdDialogConfig = new MdDialogConfig;
  private diag: MdDialogRef<EditorComponent>;

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
      this.diag = this.mdDialog.open(EditorComponent, this.diagConfig);
      this.diag.afterClosed().subscribe(conf => {
        if(conf) {
          this.backend.putSite(site, conf).subscribe(res => {
            console.log(res.json());
            this.snackBar.open(`Site: "${site}" saved!`,'', {
              duration: 2000
            });
          });
        }
      });
    });
  }

  deleteSite(site: String) {
    this.backend.deleteSite(site).subscribe(res => {
      console.log(res.json());
      this.refresh();
    });
  }
  toggle(site: String) {
    this.backend.toggleSite(site).subscribe(res => {
      this.snackBar.dismiss();
      this.snackBar.open(`Status of site "${res.json().site}": ${res.json().enabled}`,'', {
        duration: 2000
      });
    });
  }

  refresh() {
    this.backend.fetchSiteList().subscribe(res => {
      this.sites = res.json();
    })
  }

}
