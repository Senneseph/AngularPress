/**
 * Visual Editor Block Models
 * Defines the structure for drag-and-drop content blocks
 */

export type BlockType = 
  | 'heading'
  | 'title'
  | 'lede'
  | 'date'
  | 'author'
  | 'body'
  | 'signature'
  | 'comments'
  | 'image'
  | 'quote'
  | 'divider'
  | 'spacer'
  | 'html'
  | 'columns';

export interface BlockStyle {
  // Inline CSS styles
  [key: string]: string | number | undefined;
}

export interface BlockConfig {
  // Block-specific configuration
  [key: string]: unknown;
}

export interface EditorBlock {
  id: string;
  type: BlockType;
  content: string;
  // CSS class names applied to the block
  cssClasses: string[];
  // Inline styles
  styles: BlockStyle;
  // Block-specific configuration
  config: BlockConfig;
  // Nested blocks (for columns, etc.)
  children?: EditorBlock[];
  // Order in the canvas
  order: number;
}

export interface BlockPaletteItem {
  type: BlockType;
  label: string;
  icon: string;
  description: string;
  defaultContent: string;
  defaultConfig: BlockConfig;
}

export interface EditorState {
  blocks: EditorBlock[];
  selectedBlockId: string | null;
  isDragging: boolean;
  isEditing: boolean;
  history: EditorBlock[][];
  historyIndex: number;
}

// CSS property definitions for the style editor
export interface CssProperty {
  name: string;
  label: string;
  type: 'text' | 'number' | 'color' | 'select' | 'unit';
  options?: string[];
  unit?: string;
  group: CssPropertyGroup;
}

export type CssPropertyGroup = 
  | 'typography'
  | 'spacing'
  | 'layout'
  | 'background'
  | 'border'
  | 'effects';

// Post content structure that will be saved
export interface VisualPostContent {
  version: string;
  blocks: EditorBlock[];
  globalStyles?: string;
}

// Block palette definitions
export const BLOCK_PALETTE: BlockPaletteItem[] = [
  {
    type: 'title',
    label: 'Title',
    icon: 'title',
    description: 'Main post title',
    defaultContent: 'Untitled Post',
    defaultConfig: { level: 1 }
  },
  {
    type: 'heading',
    label: 'Heading',
    icon: 'format_size',
    description: 'Section heading (H2-H6)',
    defaultContent: 'Section Heading',
    defaultConfig: { level: 2 }
  },
  {
    type: 'lede',
    label: 'Lede',
    icon: 'short_text',
    description: 'Opening paragraph/summary',
    defaultContent: 'Enter your opening paragraph here...',
    defaultConfig: {}
  },
  {
    type: 'date',
    label: 'Date',
    icon: 'calendar_today',
    description: 'Publication date',
    defaultContent: '',
    defaultConfig: { format: 'MMMM d, yyyy' }
  },
  {
    type: 'author',
    label: 'Author',
    icon: 'person',
    description: 'Author attribution',
    defaultContent: '',
    defaultConfig: { showAvatar: true }
  },
  {
    type: 'body',
    label: 'Body',
    icon: 'article',
    description: 'Rich text content block',
    defaultContent: '<p>Start writing your content here...</p>',
    defaultConfig: {}
  },
  {
    type: 'image',
    label: 'Image',
    icon: 'image',
    description: 'Image with caption',
    defaultContent: '',
    defaultConfig: { alt: '', caption: '' }
  },
  {
    type: 'quote',
    label: 'Quote',
    icon: 'format_quote',
    description: 'Blockquote with citation',
    defaultContent: 'Enter quote text...',
    defaultConfig: { citation: '' }
  },
  {
    type: 'signature',
    label: 'Signature',
    icon: 'draw',
    description: 'Author signature/byline',
    defaultContent: '',
    defaultConfig: {}
  },
  {
    type: 'comments',
    label: 'Comments',
    icon: 'comment',
    description: 'Comments section',
    defaultContent: '',
    defaultConfig: { enabled: true }
  },
  {
    type: 'divider',
    label: 'Divider',
    icon: 'horizontal_rule',
    description: 'Horizontal divider line',
    defaultContent: '',
    defaultConfig: {}
  },
  {
    type: 'spacer',
    label: 'Spacer',
    icon: 'space_bar',
    description: 'Vertical spacing',
    defaultContent: '',
    defaultConfig: { height: 32 }
  },
  {
    type: 'html',
    label: 'HTML',
    icon: 'code',
    description: 'Custom HTML block',
    defaultContent: '<div></div>',
    defaultConfig: {}
  }
];

