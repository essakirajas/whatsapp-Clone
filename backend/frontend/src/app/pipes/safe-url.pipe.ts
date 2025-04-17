import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safeUrl'
})
export class SafeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }

  transform(value: string): SafeResourceUrl {
    // Always append `#page=1` to show only the first page
    return this.sanitizer.bypassSecurityTrustResourceUrl(value + '#page=1&toolbar=0&navpanes=0');
  }
}
