import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  @ViewChild('startDateInput') startDateInput!: ElementRef<HTMLInputElement>;
  @ViewChild('endDateInput') endDateInput!: ElementRef<HTMLInputElement>;

  clickedButton = false;
  inactivityTimer: any;
  INACTIVITY_TIMEOUT = 30000;

  constructor(public route: Router, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.startEvents();
    this.startInactivityTimer();
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
}