import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BackendConnectionService } from '../backend-connection.service';

export interface EventDetails {
  eventID: number;
  category: string;
  method: string;
  username: string;
  ipAddress: string;
  timestamp: Date;
  severity: string;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  inactivityTimer: any;
  INACTIVITY_TIMEOUT = 30000;
  selectedSortOption;
  selectedCategory;
  isFilterCollapsed = true;
  // originalResults = [
  //   { category: 'Defence Evasion', method: 'Suspicious File extension', username: 'John Doe', ipAddress: '192.168.1.1', timestamp: '2024/04/15 02:54:12', severity: 'informational' },
  //   { category: 'Persistence', method: 'Suspicious File share', username: 'James Smith', ipAddress: '196.168.2.1', timestamp: '2024/04/15 03:25:09', severity: 'low' },
  //   { category: 'Impact', method: 'Process with Elevated Permissions', username: 'Alex Davidson', ipAddress: '127.0.0.1', timestamp: '2024/04/15 03:36:14', severity: 'medium' },
  //   { category: 'Exfiltration', method: 'FTP File share', username: 'Sam Smith', ipAddress: '187.296.58.7', timestamp: '2024/04/15 09:24:08', severity: 'high' },
  //   { category: 'Initial Access', method: 'Unusual Login', username: 'Ben Benson', ipAddress: '172.486.24.5', timestamp: '2024/04/15 12:36:18', severity: 'high' }
  // ];
  originalResults: any[] = [];
  results = [];
  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private backendService: BackendConnectionService
  ) { }

  ngOnInit(): void {
    this.backendService.getEventLogs().subscribe(data => {
      this.originalResults = data.Eventlogs;
      console.log(data.Eventlogs); 
      console.log(this.originalResults);
    });
    
    this.startEvents();
    this.startInactivityTimer();
    this.route.queryParams.subscribe(params => {
      const category = params['category'];
      if (category) {
        setTimeout(() => { this.applyCategoryFilter(category); }, 0)
      }
    });
  }

  startEvents() {
    window.addEventListener("mousemove", this.resetInactivityTimer.bind(this));
    window.addEventListener("keydown", this.resetInactivityTimer.bind(this));
  }

  openPrompt() {
    const logoutPrompt = document.getElementById("logout") as HTMLDialogElement;
    logoutPrompt.showModal();
  }

  closePrompt() {
    const logoutPrompt = document.getElementById("logout") as HTMLDialogElement;
    logoutPrompt.close();
  }

  startInactivityTimer() {
    this.inactivityTimer = setTimeout(() => this.showLogoutPrompt(), this.INACTIVITY_TIMEOUT);
  }

  resetInactivityTimer() {
    clearTimeout(this.inactivityTimer);
    this.startInactivityTimer();
  }

  showLogoutPrompt() {
    const logoutPrompt = document.getElementById("logoutPrompt") as HTMLDialogElement;
    logoutPrompt.showModal();
  }

  closeLogoutPrompt() {
    const logoutPrompt = document.getElementById("logoutPrompt") as HTMLDialogElement;
    logoutPrompt.close();
  }

  toggleFilter() {
    this.isFilterCollapsed = !this.isFilterCollapsed;
  }

  applyCategoryFilter(category: string) {
    const categoryBox = document.querySelector(`.filter-checkbox[data-category="${category.toLowerCase().replace(' ', '-')}"]`) as HTMLInputElement;
    if (categoryBox) {
      this.renderer.setProperty(categoryBox, 'checked', true);
      console.log('Checkbox has been ticked');
    }
    else {
      console.log('Unable to find checkbox for: ' + category)
    }
    this.originalResults.filter(result =>
      result.category.toLowerCase().replace(' ', '-') === category
    );
  }

  filterResults() {
    const selectedSeverities = Array.from(document.querySelectorAll('.filter-checkbox[data-severity]:checked'))
      .map((checkbox: HTMLInputElement) => checkbox.getAttribute('data-severity'));
    const selectedCategories = Array.from(document.querySelectorAll('.filter-checkbox[data-category]:checked'))
      .map((checkbox: HTMLInputElement) => checkbox.getAttribute('data-category'));

    this.originalResults = this.originalResults.filter(result => {
      const severityMatch = selectedSeverities.length === 0 || selectedSeverities.includes(result.severity.toLowerCase());
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(result.category.toLowerCase().replace(' ', '-'));
      return severityMatch && categoryMatch;
    });
  }

  clearSeverityFilters() {
    const severityCheckboxes = document.querySelectorAll('.filter-checkbox[data-severity]');
    severityCheckboxes.forEach((checkbox: HTMLInputElement) => {
      checkbox.checked = false;
    });

    this.filterResults();
  }

  clearCategoryFilters() {
    const categoryCheckboxes = document.querySelectorAll('.filter-checkbox[data-category]');
    categoryCheckboxes.forEach((checkbox: HTMLInputElement) => {
      checkbox.checked = false;
    });

    this.filterResults();
  }

  sortResults() {
    this.originalResults.sort((a, b) => {
      let sortingOption = 0;

      if (this.selectedSortOption === 'category') {
        sortingOption = a.Category.localeCompare(b.Category);
      } else if (this.selectedSortOption === 'method') {
        sortingOption = a.Method.localeCompare(b.Method);
      } else if (this.selectedSortOption === 'username') {
        sortingOption = a.Username.localeCompare(b.Username);
      } else if (this.selectedSortOption === 'ipAddress') {
        sortingOption = a.IPAddress.localeCompare(b.IPAddress);
      } else if (this.selectedSortOption === 'timestamp') {
        sortingOption = new Date(a.EventTimeStamp).getTime() - new Date(b.TimeStamp).getTime();
      }

      return sortingOption;
    });
  }
}