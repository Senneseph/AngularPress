import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MediaState } from '../../../store/media/media.state';
import { LoadMedia, DeleteMedia } from '../../../store/media/media.actions';
import { MediaItem } from '../../../models/media.model';
import { FileSizePipe } from '../../../shared/pipes/file-size.pipe';

@Component({
  selector: 'app-media-list',
  templateUrl: './media-list.component.html',
  styleUrls: ['./media-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressBarModule,
    ClipboardModule,
    FileSizePipe
  ]
})
export class MediaListComponent implements OnInit {
  @Select(MediaState.getMedia) media$!: Observable<MediaItem[]>;
  @Select(MediaState.getLoading) loading$!: Observable<boolean>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new LoadMedia());
  }

  onDeleteMedia(id: string): void {
    if (confirm('Are you sure you want to delete this media item?')) {
      this.store.dispatch(new DeleteMedia(id));
    }
  }

  onUploadClick(): void {
    document.getElementById('fileUpload')?.click();
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      // TODO: Implement file upload logic
      console.log('Files selected:', fileInput.files);
    }
  }

  getFileType(mimeType: string): string {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'document';
  }

  getFileIcon(mimeType: string): string {
    switch (this.getFileType(mimeType)) {
      case 'image': return 'image';
      case 'video': return 'videocam';
      case 'audio': return 'audiotrack';
      default: return 'insert_drive_file';
    }
  }
}