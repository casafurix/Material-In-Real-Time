import { ChangeDetectorRef, Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CodeEditorComponent, CodeModel } from '@ngstack/code-editor';
import { Observable, map, startWith } from 'rxjs';

export interface AutocompleteType {
  type: string;
  desc: string;
}

export enum AutocompleteTypeEnum {
  BASIC = 'Basic Autocomplete',
  OPTION_GROUPS = 'Option Groups',
  CUSTOM_FILTER = 'Custom Filter'
}

export interface State {
  name: string;
  population: string;
  flag: string;
}

export interface PokemonGroup {
  letter: string;
  names: string[];
}

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    CodeEditorComponent
  ],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.scss'
})
export class AutocompleteComponent implements OnInit {
  autocompleteFormControl = new FormControl('', Validators.required);
  autocompleteTypeEnum = AutocompleteTypeEnum;
  
  // Basic autocomplete
  fruitControl = new FormControl('');
  fruitOptions: string[] = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape'];
  filteredOptions!: Observable<string[]>;
  
  // Option groups
  pokemonControl = new FormControl('');
  pokemonGroups: PokemonGroup[] = [
    {
      letter: 'A',
      names: ['Arbok', 'Arceus', 'Arcanine', 'Articuno']
    },
    {
      letter: 'B',
      names: ['Beedrill', 'Blastoise', 'Bulbasaur']
    },
    {
      letter: 'C',
      names: ['Charizard', 'Charmander', 'Charmeleon']
    }
  ];
  pokemonGroupOptions!: Observable<PokemonGroup[]>;
  
  // Custom filter
  stateControl = new FormControl('');
  states: State[] = [
    {
      name: 'California',
      population: '39.5M',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Flag_of_California.svg/45px-Flag_of_California.svg.png'
    },
    {
      name: 'Texas',
      population: '29.0M',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Flag_of_Texas.svg/45px-Flag_of_Texas.svg.png'
    },
    {
      name: 'New York',
      population: '19.5M',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_New_York.svg/45px-Flag_of_New_York.svg.png'
    },
    {
      name: 'Florida',
      population: '21.5M',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Flag_of_Florida.svg/45px-Flag_of_Florida.svg.png'
    }
  ];
  filteredStates!: Observable<State[]>;

  autocompleteTypes: AutocompleteType[] = [
    { type: AutocompleteTypeEnum.BASIC, desc: 'A basic autocomplete that filters options as you type.' },
    { type: AutocompleteTypeEnum.OPTION_GROUPS, desc: 'An autocomplete with options organized into groups.' },
    { type: AutocompleteTypeEnum.CUSTOM_FILTER, desc: 'An autocomplete with custom filtering and display of options.' }
  ];

  autocompleteModel: CodeModel = {
    language: 'scss',
    uri: 'style.scss',
    value: ''
  };

  autocompleteModelFixed: CodeModel = {
    language: 'scss',
    uri: 'styleFixed.scss',
    value: '{}'
  };

  theme = 'vs-dark';

  options = {
    contextmenu: true,
    minimap: {
      enabled: false
    }
  };

