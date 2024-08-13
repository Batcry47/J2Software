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

  // //Returns the total number of each type of alert (incomplete)
  // getAlertCount(): Observable<AlertCount[]>{
  //   return this.http.get<AlertCount[]>(`${this.api}/count-logs`);
  // }

  getImpactAlerts(): Observable<{impact: number}> {
    return this.http.get<{impact: number}>(`${this.api}/ImpactAlerts`);
  }
  
  getCollectionAlerts(): Observable<{collection: number}> {
    return this.http.get<{collection: number}>(`${this.api}/CollectionAlerts`);
  }

  getExfiltrationAlerts(): Observable<{exfiltration: number}> {
    return this.http.get<{exfiltration: number}>(`${this.api}/ExfiltrationAlerts`);
  }

  getEvasionAlerts(): Observable<{evasion: number}> {
    return this.http.get<{evasion: number}>(`${this.api}/EvasionAlerts`);
  }

  getPersistenceAlerts(): Observable<{persistence: number}> {
    return this.http.get<{persistence: number}>(`${this.api}/PersistenceAlerts`);
  }

  getInitalAccessAlerts(): Observable<{initialAccess: number}> {
    return this.http.get<{initialAccess: number}>(`${this.api}/InitialAccessAlerts`);
  }

  getEscalationAlerts(): Observable<{privilegeEscalation: number}>{
    return this.http.get<{privilegeEscalation: number}>(`${this.api}/EscalationAlerts`);
  }

  getReconissanceAlerts(): Observable<{reconissance: number}>{
    return this.http.get<{reconissance: number}>(`${this.api}/ReconissanceAlerts`);
  }

  getExecutionAlerts(): Observable<{execution: number}>{
    return this.http.get<{execution: number}>(`${this.api}/ExecutionAlerts`);
  }
  
  getResourceDevelopmentAlerts(): Observable<{resourceDevelopment: number}>{
    return this.http.get<{resourceDevelopment: number}>(`${this.api}/ResourceDevelopmentAlerts`);
  }
  
  getScheduledImpactAlerts(startDate: string, endDate: string): Observable<{impact: number}>{
    const params = new HttpParams().set('start_date', startDate).set('end_date', endDate);
    return this.http.get<{impact: number}>(`${this.api}/ScheduledImpactAlerts`, {params});
  }

  getScheduledCollectionAlerts(startDate: string, endDate: string): Observable<{collection: number}>{
    const params = new HttpParams().set('start_date', startDate).set('end_date', endDate);
    return this.http.get<{collection: number}>(`${this.api}/ScheduledCollectionAlerts`, {params});
  }

  getScheduledPersistenceAlerts(startDate: string, endDate: string): Observable<{persistence: number}>{
    const params = new HttpParams().set('start_date', startDate).set('end_date', endDate);
    return this.http.get<{persistence: number}>(`${this.api}/ScheduledPersistenceAlerts`, {params});
  }

  getScheduledInitialAccessAlerts(startDate: string, endDate: string): Observable<{initialAccess: number}>{
    const params = new HttpParams().set('start_date', startDate).set('end_date', endDate);
    return this.http.get<{initialAccess: number}>(`${this.api}/ScheduledInitialAlerts`, {params});
  }

  getScheduledEvasionAlerts(startDate: string, endDate: string): Observable<{initialAccess: number}>{
    const params = new HttpParams().set('start_date', startDate).set('end_date', endDate);
    return this.http.get<{initialAccess: number}>(`${this.api}/ScheduledEvasionAlerts`, {params});
  }

  getScheduledEscalationAlerts(startDate: string, endDate: string): Observable<{privilegeEscalation: number}>{
    const params = new HttpParams().set('start_date', startDate).set('end_date', endDate);
    return this.http.get<{privilegeEscalation: number}>(`${this.api}/ScheduledEscalationAlerts`, {params});
  }

  getScheduledReconissanceAlerts(startDate: string, endDate: string): Observable<{reconnissance: number}>{
    const params = new HttpParams().set('start_date', startDate).set('end_date', endDate);
    return this.http.get<{reconnissance: number}>(`${this.api}/SecheduledReconnissanceAlerts`, {params});
  }

  getScheduledExecutionAlerts(startDate: string, endDate: string): Observable<{execution: number}>{
    const params = new HttpParams().set('start_date', startDate).set('end_date', endDate);
    return this.http.get<{execution: number}>(`${this.api}/ScheduledExecutionAlerts`, {params});
  }
  

  //Returns the number of each type of alert based on the start and end date  highlighted by the user
  getDatedAlertCount(startDate: string, endDate: string): Observable<AlertCount[]>{
    const params = new HttpParams().set('start_date', startDate).set('end_date', endDate);
    return this.http.get<AlertCount[]>(`${this.api}/dated-alert-count`, {params});
  }
 
}