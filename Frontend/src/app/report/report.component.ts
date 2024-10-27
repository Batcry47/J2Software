import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BackendConnectionService } from '../backend-connection.service';
import { StylingService } from '../styling.service';
import { TranslateService } from '@ngx-translate/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  isDarkTheme: boolean = false;
  selectedLanguage: string = "en";
  inactivityTimer: any;
  INACTIVITY_TIMEOUT = 30000;
  chart: any;
  numOfAlerts = [];
  isWalkthroughActive = false;
  currentStepIndex = 0;
  walkthroughSteps: { title: string; content: string }[] = [];

  constructor(public router: Router,
    private renderer: Renderer2,
    private backendService: BackendConnectionService,
    private styleService: StylingService,
    private translate: TranslateService) { }

  ngOnInit(): void {
    this.isDarkTheme = this.styleService.isDarkModeEnabled();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        sessionStorage.setItem('lastVisitedUrl', event.urlAfterRedirects);
      }
    })
    this.startEvents();
    this.startInactivityTimer();
    this.initializeWalkthroughSteps();
    this.displayAlertCounts();
    this.numOfAlerts = [this.impactAlerts, this.initialAccessAlerts, this.defenceEvasionAlerts, this.exfiltrationAlerts,
    this.collectionAlerts, this.privilegeEscalationAlerts, this.persistenceAlerts, this.reconnaissanceAlerts,
    this.executionAlerts, this.resourceDevelopmentAlerts];
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
      { title: 'WALKTHROUGH.WELCOME-REPORT.TITLE', content: 'WALKTHROUGH.WELCOME-REPORT.CONTENT' },
      { title: 'WALKTHROUGH.DATE_SELECTION.TITLE', content: 'WALKTHROUGH.DATE_SELECTION.CONTENT' },
      { title: 'WALKTHROUGH.DOWNLOAD_REPORT.TITLE', content: 'WALKTHROUGH.DOWNLOAD_REPORT.CONTENT' },
      { title: 'WALKTHROUGH.NAVIGATION.TITLE', content: 'WALKTHROUGH.NAVIGATION.CONTENT' },
      { title: 'WALKTHROUGH.PREFERENCES.TITLE', content: 'WALKTHROUGH.PREFERENCES.CONTENT' }
    ];
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

  async downloadReport() {
    const reportContainer = document.createElement('div');
    reportContainer.style.position = 'absolute';
    reportContainer.style.left = '-9999px';
    reportContainer.style.top = '-9999px';
    reportContainer.style.width = '595px';

    const startDate = this.startDateInput?.nativeElement?.value || '';
    const endDate = this.endDateInput?.nativeElement?.value || '';
    const hasDateRange = startDate && endDate;

    reportContainer.innerHTML = `
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="/assets/images/j2_logo.png" style="width: 80px; height: 77px; margin-bottom: 5px; margin-top: 20px;">
        <h3 style="margin: 0 0 20px 0; color: #c91931; font-size: 18px;">J2 SOFTWARE</h3>
        <h2 style="margin-bottom: 10px; font-size: 16px;">${this.translate.instant('ALERT-HEADING')}</h2>
        ${hasDateRange ? `<h3 style="margin-bottom: 20px; font-size: 14px;">${startDate} - ${endDate}</h3>` : ''}
      </div>
      <div style="display: flex; justify-content: center;">
        <table style="width: 70%; border-collapse: collapse; margin: 0 auto; font-size: 12px;">
          <tbody>
            <tr>
              <td style="border: 1px solid #ddd; padding: 6px;">${this.translate.instant('FILTER-CATEGORIES.Malicious')}</td>
              <td style="border: 1px solid #ddd; padding: 6px;">${this.impactAlerts + this.initialAccessAlerts + this.defenceEvasionAlerts + this.exfiltrationAlerts + this.collectionAlerts + this.privilegeEscalationAlerts + this.persistenceAlerts + this.executionAlerts + this.resourceDevelopmentAlerts + this.reconnaissanceAlerts}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 6px;">${this.translate.instant('FILTER-CATEGORIES.Impact')}</td>
              <td style="border: 1px solid #ddd; padding: 6px;">${this.impactAlerts}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 6px;">${this.translate.instant('FILTER-CATEGORIES.Initial Access')}</td>
              <td style="border: 1px solid #ddd; padding: 6px;">${this.initialAccessAlerts}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 6px;">${this.translate.instant('FILTER-CATEGORIES.Defence Evasion')}</td>
              <td style="border: 1px solid #ddd; padding: 6px;">${this.defenceEvasionAlerts}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 6px;">${this.translate.instant('FILTER-CATEGORIES.Exfiltration')}</td>
              <td style="border: 1px solid #ddd; padding: 6px;">${this.exfiltrationAlerts}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 6px;">${this.translate.instant('FILTER-CATEGORIES.Collection')}</td>
              <td style="border: 1px solid #ddd; padding: 6px;">${this.collectionAlerts}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 6px;">${this.translate.instant('FILTER-CATEGORIES.Privilege Escalation')}</td>
              <td style="border: 1px solid #ddd; padding: 6px;">${this.privilegeEscalationAlerts}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 6px;">${this.translate.instant('FILTER-CATEGORIES.Persistence')}</td>
              <td style="border: 1px solid #ddd; padding: 6px;">${this.persistenceAlerts}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 6px;">${this.translate.instant('FILTER-CATEGORIES.Execution')}</td>
              <td style="border: 1px solid #ddd; padding: 6px;">${this.executionAlerts}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 6px;">${this.translate.instant('FILTER-CATEGORIES.Resource Development')}</td>
              <td style="border: 1px solid #ddd; padding: 6px;">${this.resourceDevelopmentAlerts}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 6px;">${this.translate.instant('FILTER-CATEGORIES.Reconnaissance')}</td>
              <td style="border: 1px solid #ddd; padding: 6px;">${this.reconnaissanceAlerts}</td>
            </tr>
            <tr style="background-color: #c91931; color: white;">
              <td style="border: 1px solid #ddd; padding: 6px;">${this.translate.instant('ALERT-TITLES.total-alerts')}</td>
              <td style="border: 1px solid #ddd; padding: 6px;">${this.impactAlerts + this.initialAccessAlerts + this.defenceEvasionAlerts + this.exfiltrationAlerts + this.collectionAlerts + this.privilegeEscalationAlerts + this.persistenceAlerts + this.executionAlerts + this.resourceDevelopmentAlerts + this.reconnaissanceAlerts}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;

    document.body.appendChild(reportContainer);

    try {
      const canvas = await html2canvas(reportContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        width: 595,
        windowWidth: 595
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = canvas.height * imgWidth / canvas.width;

      const translatedTitle = this.translate.instant('ALERT-HEADING');

      pdf.setProperties({
        title: translatedTitle
      });

      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);

      const pdfOutput = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfOutput);

      const link = document.createElement('a');
      link.href = pdfUrl;
      link.target = '_blank';
      link.download = `${translatedTitle}.pdf`;

      const previewWindow = window.open(pdfUrl);
      if (previewWindow) {
        previewWindow.document.title = translatedTitle;
      }

      link.click();

    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      document.body.removeChild(reportContainer);
    }
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
    this.isDarkTheme = this.styleService.isDarkModeEnabled();
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
    if (!language) {
      language = 'en';
    }
    this.selectedLanguage = language;
    this.translate.use(language);
    this.styleService.setLanguage = language;
    localStorage.setItem('language', language);
  }
}