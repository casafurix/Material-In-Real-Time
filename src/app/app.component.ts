import { Component, HostListener } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'material-in-real-time';
  
  constructor(private router: Router) {}
  
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Ctrl+I for Composer
    if (event.ctrlKey && event.key === 'i') {
      console.log('Composer shortcut triggered');
      event.preventDefault();
      // Add your composer action here
    }
    
    // Ctrl+Shift+L for Chat
    if (event.ctrlKey && event.shiftKey && event.key === 'L') {
      console.log('Chat shortcut triggered');
      event.preventDefault();
      // Add your chat action here
    }
    
    // Ctrl+K to generate a command
    if (event.ctrlKey && event.key === 'k') {
      console.log('Command generation shortcut triggered');
      event.preventDefault();
      // Add your command generation action here
    }
  }
}
