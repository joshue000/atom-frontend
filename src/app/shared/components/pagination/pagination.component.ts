import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pagination',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent implements OnChanges {
  @Input() page = 1;
  @Input() numberOfPages = 1;
  @Output() pageChange = new EventEmitter<number>();

  pages: (number | '...')[] = [];

  ngOnChanges(): void {
    this.pages = this.buildPages();
  }

  private buildPages(): (number | '...')[] {
    const { page, numberOfPages } = this;

    if (numberOfPages <= 7) {
      return Array.from({ length: numberOfPages }, (_, i) => i + 1);
    }

    const result: (number | '...')[] = [1];

    if (page > 3) result.push('...');

    const rangeStart = Math.max(2, page - 1);
    const rangeEnd = Math.min(numberOfPages - 1, page + 1);
    for (let i = rangeStart; i <= rangeEnd; i++) {
      result.push(i);
    }

    if (page < numberOfPages - 2) result.push('...');

    result.push(numberOfPages);

    return result;
  }

  goTo(p: number): void {
    if (p === this.page || p < 1 || p > this.numberOfPages) return;
    this.pageChange.emit(p);
  }
}
