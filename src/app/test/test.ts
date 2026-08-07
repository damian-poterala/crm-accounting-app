import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-test',
  standalone: true,
  templateUrl: './test.html',
})
export class Test {

  private http = inject(HttpClient);

  data = signal<any[]>([]);

  ngOnInit(): void {

    this.http
      .get<any[]>('https://jsonplaceholder.typicode.com/users')
      .subscribe({
        next: (response) => {

          console.log(response);

          this.data.set(response);

        },
        error: (err) => {
          console.error(err);
        }
      });

  }
}