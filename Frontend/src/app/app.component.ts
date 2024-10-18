import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor(private router: Router, private translate: TranslateService) { }

  ngOnInit(): void {
    const lastVisitedUrl = sessionStorage.getItem('lastVisitedUrl');
    if (lastVisitedUrl) {
      this.router.navigateByUrl(lastVisitedUrl);
    } else {
      this.router.navigate(['/login']); 
    }
  }
}
