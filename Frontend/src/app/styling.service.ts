import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class StylingService{
    darkModeToggled = false;
    setLanguage: string;
    toggleDarkMode(){
        this.darkModeToggled = !this.darkModeToggled;
    }

    isDarkModeEnabled(){
        return this.darkModeToggled;
    }
}