# IMPORTANT
you must create a file called  `Defaults.ts` and provide
following exports in it so the code will work properly

## Exports
### ApiService
This class is responsible to making api calls the class which
you should export by  this name  from `Defaults.ts` file must 
`extend` the ApiService class in`@/custom/services/ApiService`

### VueInstanceService
This class is responsible for holding some important  variables
which must be singleton in application and these variables does
not need to be reactive ether  also some  basic initializations
are done in this too
