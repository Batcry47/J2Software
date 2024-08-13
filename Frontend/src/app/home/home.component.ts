import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BackendConnectionService } from '../backend-connection.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
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

  inactivityTimer: any;
  INACTIVITY_TIMEOUT = 30000;
  user_id = 0;
  constructor(public router: Router, private route: ActivatedRoute, private backendService: BackendConnectionService) {
    this.startEvents();
  }

  ngOnInit(): void {
    this.startInactivityTimer();
  }

  startEvents() {
    window.addEventListener("mousemove", this.resetInactivityTimer.bind(this));
    window.addEventListener("keydown", this.resetInactivityTimer.bind(this));
  }

  minEndDate(startDate: HTMLInputElement, endDate: HTMLInputElement) {
    if (startDate.value !== "yyyy/mm/dd") {
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
    this.router.navigate(['/dashboard'], {
      queryParams: { category: category }
    });
  }
  displayAlertCounts() {
    this.backendService.getImpactAlerts().subscribe(impactCount => {
      this.impactAlerts = impactCount.impact;
    });

    this.backendService.getCollectionAlerts().subscribe(collectionCount => {
      this.collectionAlerts = collectionCount.collection;
    });

    this.backendService.getPersistenceAlerts().subscribe(persistenceCount => {
      this.persistenceAlerts = persistenceCount.persistence;
    });

    this.backendService.getExfiltrationAlerts().subscribe(exfiltrationCount => {
      this.exfiltrationAlerts = exfiltrationCount.exfiltration;
    });

    this.backendService.getEscalationAlerts().subscribe(escalationCount => {
      this.privilegeEscalationAlerts = escalationCount.privilegeEscalation;
    });

    this.backendService.getInitalAccessAlerts().subscribe(initialAccessCount => {
      this.initialAccessAlerts = initialAccessCount.initialAccess;
    });

    this.backendService.getEvasionAlerts().subscribe(evasionCount => {
      this.defenceEvasionAlerts = evasionCount.evasion;
    });

    this.backendService.getReconissanceAlerts().subscribe(reconnissanceCount => {
      this.reconnaissanceAlerts = reconnissanceCount.reconissance;
    });

    this.backendService.getExecutionAlerts().subscribe(executionCount => {
      this.executionAlerts = executionCount.execution;
    });

    this.backendService.getResourceDevelopmentAlerts().subscribe(resourceDevCount => {
      this.resourceDevelopmentAlerts = resourceDevCount.resourceDevelopment;
    });

    this.totalAlerts = (this.impactAlerts + this.collectionAlerts + this.defenceEvasionAlerts +
      this.exfiltrationAlerts + this.initialAccessAlerts + this.persistenceAlerts + this.privilegeEscalationAlerts
      + this.reconnaissanceAlerts + this.executionAlerts + this.resourceDevelopmentAlerts);
    this.maliciousAlerts += this.totalAlerts;
  }

  /*
  displayScheduledAlertCounts(){
    this.backendService.getScheduledImpactAlerts(startDateInput, endDateInput).subscribe(impactCount => {
      this.impactAlerts = impactCount.impact;
    });

    this.backendService.getScheduledCollectionAlerts().subscribe(collectionCount => {
      this.collectionAlerts = collectionCount.collection;
    });

    this.backendService.getScheduledPersistenceAlerts().subscribe(persistenceCount => {
      this.collectionAlerts = persistenceCount.persistence;
    });

    this.backendService.getScheduledExfiltrationAlerts().subscribe(exfiltrationCount => {
      this.collectionAlerts = exfiltrationCount.exfiltration;
    });

    this.backendService.getScheduledEscalationAlerts().subscribe(escalationCount => {
      this.collectionAlerts = escalationCount.escalation;
    });
    
    this.backendService.getScheduledInitalAccessAlerts().subscribe(initialAccessCount => {
      this.collectionAlerts = initialAccessCount.initialAccess;
    });

    this.backendService.getScheduledEvasionAlerts().subscribe(evasionCount => {
      this.collectionAlerts = evasionCount.evasion;
    });
  }
    */

}