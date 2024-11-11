import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { CardCarouselComponent } from './components/card-carousel/card-carousel.component';
import { ProjectCardComponent } from './components/project-card/project-card.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    SidebarComponent,
    CommonModule,
    CardCarouselComponent,
    ProjectCardComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  sections = [
    { title: 'Inicio', selector: 'home' },
    { title: 'Acerca de Mí', selector: 'about' },
    { title: 'Proyectos', selector: 'projects' },
    { title: 'Contacto', selector: 'contact' },
  ];

  scrollToSection(selector: string): void {
    const section = document.getElementById(selector);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
