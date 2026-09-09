import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})

export class ContactService {
    private http = inject(HttpClient);

    getContactsPerClient(id: any) {
        return this.http.get<any>(`${ environment.apiUrl }/contact/${ id }`);
    }

    create(id: any, data: any) {
        return this.http.post<any>(`${ environment.apiUrl }/contact/${ id }/create`, data);
    }

    update(id: any, data: any) {
        return this.http.put<any>(`${ environment.apiUrl }/contact/${ id }/update`, data);
    }

    remove(id: number) {
        return this.http.delete<any>(`${ environment.apiUrl }/contact/${ id }/remove`);
    }
}