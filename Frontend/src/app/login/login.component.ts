import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BackendConnectionService } from '../backend-connection.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private router: Router, private backendService: BackendConnectionService) { }

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
      this.validateData(enteredUsername, enteredPassword);
    }
  }

  validateData(username: string, password: string) {
    this.backendService.login(username, password).subscribe(
      (response) => {
        this.router.navigate(['factor']);
      },
      (error) => {
        const popup = document.getElementById('popup-box') as HTMLDialogElement;
        popup.showModal();
      }
    );
  }

  closePopup() {
    const popup = document.getElementById('popup-box') as HTMLDialogElement;
    popup.close();
  }
}