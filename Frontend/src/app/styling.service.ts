import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Injectable({
    providedIn: 'root'
})
export class StylingService {
    darkModeToggled = false;
    biggerText = false;
    setLanguage: string = 'en';

    constructor(private translate: TranslateService) {
        const storedTheme = localStorage.getItem('darkTheme');
        if (storedTheme) {
            this.darkModeToggled = JSON.parse(storedTheme);
        }

        const storedText = localStorage.getItem('biggerText');
        if (storedText) {
            this.biggerText = JSON.parse(storedText);
        }

        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage) {
            this.setLanguage = savedLanguage;
        } else {
            this.setLanguage = 'en';
            localStorage.setItem('language', 'en');
        }
    }

    changeLanguage(lang: string) {
        this.setLanguage = lang;
        this.translate.use(lang);
        localStorage.setItem('selectedLanguage', lang);
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