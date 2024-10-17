import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class StylingService {
    darkModeToggled = false;
    biggerText = false;
    setLanguage: string;
    toggleDarkMode() {
        this.darkModeToggled = !this.darkModeToggled;
    }

    isDarkModeEnabled() {
        return this.darkModeToggled;
    }

    toggleBiggerText() {
        this.biggerText = !this.biggerText;
    }

    isBiggerTextEnabled() {
        return this.biggerText;
    }

    applyTheme() {
        if (this.darkModeToggled) {
          document.body.style.backgroundImage = 'url("assets/images/background_image_dark.jpg")';
          document.body.style.color = '#ffffff';
        } else {
          // Apply light mode styles
          document.body.style.backgroundImage = 'url("assets/images/background_image.png")';
          document.body.style.color = '#000000';
        }
      }
}