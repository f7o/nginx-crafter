import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Frontend} from "../model/frontend";

@Injectable()
export class RequestApi {
  public constructor(private http: Http) {

  }

  public fetchSiteList() {
    return this.http.get("/api/sites/list");
  }

  public getSite(site: String) {
    return this.http.get(`/api/sites/${site}`);
  }

  public putSite(f: Frontend) {
    return this.http.put(`/api/sites/${f.id}`, JSON.stringify(f));
  }

  public deleteSite(site: String) {
    return this.http.delete(`/api/sites/${site}`);
  }

  public toggleSite(site: String) {
    return this.http.get(`/api/sites/toggle/${site}`)
  }
}
