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
  getInformationalAlertCount(): Observable<{Informational: number}>{
    return this.http.get<{Informational: number}>(`${this.api}/Informational/INFORMATIONAL`);
  }

  getLowAlertCount(): Observable<{Low: number}>{
    return this.http.get<{Low: number}>(`${this.api}/Low/LOW`);
  }

  getMediumAlertCount(): Observable<{Medium: number}>{
    return this.http.get<{Medium: number}>(`${this.api}/Medium/MEDIUM`);
  }

  getHighAlertCount(): Observable<{High: number}>{
    return this.http.get<{High: number}>(`${this.api}/High/HIGH`);
  }

  getCriticalAlertCount(): Observable<{Critical: number}>{
    return this.http.get<{Critical: number}>(`${this.api}/Critical/CRITICAL`);
  }
  //Gets all the events that belong to the user currently logged in
  getEventLogs(): Observable<EventLogCollection>{
   //const params = new HttpParams().set('user_id', this.user_id);
    return this.http.get<EventLogCollection>(`${this.api}/Eventlogs`);
  }

  getImpactAlerts(): Observable<{Impact: number}> {
    return this.http.get<{Impact: number}>(`${this.api}/Impact/Impact`);
  }
  
  getCollectionAlerts(): Observable<{Collection: number}> {
    return this.http.get<{Collection: number}>(`${this.api}/Collection/Collection`);
  }

  getExfiltrationAlerts(): Observable<{Exfiltration: number}> {
    return this.http.get<{Exfiltration: number}>(`${this.api}/Exfiltration/Exfiltration`);
  }

  getEvasionAlerts(): Observable<{DefenseEvasion: number}> {
    return this.http.get<{DefenseEvasion: number}>(`${this.api}/DefenseEvasion/DefenseEvasion`);
  }

  getPersistenceAlerts(): Observable<{Persistence: number}> {
    return this.http.get<{Persistence: number}>(`${this.api}/Persistence/Persistence`);
  }

  getInitialAccessAlerts(): Observable<{InitialAccess: number}> {
    return this.http.get<{InitialAccess: number}>(`${this.api}/InitialAccess/Initial Access`);
  }

  getEscalationAlerts(): Observable<{Escalation: number}>{
    return this.http.get<{Escalation: number}>(`${this.api}/PrivilegeEscalation/Privilege Escalation`);
  }

  getReconnissanceAlerts(): Observable<{Reconnaissance: number}>{
    return this.http.get<{Reconnaissance: number}>(`${this.api}/Reconnaissance/Reconnaissance`);
  }

  getExecutionAlerts(): Observable<{Execution: number}>{
    return this.http.get<{Execution: number}>(`${this.api}/Execution/Execution`);
  }
  
  getResourceDevelopmentAlerts(): Observable<{ResourceDevelopment: number}>{
    return this.http.get<{ResourceDevelopment: number}>(`${this.api}/ResourceDevelopment/ResourceDevelopment`);
  }
  
  //Scheduled methods
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
   
}