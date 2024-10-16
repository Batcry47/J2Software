import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BackendConnectionService } from '../backend-connection.service';
import { StylingService } from '../styling.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // totalAlerts: number = 0;
  @ViewChild('startDateInput') startDateInput: ElementRef<HTMLInputElement>;
  @ViewChild('endDateInput') endDateInput: ElementRef<HTMLInputElement>;
  impactAlerts: number = 0;
  maliciousAlerts: number = 0;
  initialAccessAlerts: number = 0;
  defenceEvasionAlerts: number = 0;
  exfiltrationAlerts: number = 0;
  collectionAlerts: number = 0;
  privilegeEscalationAlerts: number = 0;
  persistenceAlerts: number = 0;
  reconnaissanceAlerts: number = 0;
  executionAlerts: number = 0;
  resourceDevelopmentAlerts: number = 0;
  inactivityTimer: any;
  selectedLanguage: string;
  INACTIVITY_TIMEOUT = 30000;
  user_id = 0;
  constructor(public router: Router,
    private route: ActivatedRoute,
    private backendService: BackendConnectionService,
    private styleService: StylingService,
    private translate: TranslateService) {
    this.startEvents();
  }

  ngOnInit(): void {
    this.startInactivityTimer();
    this.displayAlertCounts();
  }

  startEvents() {
    window.addEventListener("mousemove", this.resetInactivityTimer.bind(this));
    window.addEventListener("keydown", this.resetInactivityTimer.bind(this));
  }

  minEndDate(startDate: HTMLInputElement, endDate: HTMLInputElement) {
    if (startDate.value !== "yyyy/mm/dd") {
      endDate.min = startDate.value;
      this.updateAlertCount()
      if (endDate.value < startDate.value) {
        endDate.value = startDate.value;
      }
    }
  }

  updateAlertCount() {
    this.displayAlertCounts(this.startDateInput.nativeElement, this.endDateInput.nativeElement)
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
    this.inactivityTimer = setTimeout(this.showLogoutPrompt.bind(this), this.INACTIVITY_TIMEOUT);
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

  navigateToDashboard(category: string) {
    this.router.navigate(['/dashboard'], { queryParams: { category: category } });
  }

  displayAlertCounts(startDate?: HTMLInputElement, endDate?: HTMLInputElement) {
    this.backendService.getImpactAlerts(startDate, endDate).subscribe(impactCount => {
      this.impactAlerts = impactCount.Impact;
    });

    this.backendService.getCollectionAlerts(startDate, endDate).subscribe(collectionCount => {
      this.collectionAlerts = collectionCount.Collection;
    });

    this.backendService.getPersistenceAlerts(startDate, endDate).subscribe(persistenceCount => {
      this.persistenceAlerts = persistenceCount.Persistence;
    });

    this.backendService.getExfiltrationAlerts(startDate, endDate).subscribe(exfiltrationCount => {
      this.exfiltrationAlerts = exfiltrationCount.Exfiltration;
    });

    this.backendService.getEscalationAlerts(startDate, endDate).subscribe(escalationCount => {
      this.privilegeEscalationAlerts = escalationCount.Escalation;
    });

    this.backendService.getInitialAccessAlerts(startDate, endDate).subscribe(initialAccessCount => {
      this.initialAccessAlerts = initialAccessCount.InitialAccess;
    });

    this.backendService.getEvasionAlerts(startDate, endDate).subscribe(evasionCount => {
      this.defenceEvasionAlerts = evasionCount.DefenseEvasion;
    });

    this.backendService.getReconnissanceAlerts(startDate, endDate).subscribe(reconnaissanceCount => {
      this.reconnaissanceAlerts = reconnaissanceCount.Reconnaissance;
    });

    this.backendService.getExecutionAlerts(startDate, endDate).subscribe(executionCount => {
      this.executionAlerts = executionCount.Execution;
    });

    this.backendService.getResourceDevelopmentAlerts(startDate, endDate).subscribe(resourceDevCount => {
      this.resourceDevelopmentAlerts = resourceDevCount.ResourceDevelopment;
    });
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

  changeLanguage(language: string) {
    this.translate.use(language);
    this.styleService.setLanguage = language;
  }
}