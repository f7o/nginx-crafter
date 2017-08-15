import {Injectable} from "@angular/core";
import {Frontend} from "../model/frontend";
import {BackendLocation} from "../model/location";

@Injectable()
export class Parser {
  public constructor() {


  }

  public inject(f: Frontend, conf: string, loc_template: string) {
    let res = conf;
    res = res.replace("%default_domain%", "example.local");
    res = res.replace("%reverse_domain% ", f.domain.toString());
    res = res.replace("%reverse_ip%", "");
    for(let l of f.locations) {
      if(f.locations.indexOf(l) == f.locations.length-1) {
        res = res.replace("%locations%", this.injectLoc(l, loc_template));
      } else {
        res = res.replace("%locations%", this.injectLoc(l, loc_template) + "\n        %locations%");
      }
    }
    return res;
  }

  public injectLoc(l: BackendLocation, loc: string): string {
    let res = loc;
    res = res.replace("%proxy_pass_ip%", l.proxy_pass_addr.toString());
    res = res.replace("%proxy_pass_port%", l.proxy_pass_port.toString());
    res = res.replace("%location%", l.location.toString());
    return res;
  }

}
