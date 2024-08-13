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
      this.results = this.originalResults;
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
    this.results = this.originalResults.filter(result =>
      result.Category.toLowerCase().replace(' ', '-') === category
    );
  }

  filterResults() {
    const selectedSeverities = Array.from(document.querySelectorAll('.filter-checkbox[data-severity]:checked'))
      .map((checkbox: HTMLInputElement) => checkbox.getAttribute('data-severity'));
    const selectedCategories = Array.from(document.querySelectorAll('.filter-checkbox[data-category]:checked'))
      .map((checkbox: HTMLInputElement) => checkbox.getAttribute('data-category'));

    this.results = this.originalResults.filter(result => {
      const severityMatch = selectedSeverities.length === 0 || selectedSeverities.includes(result.Severity.toLowerCase());
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(result.Category.toLowerCase().replace(' ', '-'));
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
    this.results.sort((a, b) => {
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
        sortingOption = new Date(a.EventTimeStamp).getTime() - new Date(b.EventTimeStamp).getTime();
      }

      return sortingOption;
    });
  }
}