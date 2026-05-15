import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./shared/navbar/navbar.component";
import { ChatBotComponent } from "./components/chat-bot/chat-bot.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, ChatBotComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'PaginaMaye';
}
