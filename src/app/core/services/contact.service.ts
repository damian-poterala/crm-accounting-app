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
}