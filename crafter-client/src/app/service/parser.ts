import {Injectable} from "@angular/core";
import {Frontend} from "../model/frontend";

@Injectable()
export class Parser {
  public constructor() {


  }

  public inject(f: Frontend, conf: String) {
    let res = conf;
    res = res.replace("%default_domain%", "example.local");
    res = res.replace("%reverse_domain% ", f.domain.toString());
    res = res.replace("%reverse_ip%", "");
    res = res.replace("%proxy_pass_ip%", f.proxy_pass_addr.toString());
    res = res.replace("%proxy_pass_port%", f.proxy_pass_port.toString());
    res = res.replace("%location%", f.location.toString());
    return res;
  }

}
