import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Eventlogs {
  eventID: number;
  category: string;
  method: string;
  username: string;
  ipAddress: string;
  timestamp: Date;
  severity: string;
}
interface EventLogCollection {
  Eventlogs: Eventlogs[]
}
export interface AlertCount {
  alertType: string;
  alertCount: string;
}
@Injectable({
  providedIn: 'root'
})

export class BackendConnectionService {
  user_id: number;
  api = "http://localhost:3000";
  private authCode: string = '';
  private userId: number = 0;
  constructor(private http: HttpClient) { }

  //Gets the user's id based on the email and password entered if it exists
  getInformationalAlertCount(): Observable<{ Informational: number }> {
    return this.http.get<{ Informational: number }>(`${this.api}/Informational/INFORMATIONAL`);
  }

  getLowAlertCount(): Observable<{ Low: number }> {
    return this.http.get<{ Low: number }>(`${this.api}/Low/LOW`);
  }

  getMediumAlertCount(): Observable<{ Medium: number }> {
    return this.http.get<{ Medium: number }>(`${this.api}/Medium/MEDIUM`);
  }

  getHighAlertCount(): Observable<{ High: number }> {
    return this.http.get<{ High: number }>(`${this.api}/High/HIGH`);
  }

  getCriticalAlertCount(): Observable<{ Critical: number }> {
    return this.http.get<{ Critical: number }>(`${this.api}/Critical/CRITICAL`);
  }
  //Gets all the events that belong to the user currently logged in
  getEventLogs(): Observable<EventLogCollection> {
    //const params = new HttpParams().set('user_id', this.user_id);
    return this.http.get<EventLogCollection>(`${this.api}/Eventlogs`);
  }

  getImpactAlerts(startDate?: HTMLInputElement, endDate?: HTMLInputElement): Observable<{ Impact: number }> {
    if (startDate?.value && endDate?.value) {
      const params = new HttpParams().set('start_date', startDate.value + " 00:00:00").set('end_date', endDate.value + " 00:00:00");
      return this.http.get<{ Impact: number }>(`${this.api}/Impact/Impact`, { params });
    }
    else {
      return this.http.get<{ Impact: number }>(`${this.api}/Impact/Impact`);
    }
  }

  getCollectionAlerts(startDate?: HTMLInputElement, endDate?: HTMLInputElement): Observable<{ Collection: number }> {
    if (startDate?.value && endDate?.value) {
      const params = new HttpParams().set('start_date', startDate.value + " 00:00:00").set('end_date', endDate.value + " 00:00:00");
      return this.http.get<{ Collection: number }>(`${this.api}/Collection/Collection`, { params });
    }
    else {
      return this.http.get<{ Collection: number }>(`${this.api}/Collection/Collection`);
    }
  }

  getExfiltrationAlerts(startDate?: HTMLInputElement, endDate?: HTMLInputElement): Observable<{ Exfiltration: number }> {
    if (startDate?.value && endDate?.value) {
      const params = new HttpParams().set('start_date', startDate.value + " 00:00:00").set('end_date', endDate.value + " 00:00:00");
      return this.http.get<{ Exfiltration: number }>(`${this.api}/Exfiltration/Exfiltration`, { params });
    }
    else {
      return this.http.get<{ Exfiltration: number }>(`${this.api}/Exfiltration/Exfiltration`);
    }
  }

  getEvasionAlerts(startDate?: HTMLInputElement, endDate?: HTMLInputElement): Observable<{ DefenseEvasion: number }> {
    if (startDate?.value && endDate?.value) {
      const params = new HttpParams().set('start_date', startDate.value + " 00:00:00").set('end_date', endDate.value + " 00:00:00");
      return this.http.get<{ DefenseEvasion: number }>(`${this.api}/DefenseEvasion/DefenseEvasion`, { params });
    }
    else {
      return this.http.get<{ DefenseEvasion: number }>(`${this.api}/DefenseEvasion/DefenseEvasion`);
    }
  }

