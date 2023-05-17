import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appFileDrop]',
})
export class FileDropDirective {
  @Input() accept: boolean = true;
  @Output() files: EventEmitter<File> = new EventEmitter();
  @Output() hovered: EventEmitter<boolean> = new EventEmitter();

  @HostListener('dragover', ['$event'])
  public onDragOver(event: DragEvent) {
    // have to do this for drop to fire
    event.preventDefault();
    event.stopPropagation();

    this.hovered.emit(true);
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.hovered.emit(false);
  }

  @HostListener('drop', ['$event'])
  public onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.hovered.emit(false);

    if (this.accept) {
      if (event.dataTransfer?.files) {
        this.files.emit(event.dataTransfer!.files[0]);
      }
    }
  }
}
