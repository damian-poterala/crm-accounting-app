import { Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class LoadingService {
    private readonly pendingRequest = signal(0);

    readonly loading = signal(false);

    show(): void {
        this.pendingRequest.update(value => value + 1);
        this.loading.set(true);
    }

    hide(): void {
        this.pendingRequest.update(value => Math.max(0, value - 1));

        if(this.pendingRequest() == 0) {
            this.loading.set(false);
        }
    }
}