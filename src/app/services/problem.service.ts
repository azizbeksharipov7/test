import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProblemService {
  private baseUrl = 'https://kep.uz/api/problems';

  constructor(private http: HttpClient) {}

  getProblems(
    page: number = 1,
    pageSize: number = 10,
    title: string = '',
    has_checker: string = '',
    has_solution: string = '',
    sortColumn: string = '',
    sortDirection: string = ''
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page)
      .set('page_size', pageSize);

    if (title) params = params.set('title', title);
    if (has_checker) params = params.set('has_checker', has_checker);
    if (has_solution) params = params.set('has_solution', has_solution);
    if (sortColumn) params = params.set('sortColumn', sortColumn);
    if (sortDirection) params = params.set('sortDirection', sortDirection);

    return this.http.get<any>(this.baseUrl, { params });
  }
}