  getPersistenceAlerts(startDate?: HTMLInputElement, endDate?: HTMLInputElement): Observable<{ Persistence: number }> {
    if (startDate?.value && endDate?.value) {
      const params = new HttpParams().set('start_date', startDate.value + " 00:00:00").set('end_date', endDate.value + " 00:00:00");
      return this.http.get<{ Persistence: number }>(`${this.api}/Persistence/Persistence`, { params });
    }
    else {
      return this.http.get<{ Persistence: number }>(`${this.api}/Persistence/Persistence`);
    }
  }

  getInitialAccessAlerts(startDate?: HTMLInputElement, endDate?: HTMLInputElement): Observable<{ InitialAccess: number }> {
    if (startDate?.value && endDate?.value) {
      const params = new HttpParams().set('start_date', startDate.value + " 00:00:00").set('end_date', endDate.value + " 00:00:00");
      return this.http.get<{ InitialAccess: number }>(`${this.api}/InitialAccess/Initial Access`, { params });
    }
    else {
      return this.http.get<{ InitialAccess: number }>(`${this.api}/InitialAccess/Initial Access`);
    }

  }

  getEscalationAlerts(startDate?: HTMLInputElement, endDate?: HTMLInputElement): Observable<{ Escalation: number }> {
    if (startDate?.value && endDate?.value) {
      const params = new HttpParams().set('start_date', startDate.value + " 00:00:00").set('end_date', endDate.value + " 00:00:00");
      return this.http.get<{ Escalation: number }>(`${this.api}/PrivilegeEscalation/Privilege Escalation`, { params });
    }
    else {
      return this.http.get<{ Escalation: number }>(`${this.api}/PrivilegeEscalation/Privilege Escalation`);
    }
  }

  getReconnissanceAlerts(startDate?: HTMLInputElement, endDate?: HTMLInputElement): Observable<{ Reconnaissance: number }> {
    if (startDate?.value && endDate?.value) {
      const params = new HttpParams().set('start_date', startDate.value + " 00:00:00").set('end_date', endDate.value + " 00:00:00");
      return this.http.get<{ Reconnaissance: number }>(`${this.api}/Reconnaissance/Reconnaissance`, { params });
    }
    else {
      return this.http.get<{ Reconnaissance: number }>(`${this.api}/Reconnaissance/Reconnaissance`);
    }
  }

  getExecutionAlerts(startDate?: HTMLInputElement, endDate?: HTMLInputElement): Observable<{ Execution: number }> {
    if (startDate?.value && endDate?.value) {
      const params = new HttpParams().set('start_date', startDate.value + " 00:00:00").set('end_date', endDate.value + " 00:00:00");
      return this.http.get<{ Execution: number }>(`${this.api}/Execution/Execution`, { params });
    }
    else {
      return this.http.get<{ Execution: number }>(`${this.api}/Execution/Execution`);
    }
  }

  getResourceDevelopmentAlerts(startDate?: HTMLInputElement, endDate?: HTMLInputElement): Observable<{ ResourceDevelopment: number }> {
    if (startDate?.value && endDate?.value) {
      const params = new HttpParams().set('start_date', startDate.value + " 00:00:00").set('end_date', endDate.value + " 00:00:00");
      return this.http.get<{ ResourceDevelopment: number }>(`${this.api}/ResourceDevelopment/ResourceDevelopment`, { params });
    }
    else {
      return this.http.get<{ ResourceDevelopment: number }>(`${this.api}/ResourceDevelopment/ResourceDevelopment`);
    }
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.api}/login`, { username, password });
  }

  verifyAuthCode(userId: number, authCode: string): Observable<any> {
    return this.http.post(`${this.api}/verify-auth`, { userId, authCode });
  }

  setAuthCode(code: string) {
    this.authCode = code;
  }

  getAuthCode(): string {
    return this.authCode;
  }

  setUserId(id: number) {
    this.userId = id;
  }

  getUserId(): number {
    return this.userId;
  }

  resendCode(userId: number): Observable<any> {
    return this.http.post(`${this.api}/resend-code`, { userId });
  }

  getArchivedEventLogs(): Observable<any> {
    return this.http.get(`${this.api}/archived-eventlogs`);
  }

  archiveEventLog(eventId: number): Observable<any> {
    return this.http.post(`${this.api}/archive/${eventId}`, {});
  }

  unarchiveEventLog(eventId: number): Observable<any> {
    return this.http.post(`${this.api}/unarchive/${eventId}`, {});
  }
}