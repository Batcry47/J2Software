import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Eventlogs{
  eventID: number;
  category: string;
  method: string;
  username: string;
  ipAddress: string;
  timestamp: Date;
  severity: string;
}
interface EventLogCollection{
  Eventlogs: Eventlogs[]
}
export interface AlertCount{
  alertType: string;
  alertCount: string;
}
@Injectable({
  providedIn: 'root'
})

export class BackendConnectionService {
  user_id: number;
  api = "http://localhost:3000";
  constructor(private http: HttpClient) { }

  //Gets the user's id based on the email and password entered if it exists
  
  //Gets all the events that belong to the user currently logged in
  getEventLogs(): Observable<EventLogCollection>{
   //const params = new HttpParams().set('user_id', this.user_id);
    return this.http.get<EventLogCollection>(`${this.api}/Eventlogs`);
  }

  //Returns the total number of each type of alert (incomplete)
  getAlertCount(): Observable<AlertCount[]>{
    return this.http.get<AlertCount[]>(`${this.api}/count-logs`);
  }

  //Returns the number of each type of alert based on the start and end date  highlighted by the user
  getDatedAlertCount(startDate: string, endDate: string): Observable<AlertCount[]>{
    const params = new HttpParams().set('start_date', startDate).set('end_date', endDate);
    return this.http.get<AlertCount[]>(`${this.api}/dated-alert-count`, {params});
  }
 
}