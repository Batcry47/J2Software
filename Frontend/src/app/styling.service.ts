import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class StylingService{
    darkModeToggled = false;
    
    toggleDarkMode(){
        this.darkModeToggled = !this.darkModeToggled;
    }

    isDarkModeEnabled(){
        return this.darkModeToggled;
    }
}