import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

import { CovalentLayoutModule, CovalentStepsModule /*, any other modules */ } from '@covalent/core';
// (optional) Additional Covalent Modules imports
import { CovalentHttpModule } from '@covalent/http';
import { CovalentHighlightModule } from '@covalent/highlight';
import { CovalentMarkdownModule } from '@covalent/markdown';
import { CovalentDynamicFormsModule } from '@covalent/dynamic-forms';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import {
  MdAutocompleteModule, MdButtonModule, MdButtonToggleModule, MdCardModule, MdGridListModule, MdNativeDateModule,
  MdTableModule, MdChipsModule, MdCheckboxModule, MdCoreModule, MdDialogModule, MdMenuModule, MdRadioModule,
  MdProgressSpinnerModule,
  MdRippleModule, MdSelectModule, MdSidenavModule, MdSlideToggleModule, MdSliderModule, MdSnackBarModule, MdSortModule,
  MdTabsModule, MdToolbarModule, MdTooltipModule, MdDatepickerModule, MdExpansionModule, MdIconModule, MdInputModule,
  MdPaginatorModule, MdProgressBarModule, MdListModule
} from "@angular/material";
import {CdkTableModule} from "@angular/cdk";
import {RouterModule, Routes} from "@angular/router";
import { FrontendComponent } from './components/frontend/frontend.component';
import { BackendComponent } from './components/backend/backend.component';

/**
 * Definitions for all accessible routes and their guards.
 */
const appRoutes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'frontend', component: FrontendComponent },
  { path: 'backend', component: BackendComponent },
  { path: '**', component: DashboardComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    FrontendComponent,
    BackendComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),

    MdAutocompleteModule,
    MdButtonModule,
    MdButtonToggleModule,
    MdCardModule,
    MdCheckboxModule,
    MdChipsModule,
    MdCoreModule,
    MdDatepickerModule,
    MdDialogModule,
    MdExpansionModule,
    MdGridListModule,
    MdIconModule,
    MdInputModule,
    MdListModule,
    MdMenuModule,
    MdNativeDateModule,
    MdPaginatorModule,
    MdProgressBarModule,
    MdProgressSpinnerModule,
    MdRadioModule,
    MdRippleModule,
    MdSelectModule,
    MdSidenavModule,
    MdSliderModule,
    MdSlideToggleModule,
    MdSnackBarModule,
    MdSortModule,
    MdTableModule,
    MdTabsModule,
    MdToolbarModule,
    MdTooltipModule,
    CdkTableModule,

    CovalentLayoutModule,
    CovalentStepsModule,
    // (optional) Additional Covalent Modules imports
    CovalentHttpModule.forRoot(),
    CovalentHighlightModule,
    CovalentMarkdownModule,
    CovalentDynamicFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
