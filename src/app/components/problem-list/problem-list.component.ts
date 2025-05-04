import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProblemService } from '../../services/problem.service';
import { PageEvent } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

interface Problem {
  id: number;
  title: string;
  difficulty: string;
  has_checker: boolean;
  has_solution: boolean;
  tags: string[];
}

@Component({
  selector: 'app-problem-list',
  templateUrl: './problem-list.component.html',
  styleUrls: ['./problem-list.component.css']
})
export class ProblemListComponent implements OnInit, OnDestroy {
  problems: Problem[] = [];
  page = 1;
  pageSize = 12;
  totalProblems = 0;
  isLoading = false;

  displayedColumns: string[] = ['id', 'title', 'difficultyTitle', 'rating', 'tags'];

  filters = {
    title: '',
    has_checker: '',
    has_solution: ''
  };

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private problemService: ProblemService) {}

  ngOnInit(): void {
    this.fetchProblems();

    this.searchSubject.pipe(
      debounceTime(500),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.page = 1;
      this.fetchProblems();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchChange() {
    this.searchSubject.next(this.filters.title);
  }

  fetchProblems(): void {
    this.isLoading = true;
    this.problemService.getProblems(
      this.page,
      this.pageSize,
      this.filters.title,
      this.filters.has_checker,
      this.filters.has_solution,
      this.sortColumn,
      this.sortDirection
    ).subscribe({
      next: (response) => {
        this.problems = (response.data || []).map((problem: any) => ({
          id: Number(problem.id),
          title: String(problem.title),
          difficultyTitle: String(problem.difficultyTitle),
          has_checker: problem.has_checker === Boolean || problem.has_checker === 'true',
          has_solution: problem.has_solution === Boolean || problem.has_solution === 'true',
          tags: Array.isArray(problem.tags) ? problem.tags : [],
          rating: {
            likes: Math.floor(Math.random() * 100),    // Dummy like soni
            dislikes: Math.floor(Math.random() * 20)   // Dummy dislike soni
          }
        }));
        this.totalProblems = Number(response.total) || 0;
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.isLoading = false;
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
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
