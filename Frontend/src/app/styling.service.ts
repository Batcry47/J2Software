import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class StylingService {
    darkModeToggled = false;
    biggerText = false;
    setLanguage: string;

    constructor() {
        const storedTheme = localStorage.getItem('darkTheme');
        if (storedTheme) {
            this.darkModeToggled = JSON.parse(storedTheme);
        }

        const storedText = localStorage.getItem('biggerText');
        if (storedText) {
            this.biggerText = JSON.parse(storedText);
        }
    }

    toggleDarkMode() {
        this.darkModeToggled = !this.darkModeToggled;
        localStorage.setItem('darkTheme', JSON.stringify(this.darkModeToggled));
    }

    isDarkModeEnabled() {
        return this.darkModeToggled;
    }

    toggleBiggerText() {
        this.biggerText = !this.biggerText;
        localStorage.setItem('biggerText', JSON.stringify(this.biggerText));
    }

    isBiggerTextEnabled() {
        return this.biggerText;
    }
}