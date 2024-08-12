import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-factor-authentication',
  templateUrl: './factor-authentication.component.html',
  styleUrls: ['./factor-authentication.component.css']
})
export class FactorAuthenticationComponent implements OnInit {
  authCode = "123456";
  newCode = "";
  codeTimer = 30;
  timer: any;
  popup: HTMLDialogElement | null = null;

  constructor(private route: Router) {}

  ngOnInit(): void {
    this.popup = document.getElementById("popup-box") as HTMLDialogElement;
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
    const popupMessage = document.getElementById("popup-message") as HTMLElement;

    if (this.newCode === "") {
      if (enteredCode !== this.authCode) {
        popupMessage.textContent = "The code entered is either invalid or has expired, please enter the correct code to proceed";
        this.popup.showModal();
      } else {
        clearInterval(this.timer);
        this.route.navigate(['home']);
      }
    } else {
      if (enteredCode !== this.newCode) {
        popupMessage.textContent = "The code entered is either invalid or it has expired, please enter the correct code to proceed";
        this.popup.showModal();
      } else {
        clearInterval(this.timer);
        this.route.navigate(['home']);
      }
    }
  }

  resendCode(): void {
    this.refreshTimer();
    const popupMessage = document.getElementById("popup-message") as HTMLElement;
    popupMessage.textContent = "Code has been resent, please check your email";
    this.popup.showModal();
    this.newCode = "456789";
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
        this.newCode = "1";
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