import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragStart } from '@angular/cdk/drag-drop';
import { BlockPaletteItem, BlockType } from '../../models/editor-block.interface';

@Component({
  selector: 'app-block-palette',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  template: `
    <div class="block-palette">
      <div class="palette-header">
        <h3>Blocks</h3>
        <input 
          type="search" 
          placeholder="Search blocks..." 
          [(ngModel)]="searchQuery"
          class="search-input"
        >
      </div>

      <div class="palette-section">
        <h4>Content</h4>
        <div class="palette-grid">
          @for (item of filteredItems('content'); track item.type) {
            <button 
              class="palette-item"
              (click)="onAddBlock(item)"
              [title]="item.description"
            >
              <span class="material-icons">{{ item.icon }}</span>
              <span class="label">{{ item.label }}</span>
            </button>
          }
        </div>
      </div>

      <div class="palette-section">
        <h4>Media</h4>
        <div class="palette-grid">
          @for (item of filteredItems('media'); track item.type) {
            <button 
              class="palette-item"
              (click)="onAddBlock(item)"
              [title]="item.description"
            >
              <span class="material-icons">{{ item.icon }}</span>
              <span class="label">{{ item.label }}</span>
            </button>
          }
        </div>
      </div>

      <div class="palette-section">
        <h4>Layout</h4>
        <div class="palette-grid">
          @for (item of filteredItems('layout'); track item.type) {
            <button 
              class="palette-item"
              (click)="onAddBlock(item)"
              [title]="item.description"
            >
              <span class="material-icons">{{ item.icon }}</span>
              <span class="label">{{ item.label }}</span>
            </button>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .block-palette {
      padding: 16px;
    }

    .palette-header {
      margin-bottom: 16px;

      h3 {
        margin: 0 0 12px;
        font-size: 14px;
        font-weight: 600;
        color: #1d2327;
      }

      .search-input {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 13px;

        &:focus {
          outline: none;
          border-color: #2271b1;
        }
      }
    }

    .palette-section {
      margin-bottom: 20px;

      h4 {
        margin: 0 0 8px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        color: #757575;
        letter-spacing: 0.5px;
      }
    }

    .palette-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }

    .palette-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 12px 8px;
      background: #f6f7f7;
      border: 1px solid transparent;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.15s ease;

      &:hover {
        background: #fff;
        border-color: #2271b1;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      }

      .material-icons {
        font-size: 24px;
        color: #50575e;
        margin-bottom: 4px;
      }

      .label {
        font-size: 11px;
        color: #50575e;
        text-align: center;
      }
    }
  `]
})
export class BlockPaletteComponent {
  @Input() items: BlockPaletteItem[] = [];
  @Output() blockAdded = new EventEmitter<BlockPaletteItem>();

  searchQuery = '';

  private categoryMap: Record<string, BlockType[]> = {
    content: ['title', 'heading', 'lede', 'body', 'quote', 'signature', 'author', 'date', 'comments'],
    media: ['image', 'html'],
    layout: ['divider', 'spacer']
  };

  filteredItems(category: string): BlockPaletteItem[] {
    const types = this.categoryMap[category] || [];
    return this.items
      .filter(item => types.includes(item.type))
      .filter(item => 
        !this.searchQuery || 
        item.label.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
  }

  onAddBlock(item: BlockPaletteItem): void {
    this.blockAdded.emit(item);
  }
}

