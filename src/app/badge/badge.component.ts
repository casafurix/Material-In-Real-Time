import { ChangeDetectorRef, Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatBadgeModule, MatBadgePosition, MatBadgeSize } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ThemePalette } from '@angular/material/core';
import { CodeEditorComponent, CodeModel } from '@ngstack/code-editor';

export interface BadgeType {
  type: string;
  desc: string;
}

export enum BadgeTypeEnum {
  BASIC = 'Basic Badge',
  POSITIONED = 'Positioned Badge',
  SIZED = 'Sized Badge',
  OVERLAPPING = 'Overlapping Badge',
  HIDDEN = 'Hidden Badge'
}

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatBadgeModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    CodeEditorComponent
  ],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss'
})
export class BadgeComponent implements OnInit {
  badgeFormControl = new FormControl('', Validators.required);
  badgeTypeEnum = BadgeTypeEnum;
  
  // Badge properties
  badgeContent = '8';
  badgeColor: ThemePalette = 'accent';
  badgePosition: MatBadgePosition = 'above after';
  badgeSize: MatBadgeSize = 'medium';
  badgeHidden = false;
  
  badgeTypes: BadgeType[] = [
    { type: BadgeTypeEnum.BASIC, desc: 'A basic badge that displays a small counter or indicator.' },
    { type: BadgeTypeEnum.POSITIONED, desc: 'A badge that can be positioned in different locations relative to its container.' },
    { type: BadgeTypeEnum.SIZED, desc: 'A badge that can be displayed in different sizes.' },
    { type: BadgeTypeEnum.OVERLAPPING, desc: 'A badge that overlaps with its container.' },
    { type: BadgeTypeEnum.HIDDEN, desc: 'A badge that can be hidden or shown based on a condition.' }
  ];

  badgeModel: CodeModel = {
    language: 'scss',
    uri: 'style.scss',
    value: ''
  };

  badgeModelFixed: CodeModel = {
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
    // Handle badge type changes
    this.badgeFormControl.valueChanges.subscribe(value => {
      if (value) {
        this.getCodeModel(value);
        this.setFixCodeModel(value);
      }
    });
  }

  getBadgeDesc(type: string): string {
    return this.badgeTypes.find(b => b.type === type)?.desc || '';
  }

  getCodeModel(badgeType: string): void {
    let tokens: string[] = [];
    
    switch(badgeType) {
      case BadgeTypeEnum.BASIC:
        tokens = [
          '--mat-badge-background-color: #f44336;',
          '--mat-badge-text-color: white;',
          '--mat-badge-size: 22px;',
          '--mat-badge-font-size: 12px;',
          '--mat-badge-font-weight: 600;'
        ];
        break;
      case BadgeTypeEnum.POSITIONED:
        tokens = [
          '--mat-badge-background-color: #2196f3;',
          '--mat-badge-text-color: white;',
          '--mat-badge-size: 22px;',
          '--mat-badge-font-size: 12px;',
          '--mat-badge-font-weight: 600;'
        ];
        break;
      case BadgeTypeEnum.SIZED:
        tokens = [
          '--mat-badge-background-color: #4caf50;',
          '--mat-badge-text-color: white;',
          '--mat-badge-size: 24px;',
          '--mat-badge-font-size: 14px;',
          '--mat-badge-font-weight: 600;'
        ];
        break;
      case BadgeTypeEnum.OVERLAPPING:
        tokens = [
          '--mat-badge-background-color: #ff9800;',
          '--mat-badge-text-color: white;',
          '--mat-badge-size: 22px;',
          '--mat-badge-font-size: 12px;',
          '--mat-badge-font-weight: 600;',
          '--mat-badge-overlap-size: 16px;'
        ];
        break;
      case BadgeTypeEnum.HIDDEN:
        tokens = [
          '--mat-badge-background-color: #9c27b0;',
          '--mat-badge-text-color: white;',
          '--mat-badge-size: 22px;',
          '--mat-badge-font-size: 12px;',
          '--mat-badge-font-weight: 600;'
        ];
        break;
    }
    
    let res: string = ":root {\n";
    for (let token of tokens) {
      res += "\t" + token + "\n";
    }
    this.badgeModel.value = res + "}";
    this.badgeModel = JSON.parse(JSON.stringify(this.badgeModel));
  }

  setFixCodeModel(badgeType: string): void {
    let fixedCode = '{}';
    
    switch(badgeType) {
      case BadgeTypeEnum.BASIC:
        fixedCode = `// Basic Badge Styles
.demo-section {
  display: flex;
  align-items: center;
  justify-content: center;
}

.mat-badge {
  margin-right: 16px;
}

button {
  margin-right: 8px;
}`;
        break;
      case BadgeTypeEnum.POSITIONED:
        fixedCode = `// Positioned Badge Styles
.demo-section {
  display: flex;
  align-items: center;
  justify-content: center;
}

.position-options {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 16px;
}

.position-option {
  margin: 8px;
}`;
        break;
      case BadgeTypeEnum.SIZED:
        fixedCode = `// Sized Badge Styles
.demo-section {
  display: flex;
  align-items: center;
  justify-content: center;
}

.size-options {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 16px;
}

.size-option {
  margin: 8px;
}

.mat-badge.mat-badge-small {
  --mat-badge-size: 16px;
  --mat-badge-font-size: 10px;
}

.mat-badge.mat-badge-large {
  --mat-badge-size: 28px;
  --mat-badge-font-size: 16px;
}`;
        break;
      case BadgeTypeEnum.OVERLAPPING:
        fixedCode = `// Overlapping Badge Styles
.demo-section {
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-container {
  position: relative;
  display: inline-block;
  margin: 0 16px;
}

.mat-icon {
  font-size: 32px;
  height: 32px;
  width: 32px;
}`;
        break;
      case BadgeTypeEnum.HIDDEN:
        fixedCode = `// Hidden Badge Styles
.demo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.toggle-container {
  margin-top: 16px;
}

button {
  margin-right: 8px;
}`;
        break;
    }
    
    this.badgeModelFixed.value = fixedCode;
    this.badgeModelFixed = JSON.parse(JSON.stringify(this.badgeModelFixed));
  }

  onCodeChanged(value: any): void {
    console.log("injecting styles");
    this.injectStyles(value);
  }

  onCodeModelChange(value: any): void {
    console.log("code model changed", value);
  }

  async injectStyles(newStyle: string): Promise<void> {
    const styleId = 'dynamic-badge-style';

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

  toggleBadgeVisibility(): void {
    this.badgeHidden = !this.badgeHidden;
  }
  
  updateBadgePosition(position: MatBadgePosition): void {
    this.badgePosition = position;
  }
  
  updateBadgeSize(size: MatBadgeSize): void {
    this.badgeSize = size;
  }
}
