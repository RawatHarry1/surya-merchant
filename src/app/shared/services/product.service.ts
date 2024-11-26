import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { apiUrl } from './apiUrl';
import { CommonService } from './common.service';
import { TokenService } from '@core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private BASE_URL: any;
  private END_POINT: any;
  protected readonly commonServices = inject(CommonService);
  constructor(private tokenService: TokenService, private http: HttpClient, private commonService: CommonService) {
    this.BASE_URL = environment.inventory_url;
    this.END_POINT = apiUrl;
  }

  /**
   * Used to add product.
   * @param body 
   * @returns 
   */
  createProduct(body: any) {
    const headers = this.commonServices.getHeadersWithToken();
    return this.http.post(`${this.BASE_URL}${this.END_POINT.product}`, body, { headers })
  }

  /**
   * Used to get product varient.
   * @returns 
   */
  getProductVarientName() {
    const headers = this.commonServices.getHeadersWithToken();
    return this.http.get(`${this.BASE_URL}${this.END_POINT.productVarient}`, { headers });
  }

  /**
   * get varient option list.
   * @param varientId 
   * @returns 
   */
  getVarientOptionListById(varientId: any) {
    const headers = this.commonServices.getHeadersWithToken();
    return this.http.get(`${this.BASE_URL}${this.END_POINT.productVarient}/options/${varientId}`, { headers });
  }

  /* GET Product List  */
  getProductList(param?: any): Observable<any> {
    const headers = this.commonServices.getHeadersWithToken();
    return this.http.get(`${this.BASE_URL}${this.END_POINT.productList}`, {
      headers,
      params: param ? param : {}
    });
  }

  // Method to update the product status
  updateStatus(serialNumber: string) {
    const headers = this.commonServices.getHeadersWithToken();
    const url = `${this.BASE_URL}product/changeStatus/${serialNumber}`;
    return this.http.put(url, {}, { headers });
  }

  /**
   * used to get product detail by id.
   * @param productId 
   * @returns 
   */
  getProductDetailById(productId: any) {
    const headers = this.commonServices.getHeadersWithToken();
    return this.http.get(`${this.BASE_URL}${this.END_POINT.product}/${this.END_POINT.productDetail}${productId}`, { headers });
  }

  /**
   * used to update product detail.
   * @param body 
   * @param productDetailId 
   * @returns 
   */
  updateProductDetailById(body: any, productDetailId: any) {
    const headers = this.commonServices.getHeadersWithToken();
    return this.http.put(`${this.BASE_URL}${this.END_POINT.product}/${productDetailId}`, body, { headers });
  }

  /**
   * used to update product image.
   * @param body 
   * @param productDetailId 
   * @returns 
   */
  updateProductImage(body: any, productDetailId: any) {
    const headers = this.commonServices.getHeadersWithToken();
    return this.http.put(`${this.BASE_URL}${this.END_POINT.productMedia}`, body, { headers })
  }

  /**
   * used to delete product by id.
   * @param productDetailId
   * @returns 
   */
  deleteProductById(productDetailId: any) {
    const headers = this.commonServices.getHeadersWithToken();
    return this.http.delete(`${this.BASE_URL}${this.END_POINT.product}/delete/${productDetailId}`, { headers })
  }

  /**
   * Used to update product varient.
   * @param productDetailId 
   * @param body 
   * @returns 
   */
  updateProductVarientMappingId(productDetailId: any, body: any) {
    const headers = this.commonServices.getHeadersWithToken();
    return this.http.put(`${this.BASE_URL}${this.END_POINT.product}/variant/${productDetailId}`, body, { headers })
  }

  /**
   * Used to add product file.
   * @param body 
   * @returns 
   */
  addProductFile(mediaId: any) {
    const headers = this.commonServices.getHeadersWithToken();
    return this.http.patch(`${this.BASE_URL}${this.END_POINT.productMediaIsDefault}${mediaId}`, {}, { headers })
  }
}
