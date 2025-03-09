import {AfterViewInit, Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {
  title = 'ComponentsLibrary';

  ngAfterViewInit() {
    document.querySelector("body")?.classList.add("theme-light");
    setTimeout(() => {
    }, 500);
  }
}
