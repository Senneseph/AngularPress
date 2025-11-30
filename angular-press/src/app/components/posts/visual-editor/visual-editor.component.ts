import { Component, OnInit, OnDestroy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag } from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';

import { AdminLayoutComponent } from '../../admin-layout/admin-layout.component';
import { BlockPaletteComponent } from './components/block-palette/block-palette.component';
import { EditorCanvasComponent } from './components/editor-canvas/editor-canvas.component';
import { StyleEditorComponent } from './components/style-editor/style-editor.component';
import { 
  EditorBlock, 
  BlockType, 
  BLOCK_PALETTE, 
  VisualPostContent,
  BlockPaletteItem 
} from './models/editor-block.interface';
import { getApiUrl } from '../../../core/utils/api-url.util';

@Component({
  selector: 'app-visual-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    DragDropModule,
    AdminLayoutComponent,
    BlockPaletteComponent,
    EditorCanvasComponent,
    StyleEditorComponent
  ],
  templateUrl: './visual-editor.component.html',
  styleUrls: ['./visual-editor.component.scss']
})
export class VisualEditorComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private destroy$ = new Subject<void>();
  private apiUrl = getApiUrl();

  // Editor state
  blocks = signal<EditorBlock[]>([]);
  selectedBlockId = signal<string | null>(null);
  isEditorMode = signal<'visual' | 'code'>('visual');
  isDirty = signal(false);
  isSaving = signal(false);
  
  // Post metadata form
  postForm: FormGroup;
  isEditMode = false;
  postId: number | null = null;

  // Computed
  selectedBlock = computed(() => {
    const id = this.selectedBlockId();
    return this.blocks().find(b => b.id === id) ?? null;
  });

  // Palette items
  paletteItems = BLOCK_PALETTE;

  constructor() {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      slug: [''],
      excerpt: [''],
      status: ['draft'],
      featuredImage: ['']
    });

    // Auto-generate slug from title
    this.postForm.get('title')?.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(title => {
      if (!this.isEditMode) {
        const slug = this.generateSlug(title);
        this.postForm.patchValue({ slug }, { emitEvent: false });
      }
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.postId = parseInt(id, 10);
      this.isEditMode = true;
      this.loadPost(this.postId);
    } else {
      // Initialize with default blocks for new post
      this.initializeDefaultBlocks();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeDefaultBlocks(): void {
    const defaultBlocks: EditorBlock[] = [
      this.createBlock('title', 'Untitled Post'),
      this.createBlock('lede', 'Enter your opening paragraph here...'),
      this.createBlock('body', '<p>Start writing your content...</p>')
    ];
    this.blocks.set(defaultBlocks);
  }

  createBlock(type: BlockType, content: string = ''): EditorBlock {
    const paletteItem = BLOCK_PALETTE.find(p => p.type === type);
    return {
      id: this.generateId(),
      type,
      content: content || paletteItem?.defaultContent || '',
      cssClasses: [],
      styles: {},
      config: paletteItem?.defaultConfig || {},
      order: this.blocks().length
    };
  }

  private generateId(): string {
    return `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  addBlock(paletteItem: BlockPaletteItem): void {
    const newBlock = this.createBlock(paletteItem.type);
    this.blocks.update(blocks => [...blocks, newBlock]);
    this.selectedBlockId.set(newBlock.id);
    this.isDirty.set(true);
  }

  selectBlock(blockId: string | null): void {
    this.selectedBlockId.set(blockId);
  }

  updateBlock(updatedBlock: EditorBlock): void {
    this.blocks.update(blocks => 
      blocks.map(b => b.id === updatedBlock.id ? updatedBlock : b)
    );
    this.isDirty.set(true);
  }

  deleteBlock(blockId: string): void {
    this.blocks.update(blocks => blocks.filter(b => b.id !== blockId));
    if (this.selectedBlockId() === blockId) {
      this.selectedBlockId.set(null);
    }
    this.isDirty.set(true);
  }

  duplicateBlock(blockId: string): void {
    const block = this.blocks().find(b => b.id === blockId);
    if (block) {
      const newBlock: EditorBlock = {
        ...block,
        id: this.generateId(),
        order: block.order + 1
      };
      this.blocks.update(blocks => {
        const index = blocks.findIndex(b => b.id === blockId);
        const newBlocks = [...blocks];
        newBlocks.splice(index + 1, 0, newBlock);
        return newBlocks;
      });
      this.isDirty.set(true);
    }
  }

  moveBlockUp(blockId: string): void {
    const blocks = this.blocks();
    const index = blocks.findIndex(b => b.id === blockId);
    if (index > 0) {
      const newBlocks = [...blocks];
      [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
      this.blocks.set(newBlocks);
      this.isDirty.set(true);
    }
  }

  moveBlockDown(blockId: string): void {
    const blocks = this.blocks();
    const index = blocks.findIndex(b => b.id === blockId);
    if (index < blocks.length - 1) {
      const newBlocks = [...blocks];
      [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
      this.blocks.set(newBlocks);
      this.isDirty.set(true);
    }
  }

  onBlocksReordered(blocks: EditorBlock[]): void {
    this.blocks.set(blocks);
    this.isDirty.set(true);
  }

  toggleEditorMode(): void {
    this.isEditorMode.update(mode => mode === 'visual' ? 'code' : 'visual');
  }

  private loadPost(id: number): void {
    this.http.get<any>(`${this.apiUrl}/posts/${id}`).subscribe({
      next: (post) => {
        this.postForm.patchValue({
          title: post.post_title,
          slug: post.post_name,
          excerpt: post.post_excerpt,
          status: post.post_status
        });

        // Try to parse structured content
        try {
          const content: VisualPostContent = JSON.parse(post.post_content);
          if (content.version && content.blocks) {
            this.blocks.set(content.blocks);
          } else {
            // Legacy content - wrap in body block
            this.blocks.set([
              this.createBlock('title', post.post_title),
              this.createBlock('body', post.post_content)
            ]);
          }
        } catch {
          // Plain HTML content
          this.blocks.set([
            this.createBlock('title', post.post_title),
            this.createBlock('body', post.post_content)
          ]);
        }
      },
      error: (err) => console.error('Failed to load post:', err)
    });
  }

  save(publish: boolean = false): void {
    if (this.postForm.invalid) return;

    this.isSaving.set(true);
    const formValue = this.postForm.value;

    // Build the structured content
    const content: VisualPostContent = {
      version: '1.0',
      blocks: this.blocks()
    };

    // Also generate HTML for display
    const htmlContent = this.generateHtmlFromBlocks(this.blocks());

    const postData = {
      title: formValue.title,
      slug: formValue.slug,
      excerpt: formValue.excerpt,
      status: publish ? 'publish' : formValue.status,
      content: JSON.stringify(content),
      contentHtml: htmlContent
    };

    const request = this.isEditMode
      ? this.http.patch(`${this.apiUrl}/posts/${this.postId}`, postData)
      : this.http.post(`${this.apiUrl}/posts`, postData);

    request.subscribe({
      next: () => {
        this.isDirty.set(false);
        this.isSaving.set(false);
        this.router.navigate(['/ap-admin/posts']);
      },
      error: (err) => {
        console.error('Failed to save post:', err);
        this.isSaving.set(false);
      }
    });
  }

  generateHtmlFromBlocks(blocks: EditorBlock[]): string {
    return blocks.map(block => {
      const classes = block.cssClasses.join(' ');
      const style = Object.entries(block.styles)
        .map(([k, v]) => `${this.camelToKebab(k)}: ${v}`)
        .join('; ');
      const attrs = `class="${classes}" style="${style}"`.trim();

      switch (block.type) {
        case 'title':
          return `<h1 ${attrs}>${block.content}</h1>`;
        case 'heading':
          const level = block.config['level'] || 2;
          return `<h${level} ${attrs}>${block.content}</h${level}>`;
        case 'lede':
          return `<p class="lede ${classes}" style="${style}">${block.content}</p>`;
        case 'body':
          return `<div class="body-content ${classes}" style="${style}">${block.content}</div>`;
        case 'quote':
          return `<blockquote ${attrs}>${block.content}<cite>${block.config['citation'] || ''}</cite></blockquote>`;
        case 'image':
          return `<figure ${attrs}><img src="${block.content}" alt="${block.config['alt'] || ''}"><figcaption>${block.config['caption'] || ''}</figcaption></figure>`;
        case 'divider':
          return `<hr ${attrs}>`;
        case 'spacer':
          return `<div class="spacer ${classes}" style="height: ${block.config['height'] || 32}px; ${style}"></div>`;
        case 'html':
          return block.content;
        default:
          return `<div ${attrs}>${block.content}</div>`;
      }
    }).join('\n');
  }

  private camelToKebab(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }

  cancel(): void {
    if (this.isDirty() && !confirm('You have unsaved changes. Are you sure you want to leave?')) {
      return;
    }
    this.router.navigate(['/ap-admin/posts']);
  }
}
