import { Component, OnInit } from '@angular/core';
interface SampleData {
  name: string
}

interface SampleMultiSelectData {
  name: string
}

@Component({
  selector: 'app-new-template-modal',
  templateUrl: './new-template-modal.component.html',
  styleUrls: ['./new-template-modal.component.scss']
})
export class NewTemplateModalComponent implements OnInit {

  sampleData: SampleData[];
  sampleMultiselectData: SampleMultiSelectData[];

  constructor() { 
    this.sampleData = [
      { name: 'Data1',},
      { name: 'Data2',},
      { name: 'Data3',},
    ];
    
    this.sampleMultiselectData = [      
      {name: 'MultiData 1'},
      {name: 'MultiData 2'},
      {name: 'MultiData 3'},
      {name: 'MultiData 4'},
      {name: 'MultiData 5'},
      {name: 'MultiData 6'},
      {name: 'MultiData 7'},
      {name: 'MultiData 8'},
      {name: 'MultiData 9'},
      {name: 'MultiData 10'},
      {name: 'MultiData 11'},
      {name: 'MultiData 12'},
      {name: 'MultiData 13'},
    ];
  }

  ngOnInit(): void {
  }

}
