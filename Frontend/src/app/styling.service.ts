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
}