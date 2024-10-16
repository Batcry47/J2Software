import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor(private route: Router, private translate: TranslateService) { }

  ngOnInit(): void {
    this.route.navigate(['/dashboard']);
    this.translate.setDefaultLang('en');
  }
}
