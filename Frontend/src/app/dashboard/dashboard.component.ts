import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BackendConnectionService } from '../backend-connection.service';
import { Chart, registerables } from 'chart.js';
import { forkJoin } from 'rxjs';
import { StylingService } from '../styling.service';
import { TranslateService } from '@ngx-translate/core';
import { transition, trigger } from '@angular/animations';

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
  styleUrls: ['./dashboard.component.css'],
  animations: [
    trigger('noAnimation', [
      transition(':enter', []),
      transition(':leave', [])
    ])
  ]
})
export class DashboardComponent implements OnInit {
  inactivityTimer: any;
  INACTIVITY_TIMEOUT = 30000;
  selectedSortOption: string;
  selectedCategory: string;
  isFilterCollapsed = true;
  originalResults: any[] = [];
  filteredResults: any[] = [];
  archivedResults: any[] = [];
  searchQuery: string = '';
  selectedRows: any[] = [];
  hoveredRows: Set<any> = new Set();
  chart: any;
  selectedLanguage: string;
  informationalSeverityAlerts: number;
  lowSeverityAlerts: number;
  mediumSeverityAlerts: number;
  highSeverityAlerts: number;
  criticalSeverityAlerts: number;
  showArchive: boolean = false;
  isWalkthroughActive = false;
  currentStepIndex = 0;
  isDarkTheme: boolean = false;
  walkthroughSteps: { title: string; content: string }[] = [];
  severityLevelArr = {
    info: "Informational",
    low: 'Low',
    med: 'Medium',
    high: 'High',
    critical: 'Critical'
  }
  sortConfig: { column: string; direction: 'asc' | 'desc' } = { column: '', direction: 'asc' };

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private backendService: BackendConnectionService,
    private styleService: StylingService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.isDarkTheme = this.styleService.isDarkModeEnabled();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        sessionStorage.setItem('lastVisitedUrl', event.urlAfterRedirects);
      }
    })
    this.createDonutChart();
    this.fetchData();
    this.startEvents();
    this.startInactivityTimer();
    this.initializeWalkthroughSteps();
    this.translate.onLangChange.subscribe(() => {
      this.chart.destroy();
      this.fetchData();
      this.createDonutChart();
    })
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      this.selectedLanguage = savedLanguage;
      this.changeLanguage(this.selectedLanguage);
    } else {
      this.changeLanguage(this.selectedLanguage);
    }
  }

  initializeWalkthroughSteps(): void {
    this.walkthroughSteps = [
      { title: 'WALKTHROUGH.WELCOME-DASHBOARD.TITLE', content: 'WALKTHROUGH.WELCOME-DASHBOARD.CONTENT' },
      { title: 'WALKTHROUGH.FILTERS.TITLE', content: 'WALKTHROUGH.FILTERS.CONTENT' },
      { title: 'WALKTHROUGH.SORTING.TITLE', content: 'WALKTHROUGH.SORTING.CONTENT' },
      { title: 'WALKTHROUGH.SEARCH.TITLE', content: 'WALKTHROUGH.SEARCH.CONTENT' },
      { title: 'WALKTHROUGH.ARCHIVING.TITLE', content: 'WALKTHROUGH.ARCHIVING.CONTENT' },
      { title: 'WALKTHROUGH.NAVIGATION.TITLE', content: 'WALKTHROUGH.NAVIGATION.CONTENT' },
      { title: 'WALKTHROUGH.PREFERENCES.TITLE', content: 'WALKTHROUGH.PREFERENCES.CONTENT' }
    ];
  }

  createDonutChart() {
    const ctx = document.getElementById('severityChart') as HTMLCanvasElement;
    this.changeGraphLanguage();
    console.log(this.severityLevelArr)
    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [this.severityLevelArr.info, this.severityLevelArr.low, this.severityLevelArr.med, this.severityLevelArr.high, this.severityLevelArr.critical],
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

  changeGraphLanguage() {
    forkJoin({
      info: this.translate.get('SEVERITY-LEVEL.Informational'),
      low: this.translate.get('SEVERITY-LEVEL.Low'),
      med: this.translate.get('SEVERITY-LEVEL.Medium'),
      high: this.translate.get('SEVERITY-LEVEL.High'),
      critical: this.translate.get('SEVERITY-LEVEL.Critical')
    }).subscribe(severity => {
      this.severityLevelArr.info = severity.info
      this.severityLevelArr.low = severity.low
      this.severityLevelArr.med = severity.med
      this.severityLevelArr.high = severity.high
      this.severityLevelArr.critical = severity.critical
    })

    console.log(this.severityLevelArr);

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
          this.originalResults = this.archivedResults;
        } else {
          this.originalResults = results.eventLogs.Eventlogs;
        }

        this.applyFiltersAndSort();

        this.route.queryParams.subscribe(params => {
          const category = params['category'];
          if (category) {
            this.applyCategoryFilter(category);
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
      this.applyFiltersAndSort();
    }
  }

  applyFiltersAndSort() {
    this.filteredResults = this.originalResults.slice();
    this.filterResults();
    this.sortResults();
    this.searchResults();
    this.updateChartData(this.calculateSeverityCounts());
  }

  filterResults() {
    const selectedSeverities = Array.from(document.querySelectorAll('.filter-checkbox[data-severity]:checked'))
      .map((checkbox: HTMLInputElement) => checkbox.getAttribute('data-severity'));
    const selectedCategories = Array.from(document.querySelectorAll('.filter-checkbox[data-category]:checked'))
      .map((checkbox: HTMLInputElement) => checkbox.getAttribute('data-category'));

    this.filteredResults = this.filteredResults.filter(result => {
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

    this.applyFiltersAndSort();
  }

  clearCategoryFilters() {
    const categoryCheckboxes = document.querySelectorAll('.filter-checkbox[data-category]');
    categoryCheckboxes.forEach((checkbox: HTMLInputElement) => {
      checkbox.checked = false;
    });

    this.applyFiltersAndSort();
  }

  sortColumn(column: string) {
    if (this.sortConfig.column === column) {
      // If clicking the same column, toggle the direction
      this.sortConfig.direction = this.sortConfig.direction === 'asc' ? 'desc' : 'asc';
    } else {
      // If clicking a new column, set it as the sort column with ascending direction
      this.sortConfig.column = column;
      this.sortConfig.direction = 'asc';
    }
    this.applyFiltersAndSort();
  }

  sortResults() {
    this.filteredResults.sort((a, b) => {
      let comparison = 0;
      switch (this.sortConfig.column) {
        case 'category':
          comparison = a.Category.localeCompare(b.Category);
          break;
        case 'method':
          comparison = a.Method.localeCompare(b.Method);
          break;
        case 'username':
          comparison = a.Username.localeCompare(b.Username);
          break;
        case 'ipAddress':
          comparison = a.IPAddress.localeCompare(b.IPAddress);
          break;
        case 'timestamp':
          comparison = new Date(a.EventTimeStamp).getTime() - new Date(b.EventTimeStamp).getTime();
          break;
      }
      return this.sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }

  searchResults() {
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      this.filteredResults = this.filteredResults.filter(result =>
        this.translate.instant('Category.' + result.Category).toLowerCase().includes(query) ||
        this.translate.instant('Method.' + result.Method).toLowerCase().includes(query) ||
        result.Username.toLowerCase().includes(query) ||
        result.IPAddress.toLowerCase().includes(query) ||
        result.EventTimeStamp.toLowerCase().includes(query)
      );
    }
  }

  onFilterChange() {
    this.applyFiltersAndSort();
  }

  onSortChange() {
    this.applyFiltersAndSort();
  }

  onSearchInput() {
    this.applyFiltersAndSort();
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
    return severityLevels.map(severity =>
      this.filteredResults.filter(result => result.Severity.toLowerCase() === severity.toLowerCase()).length
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
    this.selectedRows = [];
    this.fetchData();
  }

  toggleDarkTheme() {
    this.styleService.toggleDarkMode();
  }

  isDarkThemeToggled() {
    return this.styleService.isDarkModeEnabled();
  }

  toggleBiggerText() {
    this.styleService.toggleBiggerText();
  }

  isBiggerTextToggled() {
    return this.styleService.isBiggerTextEnabled();
  }

  get currentStep() {
    return this.walkthroughSteps[this.currentStepIndex];
  }

  startWalkthrough() {
    this.isWalkthroughActive = true;
    this.currentStepIndex = 0;
  }

  nextStep() {
    if (this.currentStepIndex < this.walkthroughSteps.length - 1) {
      this.currentStepIndex++;
    }
  }

  previousStep() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
    }
  }

  endWalkthrough() {
    this.isWalkthroughActive = false;
  }

  changeLanguage(language: string) {
    this.translate.use(language);
    this.styleService.setLanguage = language;
    localStorage.setItem('language', language);
  }
}