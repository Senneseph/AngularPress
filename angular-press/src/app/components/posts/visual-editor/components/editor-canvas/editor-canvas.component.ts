import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { EditorBlock } from '../../models/editor-block.interface';
import { BlockRendererComponent } from '../block-renderer/block-renderer.component';

@Component({
  selector: 'app-editor-canvas',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, BlockRendererComponent],
  template: `
    <div class="editor-canvas">
      <div 
        class="canvas-content"
        cdkDropList
        [cdkDropListData]="blocks"
        (cdkDropListDropped)="onDrop($event)"
      >
        @for (block of blocks; track block.id) {
          <div 
            class="block-wrapper"
            [class.selected]="block.id === selectedBlockId"
            cdkDrag
            [cdkDragData]="block"
          >
            <div class="block-drag-handle" cdkDragHandle>
              <span class="drag-icon">⋮⋮</span>
            </div>

            <div class="block-content" (click)="onBlockClick(block)">
              <app-block-renderer
                [block]="block"
                [isEditing]="block.id === selectedBlockId"
                (contentChanged)="onContentChange(block, $event)"
              ></app-block-renderer>
            </div>

            <div class="block-actions">
              <button (click)="onMoveUp(block.id)" title="Move up" [disabled]="isFirst(block)">↑</button>
              <button (click)="onMoveDown(block.id)" title="Move down" [disabled]="isLast(block)">↓</button>
              <button (click)="onDuplicate(block.id)" title="Duplicate">⧉</button>
              <button (click)="onDelete(block.id)" title="Delete" class="delete">×</button>
            </div>

            <div class="block-type-label">{{ block.type }}</div>
          </div>
        }

        @if (blocks.length === 0) {
          <div class="empty-canvas">
            <span class="icon">📄</span>
            <p>Click a block from the palette to add content</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .editor-canvas {
      max-width: 800px;
      margin: 0 auto;
      background: #fff;
      min-height: 500px;
      border-radius: 4px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .canvas-content {
      padding: 32px;
    }

    .block-wrapper {
      position: relative;
      margin-bottom: 16px;
      border: 2px solid transparent;
      border-radius: 4px;
      transition: all 0.15s ease;

      &:hover {
        border-color: #e0e0e0;

        .block-drag-handle,
        .block-actions,
        .block-type-label {
          opacity: 1;
        }
      }

      &.selected {
        border-color: #2271b1;
        box-shadow: 0 0 0 1px #2271b1;

        .block-drag-handle,
        .block-actions,
        .block-type-label {
          opacity: 1;
        }
      }
    }

    .block-drag-handle {
      position: absolute;
      left: -32px;
      top: 50%;
      transform: translateY(-50%);
      opacity: 0;
      cursor: grab;
      padding: 8px;
      color: #757575;
      font-size: 14px;
      transition: opacity 0.15s;

      &:active {
        cursor: grabbing;
      }
    }

    .block-content {
      padding: 12px;
      cursor: text;
    }

    .block-actions {
      position: absolute;
      right: -48px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      flex-direction: column;
      gap: 4px;
      opacity: 0;
      transition: opacity 0.15s;

      button {
        width: 28px;
        height: 28px;
        border: 1px solid #ddd;
        background: #fff;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        color: #50575e;

        &:hover {
          background: #f6f7f7;
        }

        &.delete:hover {
          background: #d63638;
          color: #fff;
          border-color: #d63638;
        }

        &:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
      }
    }

    .block-type-label {
      position: absolute;
      top: -10px;
      left: 12px;
      background: #2271b1;
      color: #fff;
      font-size: 10px;
      padding: 2px 8px;
      border-radius: 2px;
      text-transform: uppercase;
      opacity: 0;
      transition: opacity 0.15s;
    }

    .empty-canvas {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px;
      color: #757575;
      text-align: center;

      .icon {
        font-size: 48px;
        margin-bottom: 16px;
      }

      p {
        margin: 0;
        font-size: 14px;
      }
    }

    .cdk-drag-preview {
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
      border-radius: 4px;
      background: #fff;
    }

    .cdk-drag-placeholder {
      background: #f0f0f1;
      border: 2px dashed #2271b1;
      border-radius: 4px;
      min-height: 50px;
    }

    .cdk-drag-animating {
      transition: transform 200ms ease;
    }
  `]
})
export class EditorCanvasComponent {
  @Input() blocks: EditorBlock[] = [];
  @Input() selectedBlockId: string | null = null;

  @Output() blockSelected = new EventEmitter<string | null>();
  @Output() blockUpdated = new EventEmitter<EditorBlock>();
  @Output() blockDeleted = new EventEmitter<string>();
  @Output() blockDuplicated = new EventEmitter<string>();
  @Output() blockMovedUp = new EventEmitter<string>();
  @Output() blockMovedDown = new EventEmitter<string>();
  @Output() blocksReordered = new EventEmitter<EditorBlock[]>();

  onBlockClick(block: EditorBlock): void {
    this.blockSelected.emit(block.id);
  }

  onContentChange(block: EditorBlock, content: string): void {
    this.blockUpdated.emit({ ...block, content });
  }

  onMoveUp(id: string): void {
    this.blockMovedUp.emit(id);
  }

  onMoveDown(id: string): void {
    this.blockMovedDown.emit(id);
  }

  onDuplicate(id: string): void {
    this.blockDuplicated.emit(id);
  }

  onDelete(id: string): void {
    if (confirm('Delete this block?')) {
      this.blockDeleted.emit(id);
    }
  }

  onDrop(event: CdkDragDrop<EditorBlock[]>): void {
    if (event.previousIndex !== event.currentIndex) {
      const blocks = [...this.blocks];
      moveItemInArray(blocks, event.previousIndex, event.currentIndex);
      this.blocksReordered.emit(blocks);
    }
  }

  isFirst(block: EditorBlock): boolean {
    return this.blocks.indexOf(block) === 0;
  }

  isLast(block: EditorBlock): boolean {
    return this.blocks.indexOf(block) === this.blocks.length - 1;
  }
}

