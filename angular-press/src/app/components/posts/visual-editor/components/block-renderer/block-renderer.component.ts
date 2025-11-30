import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditorBlock } from '../../models/editor-block.interface';

@Component({
  selector: 'app-block-renderer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="block-renderer" [ngClass]="block.cssClasses" [ngStyle]="block.styles">
      @switch (block.type) {
        @case ('title') {
          <h1 
            #editableElement
            [contentEditable]="isEditing"
            (blur)="onBlur($event)"
            (input)="onInput($event)"
            class="block-title"
          >{{ block.content }}</h1>
        }
        @case ('heading') {
          @switch (block.config['level']) {
            @case (2) {
              <h2 #editableElement [contentEditable]="isEditing" (blur)="onBlur($event)" (input)="onInput($event)">{{ block.content }}</h2>
            }
            @case (3) {
              <h3 #editableElement [contentEditable]="isEditing" (blur)="onBlur($event)" (input)="onInput($event)">{{ block.content }}</h3>
            }
            @case (4) {
              <h4 #editableElement [contentEditable]="isEditing" (blur)="onBlur($event)" (input)="onInput($event)">{{ block.content }}</h4>
            }
            @default {
              <h2 #editableElement [contentEditable]="isEditing" (blur)="onBlur($event)" (input)="onInput($event)">{{ block.content }}</h2>
            }
          }
        }
        @case ('lede') {
          <p 
            #editableElement
            [contentEditable]="isEditing"
            (blur)="onBlur($event)"
            (input)="onInput($event)"
            class="block-lede"
          >{{ block.content }}</p>
        }
        @case ('body') {
          <div 
            #editableElement
            [contentEditable]="isEditing"
            (blur)="onBlur($event)"
            (input)="onInput($event)"
            class="block-body"
            [innerHTML]="block.content"
          ></div>
        }
        @case ('quote') {
          <blockquote class="block-quote">
            <p 
              #editableElement
              [contentEditable]="isEditing"
              (blur)="onBlur($event)"
              (input)="onInput($event)"
            >{{ block.content }}</p>
            @if (block.config['citation']) {
              <cite>— {{ block.config['citation'] }}</cite>
            }
          </blockquote>
        }
        @case ('image') {
          <figure class="block-image">
            @if (block.content) {
              <img [src]="block.content" [alt]="block.config['alt'] || ''">
            } @else {
              <div class="image-placeholder" (click)="selectImage()">
                <span class="icon">🖼️</span>
                <span>Click to add image</span>
              </div>
            }
            @if (block.config['caption']) {
              <figcaption>{{ block.config['caption'] }}</figcaption>
            }
          </figure>
        }
        @case ('author') {
          <div class="block-author">
            <span class="author-label">By </span>
            <span 
              #editableElement
              [contentEditable]="isEditing"
              (blur)="onBlur($event)"
              (input)="onInput($event)"
            >{{ block.content || 'Author Name' }}</span>
          </div>
        }
        @case ('date') {
          <div class="block-date">
            <span 
              #editableElement
              [contentEditable]="isEditing"
              (blur)="onBlur($event)"
              (input)="onInput($event)"
            >{{ block.content || 'Publication Date' }}</span>
          </div>
        }
        @case ('signature') {
          <div class="block-signature">
            <span 
              #editableElement
              [contentEditable]="isEditing"
              (blur)="onBlur($event)"
              (input)="onInput($event)"
            >{{ block.content || 'Signature' }}</span>
          </div>
        }
        @case ('comments') {
          <div class="block-comments">
            <h4>Comments</h4>
            <p class="comments-placeholder">Comments section will appear here</p>
          </div>
        }
        @case ('divider') {
          <hr class="block-divider">
        }
        @case ('spacer') {
          <div class="block-spacer" [style.height.px]="block.config['height'] || 32"></div>
        }
        @case ('html') {
          <div class="block-html" [innerHTML]="block.content"></div>
        }
        @default {
          <div 
            #editableElement
            [contentEditable]="isEditing"
            (blur)="onBlur($event)"
            (input)="onInput($event)"
          >{{ block.content }}</div>
        }
      }
    </div>
  `,
  styles: [`
    .block-renderer {
      min-height: 24px;
    }

    [contenteditable] {
      outline: none;
      cursor: text;
    }

    [contenteditable]:focus {
      background: rgba(34, 113, 177, 0.05);
      border-radius: 2px;
    }

    .block-title {
      font-size: 32px;
      font-weight: 700;
      margin: 0;
      line-height: 1.2;
    }

    .block-lede {
      font-size: 18px;
      color: #555;
      line-height: 1.6;
      margin: 0;
    }

    .block-body {
      font-size: 16px;
      line-height: 1.7;

      p { margin: 0 0 1em; }
      p:last-child { margin-bottom: 0; }
    }

    .block-quote {
      margin: 0;
      padding: 16px 24px;
      border-left: 4px solid #2271b1;
      background: #f6f7f7;

      p { margin: 0 0 8px; font-style: italic; font-size: 18px; }
      cite { font-size: 14px; color: #757575; }
    }

    .block-image {
      margin: 0;
      text-align: center;

      img { max-width: 100%; height: auto; border-radius: 4px; }
      figcaption { font-size: 13px; color: #757575; margin-top: 8px; }
    }

    .image-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px;
      background: #f6f7f7;
      border: 2px dashed #ddd;
      border-radius: 4px;
      cursor: pointer;

      .icon { font-size: 32px; margin-bottom: 8px; }
      span { color: #757575; font-size: 14px; }

      &:hover { border-color: #2271b1; background: #f0f6fc; }
    }

    .block-author, .block-date {
      font-size: 14px;
      color: #757575;
    }

    .block-signature {
      font-family: 'Georgia', serif;
      font-style: italic;
      font-size: 18px;
    }

    .block-comments {
      padding: 16px;
      background: #f6f7f7;
      border-radius: 4px;

      h4 { margin: 0 0 8px; font-size: 16px; }
      .comments-placeholder { margin: 0; color: #757575; font-size: 14px; }
    }

    .block-divider {
      border: none;
      border-top: 1px solid #ddd;
      margin: 16px 0;
    }

    .block-spacer {
      background: repeating-linear-gradient(
        45deg,
        transparent,
        transparent 5px,
        rgba(0,0,0,0.03) 5px,
        rgba(0,0,0,0.03) 10px
      );
    }
  `]
})
export class BlockRendererComponent implements AfterViewInit {
  @Input() block!: EditorBlock;
  @Input() isEditing = false;
  @Output() contentChanged = new EventEmitter<string>();

  @ViewChild('editableElement') editableElement?: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    if (this.isEditing && this.editableElement) {
      this.editableElement.nativeElement.focus();
    }
  }

  onInput(event: Event): void {
    const target = event.target as HTMLElement;
    this.contentChanged.emit(target.innerHTML || target.textContent || '');
  }

  onBlur(event: FocusEvent): void {
    const target = event.target as HTMLElement;
    this.contentChanged.emit(target.innerHTML || target.textContent || '');
  }

  selectImage(): void {
    // TODO: Open media library
    const url = prompt('Enter image URL:');
    if (url) {
      this.contentChanged.emit(url);
    }
  }
}

