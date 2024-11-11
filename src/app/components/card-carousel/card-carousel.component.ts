import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { distinctUntilChanged, fromEvent, Subscription } from 'rxjs';

/**
 * Interface that contains the information needed to build each card in the carousel.
 */
interface CarouselCardInfo {
  image: string;
  text: string;
}

/**
 * Component that displays a carousel of cards. It divides the cards between different
 * pages of the carousel, with the maximum number of cards possible displayed on each page.
 */
@Component({
  selector: 'app-card-carousel',
  standalone: true,
  imports: [CommonModule, ProjectCardComponent],
  templateUrl: './card-carousel.component.html',
  styleUrl: './card-carousel.component.scss',
})
export class CardCarouselComponent implements AfterViewInit, OnDestroy {
  /** Cards displayed in the carousel. */
  @Input() cards: CarouselCardInfo[] = [];

  /** Carousel element. */
  @ViewChild('carousel') carousel!: ElementRef;

  /** Current page in the carousel. */
  currentPage = 0;
  /** Maximum number of cards in a carousel page. */
  cardsPerPage = 1;
  /** Total number of pages that make up the carousel. */
  totalPages = 0;
  /** Flag indicating that the transition between pages is taking place. */
  isTransitioning = false;

  /** Subscription that allows you to control the page resize event. */
  private resizeSubscription: Subscription | null = null;

  /** Size of each card in the carousel. Depending on the screen size this may change. */
  private cardWidth = 374;

  constructor(private cdr: ChangeDetectorRef) {}

  /**
   * Calculates the number of cards to display on each page and subscribes to the resize event
   * to update the number of cards per page depending on the screen size.
   */
  ngAfterViewInit(): void {
    this.calculateCardsPerPage();
    this.cdr.detectChanges();

    this.resizeSubscription = fromEvent(window, 'resize')
      .pipe(distinctUntilChanged())
      .subscribe(() => {
        const currentCardsPerPage = this.cardsPerPage;
        this.calculateCardsPerPage();
        if (this.cardsPerPage === currentCardsPerPage) return;
        this.currentPage = 0;
      });
  }

  ngOnDestroy(): void {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }

  /**
   * Function that is executed when the left button of the carousel is selected. Moves the
   * carousel to the previous page.
   */
  scrollLeft(): void {
    if (this.isTransitioning) return;
    if (this.currentPage > 0) {
      this.isTransitioning = true;
      this.currentPage--;
      setTimeout(() => (this.isTransitioning = false), 500); // Duración de la transición
    }
  }

  /**
   * Function that is executed when the right button of the carousel is selected. Moves the carousel
   * to the next page.
   */
  scrollRight(): void {
    if (this.isTransitioning) return;
    if ((this.currentPage + 1) * this.cardsPerPage < this.cards.length) {
      this.isTransitioning = true;
      this.currentPage++;
      setTimeout(() => (this.isTransitioning = false), 500);
    }
  }

  /**
   * When changing pages, the position of the cards in the DOM is updated.
   *
   * @returns - string with the scss command that updates the position of the cards.
   */
  getCarouselTransform(): string {
    const translateX = -(this.currentPage * this.cardsPerPage * this.cardWidth);
    return `translateX(${translateX}px)`;
  }

  /**
   * Given a page number, it moves the carousel to that page.
   *
   * @param pageIndex - number of the page.
   */
  goToPage(pageIndex: number): void {
    if (this.isTransitioning) return;
    if (pageIndex >= 0 && pageIndex < this.totalPages) {
      this.isTransitioning = true;
      this.currentPage = pageIndex;
      setTimeout(() => (this.isTransitioning = false), 500);
    }
  }

  /**
   * Depending on the size of the carousel and the size of each card, it calculates how many
   * cards can be displayed per page and calculates the total number of pages.
   */
  private calculateCardsPerPage(): void {
    if (!this.carousel) return;
    const carouselWidth = this.carousel.nativeElement.offsetWidth;

    if (window.innerWidth < 768) {
      this.cardWidth = 274;
    } else {
      this.cardWidth = 374;
    }

    this.cardsPerPage = Math.floor(carouselWidth / this.cardWidth);

    if (this.cardsPerPage <= 0) this.cardsPerPage = 1;
    this.totalPages = Math.ceil(this.cards.length / this.cardsPerPage);
  }
}
