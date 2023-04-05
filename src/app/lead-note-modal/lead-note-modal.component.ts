import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-lead-note-modal',
  templateUrl: './lead-note-modal.component.html',
  styleUrls: ['./lead-note-modal.component.css']
})
export class LeadNoteModalComponent implements OnInit {
  @Input() scan: any;
  @Input() note: string;

  constructor(private modalCtrl: ModalController) { }

  cancel() {
    return this.modalCtrl.dismiss({note: null}, 'cancel');
  }

  confirm() {
    this.modalCtrl.dismiss({note: this.note}, 'save');
  }

  ngOnInit(): void {
    console.log(this.scan, this.note);
  }

}
