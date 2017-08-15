import {BackendLocation} from "./location";

export class Frontend{
  id: String = "new_site";
  active: String = "false";
  domain: String = "example.com";
  http_port: Number = 80;
  https_port: Number = 443;
  forceSSL: Boolean = false;
  ssl: Boolean = false;
  locations: Array<BackendLocation> = [];
}
