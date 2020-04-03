import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppComponent } from './app.component';
import {MsAdalAngular6Module, MsAdalAngular6Service} from 'microsoft-adal-angular6';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {TokenInterceptorService} from './token-interceptor-service';

function initializer(adalService: MsAdalAngular6Service) {
  return () => new Promise((resolve, reject) => {
    if (adalService.isAuthenticated) {
      resolve();
    } else {
      adalService.login();
    }
  });
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MsAdalAngular6Module.forRoot({
      tenant: '03be9da7-dcf7-90d7-aa86-009947e02250',
      clientId: '061d3179-0551-07ac-8110-2089e7a254d0',
      redirectUri: window.location.origin,
      navigateToLoginRequestUrl: false,
      cacheLocation: 'localStorage'
    })
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializer,
      multi: true,
      deps: [MsAdalAngular6Service]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

// https://docs.microsoft.com/en-us/azure/active-directory/develop/scenario-spa-overview
// https://github.com/microsoft/azure-spring-boot/blob/master/azure-spring-boot-starters/azure-active-directory-spring-boot-starter/README.md

// https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-configure-app-expose-web-apis

// even if we don't add the scope, it still gets the claims

// was able to get the groups for user by creating optional claims in portal however it returns group id.
// groups are not available thru public method of principal object. There is a private object principal.principal.jwtclaim.groups

// to return groups - permission is required for graph->dierctory->readall

// It appears, Roles are not returned as users are not assigned to roles. Roles will be available thru principal object.
// https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-add-app-roles-in-azure-ad-apps#declare-roles-for-an-application
// https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-enterprise-app-role-management

// the client id and tenant id on server side is meaningless for STATELESS app.
// server side checks for token expiry
// server side uses nimbusds.jose library to verify token signature

// only assigned users can be authenticated
// https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-restrict-your-app-to-a-set-of-users

// it appears server side is not validating the token by calling AAD. The token with user logged out can still access the site.
// token timeout how to confgure?

// There is no endpoint to validate the token on server side. for a moment I thought authorize endpoint is for validating token but it for
// initiating login workflow.

// It is possible to get the token silently when first token expires
// https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-implicit-grant-flow#getting-access-tokens-silently-in-the-background

// next steps
// try disassociating client id in azure portal - see if it still works? if it works we don't have a need for API registration
// try canguard https://docs.microsoft.com/en-us/azure/active-directory/develop/scenario-spa-sign-in
// explore service-to-service workflow
// explore OBO workflow


// 1)Most of the microsoft samples for Java assumes web and api will perform under same site.

// 2)The sample for front-end  is with angular 1 with springboot
// The login is presented based on clicking button from adalservice.login
// The logout is removing the credentials from local on angular side and on java it removes it from session.
// The primary basis for this application is - springboot application uses session to store JWT token information.

// 3) The sample for back-end is with springboot with index page javascript page.
//     Here springboot is responsible for presenting the login page.

// 4)The stateless sample uses vue with springboot.
// Again here the vue and springboot are using the same site localhost:8080

// There is on-behalf-of (OBO) workflow that enables Angular -> Svc 1 -> Svc2  I.e. Svc1 makes call to Svc2 on behalf of user signed in Angular.

// JWT bearer authentication middleware is used to validate the token i.e. issuer, audience client id, token signature. This is library is available in .Net Core however in Java it is not known if the filter does the same task.
