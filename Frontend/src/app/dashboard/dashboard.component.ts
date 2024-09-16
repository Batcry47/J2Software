import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BackendConnectionService } from '../backend-connection.service';
import { Chart, registerables } from 'chart.js';
import { forkJoin } from 'rxjs';

Chart.register(...registerables)
export interface EventDetails {
  eventID: number;
  category: string;
  method: string;
  emailAddress: string;
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
  searchQuery: string = '';
  selectedRows: any[] = [];
  hoveredRows: Set<any> = new Set();
  config: any;
  chart: any;
  informationalSeverityAlerts;
  lowSeverityAlerts;
  mediumSeverityAlerts;
  highSeverityAlerts;
  criticalSeverityAlerts;
  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private backendService: BackendConnectionService
  ) { }

  ngOnInit(): void {
    this.getSeverityLevels();
    this.createDonutChart();
    this.backendService.getEventLogs().subscribe(data => {
      this.originalResults = data.Eventlogs;
      this.results = this.originalResults;
      this.route.queryParams.subscribe(params => {
        const category = params['category'];
        if (category) {
          this.applyCategoryFilter(category);
          this.filterResults();
        }
      });
    });
    this.startEvents();
    this.startInactivityTimer();
    this.chart = new Chart('MyChart', this.config)
  }

  createDonutChart(){
    this.config = {
      type: 'doughnut',
      data: {
        labels: [
          'Informational',
          'Low',
          'Medium',
          'High',
          'Critical'
        ],
        datasets: [{
          label: 'Severity Levels',
          data: [this.informationalSeverityAlerts,
          this.lowSeverityAlerts,
          this.mediumSeverityAlerts,
          this.highSeverityAlerts,
          this.criticalSeverityAlerts],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
          hoverOffset: 4
        }]
      }
    };
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
      this.filterResults();
    }
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

  onSearchInput() {
    const query = this.searchQuery.toLowerCase();
    this.results = this.originalResults.filter(result => {
      return result.Category.toLowerCase().includes(query) ||
        result.Method.toLowerCase().includes(query) ||
        result.Username.toLowerCase().includes(query) ||
        result.IPAddress.toLowerCase().includes(query) ||
        result.EventTimeStamp.toLowerCase().includes(query);
    });
  }

  toggleRowSelection(result: any) {
    if (this.selectedRows.includes(result)) {
      this.selectedRows = this.selectedRows.filter(row => row !== result);
    } else {
      this.selectedRows.push(result);
    }
  }

  showCheckbox(result: any) {
    this.hoveredRows.add(result);
  }

  hideCheckbox(result: any) {
    this.hoveredRows.delete(result);
  }

  isRowHovered(result: any): boolean {
    return this.hoveredRows.has(result);
  }

  isRowSelected(result: any): boolean {
    return this.selectedRows.includes(result);
  }

  getSeverityLevels() {
    this.backendService.getInformationalAlertCount().subscribe(
      informationalAlerts => {
        this.informationalSeverityAlerts = informationalAlerts?.Informational;
        console.log(this.informationalSeverityAlerts);
      },
      error => console.error('Error fetching informational alerts:', error)
    );
    this.backendService.getLowAlertCount().subscribe(
      lowAlerts => {
        this.lowSeverityAlerts = lowAlerts?.Low;
        console.log(this.lowSeverityAlerts);
      },
      error => console.error('Error fetching low alerts:', error)
    );
    this.backendService.getMediumAlertCount().subscribe(
      mediumAlerts => {
        this.mediumSeverityAlerts = mediumAlerts?.Medium;
        console.log(this.mediumSeverityAlerts);
      },
      error => console.error('Error fetching medium alerts:', error)
    );
    this.backendService.getHighAlertCount().subscribe(
      highAlerts => {
        this.highSeverityAlerts = highAlerts?.High;
        console.log(this.highSeverityAlerts);
      },
      error => console.error('Error fetching high alerts:', error)
    );
    this.backendService.getCriticalAlertCount().subscribe(
      criticalAlerts => {
        this.criticalSeverityAlerts = criticalAlerts?.Critical;
        console.log(this.criticalSeverityAlerts);
      },
      error => console.error('Error fetching critical alerts:', error)
    );
  }

}