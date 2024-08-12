import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private username = "Thato456";
  private password = "123456";

  constructor(private router: Router) {}

  checkInput() {
    const enteredUsername = (document.getElementById('username') as HTMLInputElement).value;
    const enteredPassword = (document.getElementById('pass') as HTMLInputElement).value;
    const userMessage = document.getElementById('user-message') as HTMLParagraphElement;
    const passMessage = document.getElementById('pass-message') as HTMLParagraphElement;

    if (enteredUsername === "" && enteredPassword !== "") {
      userMessage.textContent = "Please enter your username!";
      passMessage.textContent = "";
    } else if (enteredPassword === "" && enteredUsername !== "") {
      passMessage.textContent = "Please enter your password!";
      userMessage.textContent = "";
    } else if (enteredUsername === "" && enteredPassword === "") {
      userMessage.textContent = "Please enter your username!";
      passMessage.textContent = "Please enter your password!";
    } else {
      userMessage.textContent = "";
      passMessage.textContent = "";
      this.validateData();
    }
  }

  validateData() {
    const enteredUsername = (document.getElementById('username') as HTMLInputElement).value;
    const enteredPassword = (document.getElementById('pass') as HTMLInputElement).value;
    const popup = document.getElementById('popup-box') as HTMLDialogElement;

    if (enteredUsername !== this.username || enteredPassword !== this.password) {
      popup.showModal();
    } else {
      this.router.navigate(['factor']);
    }
  }

  closePopup() {
    const popup = document.getElementById('popup-box') as HTMLDialogElement;
    popup.close();
  }
}