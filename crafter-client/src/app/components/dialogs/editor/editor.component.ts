import { Component, Inject } from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from "@angular/material";

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent {
  public title: string;
  public message: string;
  public confirmLabel: string = 'Ok';

  public config = {
    lineNumbers: true,
    mode: "nginx"
  };

  constructor(public dialogRef: MdDialogRef<EditorComponent>, @Inject(MD_DIALOG_DATA) public data: any) { }

}
