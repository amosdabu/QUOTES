/*my quotes note detail component 
 *gets the note details and sets how the quote will be displayed
 *-edit
 *-change settings 
 *-likes(hearts)
 *-remove
 */
import { Component, Input } from '@angular/core';
import { NoteService } from '../note.service';
import { Note } from '../note-model';
import { AngularFireAuth } from 'angularfire2/auth';


@
Component({
    selector: 'note-detail',
    templateUrl: './note-detail.component.html',
    styleUrls: ['./note-detail.component.scss'],
    host: {
    '(window:resize)': 'onResize($event)'
    },
})
export class NoteDetailComponent {

    @
    Input()
    note: Note;
    likeShowNum;
    mobile:boolean;
    editContent: string;
    elementHtml;
    currentUserUid="";

        constructor(private noteService: NoteService, private afAuth: AngularFireAuth) {
        this.likeShowNum=3;
        if (this.afAuth.auth.currentUser) {
            this.currentUserUid = this.afAuth.auth.currentUser.uid;
        } else
            console.error("NULL ID")
    }

    //use for changeing view if mobile or not
    ngOnInit() {
    if (window.innerWidth < 1022) { // 768px portrait
        this.mobile = true;
     }
     else
        this.mobile = false;

    this.editContent=this.note.content   
    }

    //use for changeing view if mobile or not 
    onResize(event){
        event.target.innerWidth;
            if (window.innerWidth < 1022) { 
        this.mobile = true;
     }
     else
        this.mobile = false;
    }

/////////////////////////////setSettings--------------------------------------------------------

    setSettings(Nid, authorId) {
        console.log(Nid);
        let value;
        let privateBox=<HTMLInputElement>document.getElementById("private_checkbox"+this.note.id);
        let publicBox=<HTMLInputElement>document.getElementById("public_checkbox"+this.note.id);
        let followersBox=<HTMLInputElement>document.getElementById("followers_checkbox"+this.note.id);
        let friendsBox=<HTMLInputElement>document.getElementById("friends_checkbox"+this.note.id);
         if (privateBox&&publicBox&&friendsBox&&followersBox ) {
             //option1-public
            if (publicBox.checked && !privateBox.checked&& !friendsBox.checked && !followersBox.checked  ) 
            {
                console.log("public");
                value="public";
            }
            //option2-private
            if (!publicBox.checked && privateBox.checked&& !friendsBox.checked && !followersBox.checked  ) 
            {
                console.log("private");
                value="private"
            }
            //option3-Friends
                        if (!publicBox.checked && !privateBox.checked&& friendsBox.checked && !followersBox.checked  ) 
            {
                console.log("friends");
                value="friends"
            }
            //option4-Followers
                        if (!publicBox.checked && !privateBox.checked&& !friendsBox.checked && followersBox.checked  ) 
            {
                console.log("followers");
                value="followers"
            }
            //option5-Friends+Followers [FF]
                        if (!publicBox.checked && !privateBox.checked&& friendsBox.checked && followersBox.checked  ) 
            {
                console.log("Friends+Followers [ff]");
                value="ff"
            }
            //option6- all unchacked => public 
                        if (!publicBox.checked && !privateBox.checked&& !friendsBox.checked && !followersBox.checked  ) 
            {
                console.log("all unchacked => public");
                value="public"
            }
           
         }
        
        //set the chosen settings to DB
        const CNote = this.noteService.getNote2(Nid, authorId)
        CNote.valueChanges().take(1).forEach(n => {
                this.noteService.updateNote2(Nid, {
                    settings: value
                }, authorId);
        });
    }

settingsOpenCheck() {
        let value;
        let privateBox=<HTMLInputElement>document.getElementById("private_checkbox"+this.note.id);
        let publicBox=<HTMLInputElement>document.getElementById("public_checkbox"+this.note.id);
        let followersBox=<HTMLInputElement>document.getElementById("followers_checkbox"+this.note.id);
        let friendsBox=<HTMLInputElement>document.getElementById("friends_checkbox"+this.note.id);
         if (privateBox&&publicBox&&friendsBox&&followersBox ) {
             //option1-public
            if (this.note.settings=="public"  ) 
            {
                publicBox.checked =true;
                privateBox.checked=false;
                friendsBox.checked =false;
                followersBox.checked =false;
               
            }
            //option2-private
            if (this.note.settings=="private"  ) 
            {
                publicBox.checked =false;
                privateBox.checked=true;
                friendsBox.checked =false;
                followersBox.checked =false;
            }
            //option3-Friends
            if (this.note.settings=="friends"  ) 
            {
                publicBox.checked =false;
                privateBox.checked=false;
                friendsBox.checked =true;
                followersBox.checked =false;
            }
            //option4-Followers
            if (this.note.settings=="followers"  ) 
            {
                publicBox.checked =false;
                privateBox.checked=false;
                friendsBox.checked =false;
                followersBox.checked =true;
            }
            //option5-Friends+Followers [FF]
            if (this.note.settings=="ff"  ) 
            {
                publicBox.checked =false;
                privateBox.checked=false;
                friendsBox.checked =true;
                followersBox.checked =true;
            }
         }
    }


