import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';

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
import { FrontendFormComponent } from './components/frontend-form/frontend-form.component';
import {RequestApi} from "./service/request-api";
import {MyStore} from "./store/store";

/**
 * Definitions for all accessible routes and their guards.
 */
const appRoutes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'frontend', component: FrontendComponent },
  { path: 'frontend-new', component: FrontendFormComponent },
  { path: 'backend', component: BackendComponent },
  { path: '**', component: DashboardComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    FrontendComponent,
    BackendComponent,
    FrontendFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
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
  providers: [RequestApi, MyStore],
  bootstrap: [AppComponent]
})
export class AppModule { }
