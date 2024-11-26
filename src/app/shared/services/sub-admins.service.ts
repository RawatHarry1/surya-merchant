import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { parseUri } from 'angular-in-memory-web-api';
import { SubAdmin } from 'app/routes/sub-admin/sub-admins/sub-admins-dialog/sub-admins-dialog.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubAdminsService {

  constructor(
    private http: HttpClient,
  ) { }

  static readonly apiUrl = 'https://db-json-25aj.onrender.com/sub-admins';

  addSubAdmin(payload: any): Observable<any> {
    return this.http.post(SubAdminsService.apiUrl, payload)
  }

  getSubAdmin():Observable<SubAdmin>{
    return this.http.get<SubAdmin>(SubAdminsService.apiUrl)
  }

  // Function to update the status
  updateStatus(id: string, status: boolean): Observable<any> {
    return this.http.patch(`${SubAdminsService.apiUrl}/${id}`, { status });
  }
}
