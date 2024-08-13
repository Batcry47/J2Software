import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { BackendConnectionService } from '../backend-connection.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  @ViewChild('startDateInput') startDateInput!: ElementRef<HTMLInputElement>;
  @ViewChild('endDateInput') endDateInput!: ElementRef<HTMLInputElement>;
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
  inactivityTimer: any;
  INACTIVITY_TIMEOUT = 30000;

  constructor(public route: Router, private renderer: Renderer2, private backendService: BackendConnectionService) { }

  ngOnInit(): void {
    this.startEvents();
    this.startInactivityTimer();
    this.displayAlertCounts();
  }

  startEvents() {
    window.addEventListener("mousemove", this.resetInactivityTimer.bind(this));
    window.addEventListener("keydown", this.resetInactivityTimer.bind(this));
  }


  minEndDate(startDate: HTMLInputElement, endDate: HTMLInputElement) {
    if (startDate.value !== "") {
      endDate.min = startDate.value;
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
  displayAlertCounts() {
    this.backendService.getImpactAlerts().subscribe(impactCount => {
      this.impactAlerts = impactCount.Impact;
    });

    this.backendService.getCollectionAlerts().subscribe(collectionCount => {
      this.collectionAlerts = collectionCount.Collection;
    });

    this.backendService.getPersistenceAlerts().subscribe(persistenceCount => {
      this.persistenceAlerts = persistenceCount.Persistence;
    });

    this.backendService.getExfiltrationAlerts().subscribe(exfiltrationCount => {
      this.exfiltrationAlerts = exfiltrationCount.Exfiltration;
    });

    this.backendService.getEscalationAlerts().subscribe(escalationCount => {
      this.privilegeEscalationAlerts = escalationCount.Escalation;
    });

    this.backendService.getInitialAccessAlerts().subscribe(initialAccessCount => {
      this.initialAccessAlerts = initialAccessCount.InitialAccess;
    });

    this.backendService.getEvasionAlerts().subscribe(evasionCount => {
      this.defenceEvasionAlerts = evasionCount.DefenseEvasion;
    });

    this.backendService.getReconnissanceAlerts().subscribe(reconnaissanceCount => {
      this.reconnaissanceAlerts = reconnaissanceCount.Reconnaissance;
    });

    this.backendService.getExecutionAlerts().subscribe(executionCount => {
      this.executionAlerts = executionCount.Execution;
    });

    this.backendService.getResourceDevelopmentAlerts().subscribe(resourceDevCount => {
      this.resourceDevelopmentAlerts = resourceDevCount.ResourceDevelopment;
    });

    this.totalAlerts = (this.impactAlerts + this.collectionAlerts + this.defenceEvasionAlerts +
      this.exfiltrationAlerts + this.initialAccessAlerts + this.persistenceAlerts + this.privilegeEscalationAlerts +
      this.reconnaissanceAlerts + this.executionAlerts + this.resourceDevelopmentAlerts);

    this.maliciousAlerts = this.totalAlerts;
  }
}