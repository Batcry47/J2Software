import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BackendConnectionService } from '../backend-connection.service';
import { Chart, registerables } from 'chart.js';
import { forkJoin } from 'rxjs';

Chart.register(...registerables);

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
  selectedSortOption: string;
  selectedCategory: string;
  isFilterCollapsed = true;
  originalResults: any[] = [];
  results = [];
  archivedResults: any[] = [];
  searchQuery: string = '';
  selectedRows: any[] = [];
  hoveredRows: Set<any> = new Set();
  chart: any;
  informationalSeverityAlerts: number;
  lowSeverityAlerts: number;
  mediumSeverityAlerts: number;
  highSeverityAlerts: number;
  criticalSeverityAlerts: number;
  showArchive: boolean = false;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private backendService: BackendConnectionService
  ) { }

  ngOnInit(): void {
    this.createDonutChart();
    this.fetchData();
    this.startEvents();
    this.startInactivityTimer();
  }

  createDonutChart() {
    const ctx = document.getElementById('severityChart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Informational', 'Low', 'Medium', 'High', 'Critical'],
        datasets: [{
          data: [0, 0, 0, 0, 0],
          backgroundColor: [
            'rgba(3, 169, 244, 0.8)',
            'rgba(76, 175, 80, 0.8)',
            'rgba(255, 152, 0, 0.8)',
            'rgba(244, 67, 54, 0.8)',
            'rgba(183, 28, 28, 0.8)'
          ],
          borderColor: [
            'rgba(3, 169, 244, 1)',
            'rgba(76, 175, 80, 1)',
            'rgba(255, 152, 0, 1)',
            'rgba(244, 67, 54, 1)',
            'rgba(183, 28, 28, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  fetchData() {
    forkJoin({
      informational: this.backendService.getInformationalAlertCount(),
      low: this.backendService.getLowAlertCount(),
      medium: this.backendService.getMediumAlertCount(),
      high: this.backendService.getHighAlertCount(),
      critical: this.backendService.getCriticalAlertCount(),
      eventLogs: this.showArchive ? this.backendService.getArchivedEventLogs() : this.backendService.getEventLogs()
    }).subscribe(
      (results) => {
        this.informationalSeverityAlerts = results.informational.Informational;
        this.lowSeverityAlerts = results.low.Low;
        this.mediumSeverityAlerts = results.medium.Medium;
        this.highSeverityAlerts = results.high.High;
        this.criticalSeverityAlerts = results.critical.Critical;

        this.updateChartData([
          this.informationalSeverityAlerts,
          this.lowSeverityAlerts,
          this.mediumSeverityAlerts,
          this.highSeverityAlerts,
          this.criticalSeverityAlerts
        ]);

        if (this.showArchive) {
          this.archivedResults = results.eventLogs.ArchivedEventLogs;
        } else {
          this.originalResults = results.eventLogs.Eventlogs;
          this.results = this.originalResults;
        }

        this.route.queryParams.subscribe(params => {
          const category = params['category'];
          if (category) {
            this.applyCategoryFilter(category);
          } else {
            this.filterResults();
          }
        });
      }
    );
  }

  updateChartData(newData: number[]) {
    if (this.chart && this.chart.data && this.chart.data.datasets) {
      this.chart.data.datasets[0].data = newData;
      this.chart.update();
    }
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

    this.updateChartData(this.calculateSeverityCounts());
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

    this.updateChartData(this.calculateSeverityCounts());
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
    this.updateChartData(this.calculateSeverityCounts());
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

  calculateSeverityCounts(): number[] {
    const severityLevels = ['Informational', 'Low', 'Medium', 'High', 'Critical'];
    const resultsToCount = this.showArchive ? this.archivedResults : this.results;
    return severityLevels.map(severity =>
      resultsToCount.filter(result => result.Severity.toLowerCase() === severity.toLowerCase()).length
    );
  }

  archiveSelectedRows() {
    const archivePromises = this.selectedRows.map(row =>
      this.backendService.archiveEventLog(row.EventID).toPromise()
    );

    Promise.all(archivePromises)
      .then(() => {
        console.log('Archiving completed');
        this.fetchData();
        this.selectedRows = [];
      })
      .catch(error => {
        console.error('Error archiving rows:', error);
      });
  }

  unarchiveSelectedRows() {
    const unarchivePromises = this.selectedRows.map(row =>
      this.backendService.unarchiveEventLog(row.EventID).toPromise()
    );

    Promise.all(unarchivePromises)
      .then(() => {
        console.log('Unarchiving completed');
        this.fetchData();
        this.selectedRows = [];
      })
      .catch(error => {
        console.error('Error unarchiving rows:', error);
      });
  }

  toggleView() {
    this.showArchive = !this.showArchive;
    this.fetchData();
  }
}