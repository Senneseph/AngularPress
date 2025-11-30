import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditorBlock, BlockStyle } from '../../models/editor-block.interface';

interface StyleProperty {
  key: string;
  label: string;
  type: 'text' | 'number' | 'color' | 'select';
  options?: string[];
  unit?: string;
}

@Component({
  selector: 'app-style-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="style-editor">
      <div class="editor-header">
        <h3>{{ block.type | titlecase }} Block</h3>
        <span class="block-id">{{ block.id.slice(-8) }}</span>
      </div>

      <!-- Block Config -->
      <section class="editor-section">
        <h4>Block Settings</h4>
        @switch (block.type) {
          @case ('heading') {
            <label class="form-field">
              <span>Level</span>
              <select [ngModel]="block.config['level']" (ngModelChange)="updateConfig('level', $event)">
                <option [value]="2">H2</option>
                <option [value]="3">H3</option>
                <option [value]="4">H4</option>
                <option [value]="5">H5</option>
                <option [value]="6">H6</option>
              </select>
            </label>
          }
          @case ('spacer') {
            <label class="form-field">
              <span>Height (px)</span>
              <input type="number" [ngModel]="block.config['height']" (ngModelChange)="updateConfig('height', $event)" min="8" max="200">
            </label>
          }
          @case ('quote') {
            <label class="form-field">
              <span>Citation</span>
              <input type="text" [ngModel]="block.config['citation']" (ngModelChange)="updateConfig('citation', $event)" placeholder="Author name">
            </label>
          }
          @case ('image') {
            <label class="form-field">
              <span>Alt Text</span>
              <input type="text" [ngModel]="block.config['alt']" (ngModelChange)="updateConfig('alt', $event)" placeholder="Image description">
            </label>
            <label class="form-field">
              <span>Caption</span>
              <input type="text" [ngModel]="block.config['caption']" (ngModelChange)="updateConfig('caption', $event)" placeholder="Image caption">
            </label>
          }
        }
      </section>

      <!-- CSS Classes -->
      <section class="editor-section">
        <h4>CSS Classes</h4>
        <div class="classes-input">
          <input 
            type="text" 
            [ngModel]="classesString"
            (ngModelChange)="updateClasses($event)"
            placeholder="class1 class2 class3"
          >
          <small>Space-separated class names</small>
        </div>
      </section>

      <!-- Typography -->
      <section class="editor-section">
        <h4>Typography</h4>
        <div class="style-grid">
          <label class="form-field">
            <span>Font Size</span>
            <div class="input-with-unit">
              <input type="number" [ngModel]="getStyleValue('fontSize')" (ngModelChange)="updateStyle('fontSize', $event + 'px')" min="8" max="96">
              <span class="unit">px</span>
            </div>
          </label>
          <label class="form-field">
            <span>Font Weight</span>
            <select [ngModel]="block.styles['fontWeight']" (ngModelChange)="updateStyle('fontWeight', $event)">
              <option value="">Default</option>
              <option value="300">Light</option>
              <option value="400">Normal</option>
              <option value="500">Medium</option>
              <option value="600">Semi-Bold</option>
              <option value="700">Bold</option>
            </select>
          </label>
          <label class="form-field">
            <span>Line Height</span>
            <input type="number" [ngModel]="block.styles['lineHeight']" (ngModelChange)="updateStyle('lineHeight', $event)" min="1" max="3" step="0.1">
          </label>
          <label class="form-field">
            <span>Text Color</span>
            <input type="color" [ngModel]="block.styles['color'] || '#000000'" (ngModelChange)="updateStyle('color', $event)">
          </label>
          <label class="form-field">
            <span>Text Align</span>
            <select [ngModel]="block.styles['textAlign']" (ngModelChange)="updateStyle('textAlign', $event)">
              <option value="">Default</option>
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
              <option value="justify">Justify</option>
            </select>
          </label>
        </div>
      </section>

      <!-- Spacing -->
      <section class="editor-section">
        <h4>Spacing</h4>
        <div class="spacing-grid">
          <div class="spacing-row">
            <label class="form-field small">
              <span>Margin Top</span>
              <input type="number" [ngModel]="getStyleValue('marginTop')" (ngModelChange)="updateStyle('marginTop', $event + 'px')">
            </label>
          </div>
          <div class="spacing-row">
            <label class="form-field small">
              <span>Left</span>
              <input type="number" [ngModel]="getStyleValue('marginLeft')" (ngModelChange)="updateStyle('marginLeft', $event + 'px')">
            </label>
            <label class="form-field small">
              <span>Right</span>
              <input type="number" [ngModel]="getStyleValue('marginRight')" (ngModelChange)="updateStyle('marginRight', $event + 'px')">
            </label>
          </div>
          <div class="spacing-row">
            <label class="form-field small">
              <span>Margin Bottom</span>
              <input type="number" [ngModel]="getStyleValue('marginBottom')" (ngModelChange)="updateStyle('marginBottom', $event + 'px')">
            </label>
          </div>
        </div>
      </section>

      <!-- Background -->
      <section class="editor-section">
        <h4>Background</h4>
        <label class="form-field">
          <span>Background Color</span>
          <input type="color" [ngModel]="block.styles['backgroundColor'] || '#ffffff'" (ngModelChange)="updateStyle('backgroundColor', $event)">
        </label>
      </section>
    </div>
  `,
  styles: [`
    .style-editor {
      padding: 16px;
    }

    .editor-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid #ddd;

      h3 {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
      }

      .block-id {
        font-size: 11px;
        color: #757575;
        font-family: monospace;
      }
    }

    .editor-section {
      margin-bottom: 20px;

      h4 {
        margin: 0 0 12px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        color: #757575;
        letter-spacing: 0.5px;
      }
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-bottom: 12px;

      span {
        font-size: 12px;
        color: #50575e;
      }

      input, select {
        padding: 6px 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 13px;

        &:focus {
          outline: none;
          border-color: #2271b1;
        }
      }

      input[type="color"] {
        padding: 2px;
        height: 32px;
        cursor: pointer;
      }

      input[type="number"] {
        width: 80px;
      }

      &.small {
        margin-bottom: 8px;

        input {
          width: 60px;
        }
      }
    }

    .classes-input {
      small {
        font-size: 11px;
        color: #757575;
      }

      input {
        width: 100%;
        padding: 8px 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 13px;
        margin-bottom: 4px;

        &:focus {
          outline: none;
          border-color: #2271b1;
        }
      }
    }

    .style-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .input-with-unit {
      display: flex;
      align-items: center;
      gap: 4px;

      input {
        flex: 1;
      }

      .unit {
        font-size: 12px;
        color: #757575;
      }
    }

    .spacing-grid {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }

    .spacing-row {
      display: flex;
      gap: 16px;
      justify-content: center;
    }
  `]
})
export class StyleEditorComponent implements OnChanges {
  @Input() block!: EditorBlock;
  @Output() blockUpdated = new EventEmitter<EditorBlock>();

  classesString = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['block']) {
      this.classesString = this.block.cssClasses.join(' ');
    }
  }

  updateConfig(key: string, value: unknown): void {
    const updatedBlock: EditorBlock = {
      ...this.block,
      config: { ...this.block.config, [key]: value }
    };
    this.blockUpdated.emit(updatedBlock);
  }

  updateClasses(classesStr: string): void {
    this.classesString = classesStr;
    const classes = classesStr.split(/\s+/).filter(c => c.trim());
    const updatedBlock: EditorBlock = {
      ...this.block,
      cssClasses: classes
    };
    this.blockUpdated.emit(updatedBlock);
  }

  updateStyle(property: string, value: string | number): void {
    const updatedBlock: EditorBlock = {
      ...this.block,
      styles: { ...this.block.styles, [property]: value }
    };
    this.blockUpdated.emit(updatedBlock);
  }

  getStyleValue(property: string): number {
    const value = this.block.styles[property];
    if (typeof value === 'string') {
      return parseInt(value, 10) || 0;
    }
    return (value as number) || 0;
  }
}