    //chack switch options (uncheck necessary boxs)
    settingsCheck(flag: number){
        let privateBox=<HTMLInputElement>document.getElementById("private_checkbox"+this.note.id);
        let publicBox=<HTMLInputElement>document.getElementById("public_checkbox"+this.note.id);
        let followersBox=<HTMLInputElement>document.getElementById("followers_checkbox"+this.note.id);
        let friendsBox=<HTMLInputElement>document.getElementById("friends_checkbox"+this.note.id);

        if(flag==1){//private
         if (privateBox&&publicBox&&friendsBox&&followersBox ) {
                // privateBox.checked = false;
                publicBox.checked = false;
                followersBox.checked = false;
                friendsBox.checked = false;
            }
        }
        if(flag==2){//public
         if (privateBox&&publicBox&&friendsBox&&followersBox ) {
                privateBox.checked = false;
                // publicBox.checked = false;
                followersBox.checked = false;
                friendsBox.checked = false;
            }
        }
        if(flag==3){//friends
         if (privateBox&&publicBox&&friendsBox&&followersBox ) {
                privateBox.checked = false;
                publicBox.checked = false;
                // followersBox.checked = false;
                // friendsBox.checked = false;
            }
        }
        if(flag==4){//followers
         if (privateBox&&publicBox&&friendsBox&&followersBox ) {
                privateBox.checked = false;
                publicBox.checked = false;
                // followersBox.checked = false;
                // friendsBox.checked = false;
            }
        }
        if(flag==5){//private
         if (privateBox&&publicBox&&friendsBox&&followersBox ) {
                privateBox.checked = false;
                publicBox.checked = false;
                followersBox.checked = false;
                friendsBox.checked = false;
            }
        }
         
    }

toogleMobSettings(){
        var nid = this.note.id;
        var name = 'nid';
        var MobSettings = window[name];
        window[name]=<HTMLInputElement>document.getElementById("settingsBoxMobile"+this.note.id);
        if(window[name]){
            if(window[name].style.display=='none'){
                window[name].style.display='inline-flex'
                this.settingsOpenCheck();
            }
            else {
                window[name].style.display='none'
                this.setSettings(this.note.id,this.note.authorId);
        }
    }

}

/////////////////////////////////////------------------------------------------------------------------------------------



    //add Heart To a Note (aka like)
    addHeartToNote(val: number) {
        if (this.note.id && this.note.authorId) {
            console.log("this.note.authorId" + this.note.authorId)

            // this.noteService.updateNote(this.note.id, { hearts: val + 1 },this.note.authorId);
            this.addToHeartlist(this.note.id, this.note.authorId, val)
        } else {
            console.error('Note missing ID!');
        }
    }


    //add users uids and display names to note like list
    addToHeartlist(Nid, authorId, val) {
        //add to notificationList
        const CNote = this.noteService.getNote2(Nid, authorId)
        const CUid = this.noteService.getCurrentUid();
        const CName = this.noteService.getCurrentName();
        let subList2 = [CUid];
        CNote.valueChanges().take(1).forEach(n => {

            if (!n.heartsList || !n.heartsListNames)
                this.noteService.updateNote2(Nid, {
                    hearts: val + 1,
                    heartsList: [CUid],
                    heartsListNames: [CName]
                }, authorId);
            else if (n.heartsList)
                if (n.heartsList.indexOf(CUid) == -1 || n.heartsListNames.indexOf(CName) == -1) {
                    n.heartsList.push(CUid)
                    n.heartsListNames.push(CName)
                    this.noteService.updateNote2(Nid, {
                        hearts: val + 1,
                        heartsList: n.heartsList,
                        heartsListNames: n.heartsListNames
                    }, authorId);
                } else
                    console.log('you allrady liked this quote')

        });

    }

    deleteNote(id: string) {
        this.noteService.deleteNote(id);
    }
    
    editNote() {
        // this.noteService.updateNote2(id,data,nid);
       if (this.note.id && this.note.authorId) {
            console.log("this.note.authorId" + this.note.authorId)

               this.noteService.updateNote2(this.note.id, {
                  content: this.editContent
                }, this.note.authorId);

        } else {
            console.error('Note missing ID!');
        }
    }


    editToggle(){
        var edit = document.getElementById('editText'+this.note.id);
        var quoteText = document.getElementById('quoteText'+this.note.id);

        if (typeof edit !== "undefined" && edit && typeof quoteText !== "undefined" && quoteText) {
           if(edit.style.display=="none"){
                edit.style.display = 'inline'
                quoteText.style.display = 'none'
        }
           else{
                edit.style.display = 'none'
                quoteText.style.display = 'inline'

            }
        }
     
    }

    //show like list while mouse hover 
    mouseEnter(div: string) {
        var likes = document.getElementById(div);
        if (typeof likes !== "undefined" && likes) {
            likes.style.display = 'inline-table'
        }
    }
    mouseLeave(div: string) {
        this.wait(100)
        var likes = document.getElementById(div);
        if (typeof likes !== "undefined" && likes) {
            likes.style.display = 'none'

        }
    }

wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

}