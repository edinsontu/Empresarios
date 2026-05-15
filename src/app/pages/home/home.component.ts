import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {
  currentSlide = 0;
  slidesCount = 3;

  constructor(private router: Router) {}

  irARegistro() {
    this.router.navigate(['/register']);
  }

  ngAfterViewInit() {
    // Solo corre si document está disponible
    if (typeof document !== 'undefined') {
      this.updateSlides();
      setInterval(() => {
        this.nextSlide();
      }, 6000);
    }
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slidesCount) % this.slidesCount;
    this.updateSlides();
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slidesCount;
    this.updateSlides();
  }

  updateSlides() {
    const slides = document.querySelectorAll('.slide');
    slides.forEach((slide, i) => {
      if (i === this.currentSlide) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });
  }
}
