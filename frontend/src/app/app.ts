import { Component, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div style="text-align: center; margin-top: 50px;">
      <h1>MEAN Stack Environment Test</h1>
      <p>Backend Status: <strong>{{ statusMessage() }}</strong></p>
    </div>
  `,
  standalone: true
})

export class App implements OnInit {
  statusMessage = signal('');
  status = '';

  ngOnInit() {
    fetch('http://localhost:5001/api/health')
      .then(res => res.json())
      .then(data => {
        console.log(data)
        this.statusMessage.set('Connecting...');
        this.status = data.status;

        console.log(this.status, 'this.status');
        
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