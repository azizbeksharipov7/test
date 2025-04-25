import { Component, OnInit } from '@angular/core';
import { ProblemService } from '../../services/problem.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-problem-list',
  templateUrl: './problem-list.component.html',
  styleUrls: ['./problem-list.component.css']
})
export class ProblemListComponent implements OnInit {
  problems: any[] = [];
  page = 1;
  pageSize = 5;
  totalProblems = 0;
  isLoading = false;

  displayedColumns: string[] = ['title', 'difficulty', 'has_solution', 'tags'];

  filters = {
    title: '',
    has_solution: ''
  };

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private problemService: ProblemService) {}

  ngOnInit(): void {
    this.fetchProblems();
  }

  fetchProblems(): void {
    this.isLoading = true;
    this.problemService.getProblems(
      this.page,
      this.pageSize,
      this.filters.title,
      this.filters.has_solution,
      this.sortColumn,
      this.sortDirection
    ).subscribe({
      next: (response) => {
        this.problems = response.data;
        this.totalProblems = response.totalProblems || response.total || 0;
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.isLoading = false;
      }
    });

    console.log('Sorting by:', this.sortColumn, this.sortDirection);

  }

  onPageChange(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.fetchProblems();
  }

  applyFilters() {
    this.page = 1;
    this.fetchProblems();
  }

  sort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.fetchProblems();
  }
}
