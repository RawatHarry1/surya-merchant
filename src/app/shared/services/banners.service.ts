import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Banner } from 'app/routes/marketing/banners/banners-dialog/banners-dialog.component';
import { Observable } from 'rxjs';
import { CommonService } from './common.service';
import { environment } from '@env/environment';
import { apiUrl } from './apiUrl';

@Injectable({
  providedIn: 'root'
})
export class BannersService {

  static readonly apiUrl = 'https://db-json-25aj.onrender.com/banners'
  private BASE_URL: any;
  private END_POINT: any;

  constructor(private http: HttpClient, private commonServices: CommonService) {
    this.BASE_URL = environment.inventory_url;
    this.END_POINT = apiUrl;
  }

  addBanner(payload: any): Observable<any> {
    return this.http.post(BannersService.apiUrl, payload);
  }

  getBanner(): Observable<Banner> {
    return this.http.get<Banner>(BannersService.apiUrl)
  }

  updateBanner(payload: any, id: string): Observable<Banner> {
    return this.http.put<Banner>(`${BannersService.apiUrl}/${id}`, payload)
  }

  deleteBanner(id: string): Observable<Banner> {
    return this.http.delete<Banner>(`${BannersService.apiUrl}/${id}`)
  }


  // Working App banner services

  /**
   * Used to add banner.
   * @param body 
   * @returns 
   */
  addAppBanner(body: any) {
    const headers = this.commonServices.getHeadersWithToken();
    return this.http.post(`${this.BASE_URL}${this.END_POINT.addBanner}`, body, { headers })
  }

  /**
   * Used to update banner.
   * @param bannerId 
   * @param body 
   * @returns 
   */
  updateAppBanner(bannerId: any, body: any) {
    const headers = this.commonServices.getHeadersWithToken();
    return this.http.put(`${this.BASE_URL}${this.END_POINT.updateBanner}${bannerId}`, body, { headers })
  }

  /**
   * Used to get banner list.
   * @param pageNumber 
   * @param pageSize 
   * @returns 
   */
  getAppBannerList(params?: any) {
    const headers = this.commonServices.getHeadersWithToken();
    return this.http.get(`${this.BASE_URL}${this.END_POINT.bannerList}`, {
      headers,
      params: params ? params : {}
    })
  }

  /**
   * Used to Delete by id.
   * @param bannerId 
   * @returns 
   */
  deleteAppBannerById(bannerId: any) {
    const headers = this.commonServices.getHeadersWithToken();
    return this.http.delete(`${this.BASE_URL}${this.END_POINT.bannerDelete}${bannerId}`, { headers })
  }

  /**
   * Used to change status by id.
   * @param bannerId 
   * @returns 
   */
  changeBannerStatusById(bannerId: any) {
    const headers = this.commonServices.getHeadersWithToken();
    return this.http.patch(`${this.BASE_URL}${this.END_POINT.bannerChangeStatus}${bannerId}`, {}, { headers })
  }
}
