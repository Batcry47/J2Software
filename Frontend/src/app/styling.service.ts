import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class StylingService {

    constructor(){
        const storedTheme = localStorage.getItem('darkTheme');
        if (storedTheme) {
          this.darkModeToggled = JSON.parse(storedTheme);
        }

        const storedText = localStorage.getItem('textToggle');
        if (storedText){
            this.biggerText = JSON.parse(storedText)
        }
    }
    darkModeToggled = false;
    biggerText = false;
    setLanguage: string;
    toggleDarkMode() {
        this.darkModeToggled = !this.darkModeToggled;
        localStorage.setItem('darkTheme', JSON.stringify(this.darkModeToggled));
    }

    isDarkModeEnabled() {
        return this.darkModeToggled;
    }

    toggleBiggerText() {
        this.biggerText = !this.biggerText;
        localStorage.setItem('textToggle', JSON.stringify(this.darkModeToggled));
    }

    isBiggerTextEnabled() {
        return this.biggerText;
    }

}