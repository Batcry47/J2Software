import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  constructor(
    private router: Router,
    private translate: TranslateService
  ) {
    translate.setDefaultLang('en');
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      translate.use(savedLanguage);
    } else {
      translate.use('en');
      localStorage.setItem('language', 'en');
    }
  }

  ngOnInit(): void {
    const lastVisitedUrl = sessionStorage.getItem('lastVisitedUrl');
    if (lastVisitedUrl) {
      this.router.navigateByUrl(lastVisitedUrl);
    } else {
      this.router.navigate(['/login']);
    }
  }
}