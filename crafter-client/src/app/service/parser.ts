import {Injectable} from "@angular/core";
import * as nginxparser from "nginx-config-parser";

@Injectable()
export class Parser {
  public constructor() {


  }

  public parse(json) {
    return nginxparser.queryFromString(json);
  }


}
