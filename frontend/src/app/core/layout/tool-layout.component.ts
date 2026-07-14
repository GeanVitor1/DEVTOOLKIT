import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { HeaderComponent } from './header.component';

@Component({
  selector: 'app-tool-layout',
  imports: [RouterOutlet, SidebarComponent, HeaderComponent],
  templateUrl: './tool-layout.component.html',
  styleUrl: './tool-layout.component.scss'
})
export class ToolLayoutComponent {}
