import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  public username: String = 'admin';
  public name: String = 'Florian Zouhar';
  public email: String = 'mail@f7o.de';

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

  public constructor(private router: Router) {

  }
}
