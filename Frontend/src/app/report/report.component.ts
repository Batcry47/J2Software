import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { BackendConnectionService } from '../backend-connection.service';
import { Chart } from 'chart.js';
import { StylingService } from '../styling.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  @ViewChild('startDateInput') startDateInput: ElementRef<HTMLInputElement>;
  @ViewChild('endDateInput') endDateInput: ElementRef<HTMLInputElement>;

  totalAlerts: number = 0;
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
  clickedButton = false;
  selectedLanguage: string = "";
  inactivityTimer: any;
  INACTIVITY_TIMEOUT = 30000;
  chart: any;
  numOfAlerts = [];

  constructor(public router: Router,
    private renderer: Renderer2,
    private backendService: BackendConnectionService,
    private styleService: StylingService,
    private translate: TranslateService) { }

  ngOnInit(): void {
    this.startEvents();
    this.startInactivityTimer();
    this.displayAlertCounts();
    this.numOfAlerts = [this.impactAlerts, this.initialAccessAlerts, this.defenceEvasionAlerts, this.exfiltrationAlerts,
    this.collectionAlerts, this.privilegeEscalationAlerts, this.persistenceAlerts, this.reconnaissanceAlerts,
    this.executionAlerts, this.resourceDevelopmentAlerts];
  }

  startEvents() {
    window.addEventListener("mousemove", this.resetInactivityTimer.bind(this));
    window.addEventListener("keydown", this.resetInactivityTimer.bind(this));
  }


  minEndDate(startDate: HTMLInputElement, endDate: HTMLInputElement) {
    if (startDate.value !== "") {
      endDate.min = startDate.value;
      this.updateAlertCount()
      if (endDate.value < startDate.value) {
        endDate.value = startDate.value;
      }
    }
  }

  openPrompt() {
    const logoutPrompt = document.getElementById("logout") as HTMLDialogElement;
    logoutPrompt.showModal();
  }

  closePrompt() {
    const logoutPrompt = document.getElementById("logout") as HTMLDialogElement;
    logoutPrompt.close();
  }

  updateAlertCount() {
    this.displayAlertCounts(this.startDateInput.nativeElement, this.endDateInput.nativeElement);
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

  downloadReport() {
    const reportElement = (document.querySelector('.downloaded-report-results') as HTMLElement);
    const reportContent = this.cutHTMLElements((reportElement as HTMLElement).innerHTML)

    const blob = new Blob([reportContent], { type: 'text/plain' });

    const a = this.renderer.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = 'Alert_Report.txt';

    this.renderer.appendChild(document.body, a);
    a.click();
    this.renderer.removeChild(document.body, a);

    window.URL.revokeObjectURL(a.href);
  }

  cutHTMLElements(htmlElement: string) {
    let text = htmlElement.replace(/<\/?[^>]+>/gi, '\n');
    return text.trim();
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

    this.totalAlerts = (this.impactAlerts + this.collectionAlerts + this.defenceEvasionAlerts +
      this.exfiltrationAlerts + this.initialAccessAlerts + this.persistenceAlerts + this.privilegeEscalationAlerts +
      this.reconnaissanceAlerts + this.executionAlerts + this.resourceDevelopmentAlerts);

    this.maliciousAlerts = this.totalAlerts;
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