import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'objectPath',
    standalone: true
 })

export class ObjectPathPipe implements PipeTransform {
    transform(value: any, path: string): any {
        if (typeof path !== 'string') {
          throw new Error(`Expected 'path' to be a string, but got ${typeof path}`);
        }
    
        return path.split('.').reduce((acc, part) => acc && acc[part], value);
      }
    }
