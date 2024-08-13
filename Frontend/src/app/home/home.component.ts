import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BackendConnectionService } from '../backend-connection.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  //totalAlerts: number = 0;
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
    this.displayAlertCounts();

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

    this.backendService.getResourceDevelopmentAlerts().subscribe(resourceDevelopmentCount => {
      this.resourceDevelopmentAlerts = resourceDevelopmentCount.ResourceDevelopment;
    })
    //this.totalAlerts += (this.impactAlerts + this.collectionAlerts + this.defenceEvasionAlerts + this.exfiltrationAlerts + this.initialAccessAlerts + this.persistenceAlerts + this.privilegeEscalationAlerts + this.reconnaissanceAlerts + this.executionAlerts + this.resourceDevelopmentAlerts);
    //this.maliciousAlerts = this.totalAlerts;

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