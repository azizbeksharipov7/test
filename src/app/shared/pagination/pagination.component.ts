import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent {
  @Input() page = 1;
  @Input() pagesCount = 1;
  @Output() pageChange = new EventEmitter<number>();

  // Oynada qancha sahifa ko'rinishi: oldingisi+joriy+keyingisi, jami 5 ta
  maxAround = 2;

  prev() {
    if (this.page > 1) {
      this.pageChange.emit(this.page - 1);
    }
  }

  next() {
    if (this.page < this.pagesCount) {
      this.pageChange.emit(this.page + 1);
    }
  }

  goTo(p: number | string) {
    if (typeof p === 'number' && p !== this.page) {
      this.pageChange.emit(p);
    }
  }

  get pageList(): (number | string)[] {
    const total = this.pagesCount;
    const current = this.page;
    const m = this.maxAround;
    const pages: (number | string)[] = [];

    // Har doim bosh sahifa
    pages.push(1);

    // Chapda ellipsis kerakmi?
    if (current - m > 2) {
      pages.push('...');
    }

    // O‘rtadagi raqamlar: current-m … current+m
    const start = Math.max(2, current - m);
    const end   = Math.min(total - 1, current + m);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // O‘ngda ellipsis kerakmi?
    if (current + m < total - 1) {
      pages.push('...');
    }

    // Har doim oxirgi sahifa (agar total>1 bo‘lsa)
    if (total > 1) {
      pages.push(total);
    }

    return pages;
  }
}
