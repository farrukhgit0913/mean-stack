import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div style="text-align: center; margin-top: 50px;">
      <h1>MEAN Stack Environment Test</h1>
      <p>Backend Status: <strong>{{ statusMessage() }}</strong></p>
    </div>

    <router-outlet></router-outlet>
  `,
})
export class App implements OnInit {
  statusMessage = signal('');

  ngOnInit() {
    fetch('http://localhost:3000/api/health')
      .then(res => res.json())
      .then(data => {
        console.log(data);

        this.statusMessage.set('Connecting...');

        setTimeout(() => {
          this.statusMessage.set('Connected');
        }, 1000);
      })
      .catch(err => {
        this.statusMessage.set('Failed to connect to backend.');
        console.error(err);
      });
  }
}