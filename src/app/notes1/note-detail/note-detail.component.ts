import { Component, Input } from '@angular/core';

import { NoteService } from '../note.service';

import { Note } from '../note-model';

import { AppRoutingModule } from '../../app-routing.module';



@Component({
  selector: 'note-detail',
  templateUrl: './note-detail.component.html',
  styleUrls: ['./note-detail.component.scss'],
})
export class NoteDetailComponent {

  @Input()
  note: Note;

  constructor(private noteService: NoteService) { }

  addHeartToNote(val: number) {
    if (this.note.id&&this.note.authorId) {
            console.log("this.note.authorId"+this.note.authorId)

      this.noteService.updateNote(this.note.id, { hearts: val + 1 },this.note.authorId);
    } else {
      console.error('Note missing ID!');
    }
  }
//  addHeartToNote2(val: number) {
//     if (this.note.id) {
//       console.log("this.note.authorId"+this.note.authorId)
//       this.noteService.updateNote(this.note.id, { hearts: val + 1 },this.note.authorId);
//     } else {
//       console.error('Note missing ID!');
//     }
//   }



  uc1() {
    if (this.note.id&&this.note.authorId) {
      this.noteService.updateNote(this.note.id, { content: "val + 1 "},this.note.authorId);
    } else {
      console.error('Note missing ID!');
    }
  }

  deleteNote(id: string) {
    if (id && this.note.authorId)
        this.noteService.deleteNote(id,this.note.authorId);
    else 
      console.error('Note missing ID!');
  }

}