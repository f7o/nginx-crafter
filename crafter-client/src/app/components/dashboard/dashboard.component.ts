import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  public username: String = 'admin';
  public name: String = 'Florian Zouhar';
  public email: String = 'florian.zouhar@igd.fraunhofer.de';

  public routes: Object[] = [{
    icon: 'widgets',
    route: '.',
    title: 'Dashboard',
  }, {
    icon: 'library_books',
    route: '/frontend',
    title: 'Frontends',
  }, {
    icon: 'device_hub',
    route: '/backend',
    title: 'Backends',
  }
  ];
  usermenu: Object[] = [{
    icon: 'exit_to_app',
    route: '.',
    title: 'Sign out',
  },
  ];

}