  constructor(private renderer: Renderer2, private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Initialize basic autocomplete
    this.filteredOptions = this.fruitControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterFruits(value || ''))
    );

    // Initialize option groups
    this.pokemonGroupOptions = this.pokemonControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterPokemonGroups(value || ''))
    );

    // Initialize custom filter
    this.filteredStates = this.stateControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterStates(value || ''))
    );

    // Handle autocomplete type changes
    this.autocompleteFormControl.valueChanges.subscribe(value => {
      if (value) {
        this.getCodeModel(value);
        this.setFixCodeModel(value);
      }
    });
  }

  getAutocompleteDesc(type: string): string {
    return this.autocompleteTypes.find(ac => ac.type === type)?.desc || '';
  }

  private _filterFruits(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.fruitOptions.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filterPokemonGroups(value: string): PokemonGroup[] {
    if (value) {
      return this.pokemonGroups
        .map(group => ({
          letter: group.letter,
          names: group.names.filter(name => name.toLowerCase().includes(value.toLowerCase()))
        }))
        .filter(group => group.names.length > 0);
    }
    return this.pokemonGroups;
  }

  private _filterStates(value: string): State[] {
    const filterValue = value.toLowerCase();
    return this.states.filter(state => state.name.toLowerCase().includes(filterValue));
  }

  getCodeModel(autocompleteType: string): void {
    let tokens: string[] = [];
    
    switch(autocompleteType) {
      case AutocompleteTypeEnum.BASIC:
        tokens = [
          '--mdc-filled-text-field-container-color: #f5f5f5;',
          '--mdc-filled-text-field-focus-active-indicator-color: #673ab7;',
          '--mdc-filled-text-field-focus-label-text-color: #673ab7;',
          '--mat-option-hover-state-layer-color: rgba(103, 58, 183, 0.08);',
          '--mat-option-selected-state-layer-color: rgba(103, 58, 183, 0.12);'
        ];
        break;
      case AutocompleteTypeEnum.OPTION_GROUPS:
        tokens = [
          '--mdc-filled-text-field-container-color: #f5f5f5;',
          '--mdc-filled-text-field-focus-active-indicator-color: #2196f3;',
          '--mdc-filled-text-field-focus-label-text-color: #2196f3;',
          '--mat-optgroup-label-text-color: #2196f3;',
          '--mat-option-hover-state-layer-color: rgba(33, 150, 243, 0.08);',
          '--mat-option-selected-state-layer-color: rgba(33, 150, 243, 0.12);'
        ];
        break;
      case AutocompleteTypeEnum.CUSTOM_FILTER:
        tokens = [
          '--mdc-filled-text-field-container-color: #f5f5f5;',
          '--mdc-filled-text-field-focus-active-indicator-color: #ff5722;',
          '--mdc-filled-text-field-focus-label-text-color: #ff5722;',
          '--mat-option-hover-state-layer-color: rgba(255, 87, 34, 0.08);',
          '--mat-option-selected-state-layer-color: rgba(255, 87, 34, 0.12);',
          '--mat-autocomplete-panel-max-height: 300px;'
        ];
        break;
    }
    
    let res: string = ":root {\n";
    for (let token of tokens) {
      res += "\t" + token + "\n";
    }
    this.autocompleteModel.value = res + "}";
    this.autocompleteModel = JSON.parse(JSON.stringify(this.autocompleteModel));
  }

  setFixCodeModel(autocompleteType: string): void {
    let fixedCode = '{}';
    
    switch(autocompleteType) {
      case AutocompleteTypeEnum.BASIC:
        fixedCode = `// Basic Autocomplete Styles
.mat-mdc-form-field {
  width: 100%;
  max-width: 400px;
}

.mat-mdc-autocomplete-panel {
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.mat-mdc-option {
  height: 48px;
  line-height: 48px;
}`;
        break;
      case AutocompleteTypeEnum.OPTION_GROUPS:
        fixedCode = `// Option Groups Autocomplete Styles
.mat-mdc-form-field {
  width: 100%;
  max-width: 400px;
}

.mat-mdc-autocomplete-panel {
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.mat-mdc-optgroup {
  margin-bottom: 8px;
}

.mat-mdc-optgroup-label {
  font-weight: 500;
}

.mat-mdc-option {
  height: 48px;
  line-height: 48px;
  padding-left: 16px;
}`;
        break;
      case AutocompleteTypeEnum.CUSTOM_FILTER:
        fixedCode = `// Custom Filter Autocomplete Styles
.mat-mdc-form-field {
  width: 100%;
  max-width: 400px;
}

.mat-mdc-autocomplete-panel {
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.example-option-img {
  vertical-align: middle;
  margin-right: 8px;
}

.mat-mdc-option {
  height: 48px;
  line-height: 48px;
  display: flex;
  align-items: center;
}

.mat-mdc-option small {
  color: rgba(0, 0, 0, 0.6);
  margin-left: 8px;
}`;
        break;
    }
    
    this.autocompleteModelFixed.value = fixedCode;
    this.autocompleteModelFixed = JSON.parse(JSON.stringify(this.autocompleteModelFixed));
  }

  onCodeChanged(value: any): void {
    console.log("injecting styles");
    this.injectStyles(value);
  }

  onCodeModelChange(value: any): void {
    console.log("code model changed", value);
  }

  async injectStyles(newStyle: string): Promise<void> {
    const styleId = 'dynamic-autocomplete-style';

    const existingStyle = document.getElementById(styleId);
    if (existingStyle) {
      existingStyle.remove();
    }

    const style = this.renderer.createElement('style');
    style.id = styleId;
    style.innerHTML = `
        ${newStyle}
    `;
    this.renderer.appendChild(document.head, style);
  }
}
