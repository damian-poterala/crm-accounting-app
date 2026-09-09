import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})

export class FileService {
    private http = inject(HttpClient);

    getFiles(clientId: any) {
        return this.http.get<any>(`${ environment.apiUrl }/file/${ clientId }/files`);
    } 

    remove(clientId: any, fileId: any) {
        return this.http.delete<any>(`${ environment.apiUrl }/file/${ clientId }/files/${ fileId }`);
    }
}