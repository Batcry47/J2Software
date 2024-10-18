import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BackendConnectionService } from '../backend-connection.service';

@Component({
  selector: 'app-factor-authentication',
  templateUrl: './factor-authentication.component.html',
  styleUrls: ['./factor-authentication.component.css']
})
export class FactorAuthenticationComponent implements OnInit {
  authCode: string = '';
  newCode = "";
  codeTimer = 30;
  timer: any;
  popup: HTMLDialogElement | null = null;
  location: Location;

  constructor(private router: Router, private backendService: BackendConnectionService) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        sessionStorage.setItem('lastVisitedUrl', event.urlAfterRedirects);
      }
    })
    this.popup = document.getElementById("popup-box") as HTMLDialogElement;
    this.authCode = this.backendService.getAuthCode();
    this.startTimer();
  }

  checkAuthInput(): void {
    const enteredCode = (document.getElementById("authCodeInputBox") as HTMLInputElement).value;
    const userMessage = document.getElementById("user-message") as HTMLElement;

    userMessage.textContent = "";
    userMessage.classList.remove("visible");

    if (enteredCode === "") {
        userMessage.textContent = "Please enter the Authentication code";
        userMessage.classList.add("visible");
    } else {
        this.validateData(enteredCode);
    }
  }

  validateData(enteredCode: string): void {
    if (enteredCode === this.authCode && this.codeTimer !== 0) {
      this.backendService.verifyAuthCode(this.backendService.getUserId(), enteredCode).subscribe(
        (response: any) => {
          clearInterval(this.timer);
          this.router.navigate(['home']);
        },
        (error) => {
          const popupMessage = document.getElementById("popup-message") as HTMLElement;
          popupMessage.textContent = "The code entered is invalid. Please try again.";
          this.popup?.showModal();
        }
      );
    } else {
      const userMessage = document.getElementById("user-message") as HTMLElement;
      userMessage.textContent = "Invalid or expired authentication code. Please check and try again.";
      userMessage.classList.add("visible");
    }
  }

  resendCode(): void {
    this.backendService.resendCode(this.backendService.getUserId()).subscribe(
      (response: any) => {
        this.refreshTimer();

        const popupMessage = document.getElementById("popup-message") as HTMLElement;
        popupMessage.textContent = "Code has been resent, please check your email";
        this.popup?.showModal();

        this.authCode = response.newAuthCode;
      },
      (error) => {
        const popupMessage = document.getElementById("popup-message") as HTMLElement;
        popupMessage.textContent = "Failed to resend code. Please try again.";
        this.popup?.showModal();
      }
    );
  }

  refreshTimer(): void {
    if (this.timer) clearInterval(this.timer);
    this.codeTimer = 30;
    this.startTimer();
  }

  startTimer(): void {
    this.timer = setInterval(() => {
      this.codeTimer--;
      document.getElementById("code-time")!.textContent = `The code expires in ${this.codeTimer} seconds`;

      if (this.codeTimer === 0) {
        clearInterval(this.timer);
        document.getElementById("expiry-message")!.textContent = "The code has expired, please request a new one";
        document.getElementById("code-time")!.textContent = "";
      } else {
        document.getElementById("expiry-message")!.textContent = "";
      }
    }, 1000);
  }

  closePopup(): void {
    this.popup?.close();
  }
}